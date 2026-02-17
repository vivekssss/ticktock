import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
    // @ts-expect-error trustHost is a valid option in newer NextAuth versions but generic types might not reflect it yet
    trustHost: true,


    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const client = await clientPromise;
                const db = client.db("ticktock");
                const user = await db.collection("users").findOne({ email: credentials.email });

                if (!user) {
                    return null;
                }

                // In a real app, compare hashed passwords here.
                // For this assessment, we are using plain text as per the mock data.
                if (user.password !== credentials.password) {
                    return null;
                }

                return {
                    id: user.id, // Using our custom ID field
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
