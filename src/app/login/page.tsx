import LoginForm from "@/components/auth/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side - Login form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">
                        Welcome back
                    </h1>
                    <LoginForm />
                </div>
            </div>

            {/* Right side - Branding panel */}
            <div className="hidden lg:flex flex-1 bg-[#2563EB] items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <h2 className="text-4xl font-bold mb-6">ticktock</h2>
                    <p className="text-lg leading-relaxed text-blue-100">
                        Introducing ticktock, our cutting-edge timesheet web application
                        designed to revolutionize how you manage employee work hours. With
                        ticktock, you can effortlessly track and monitor employee attendance
                        and productivity from anywhere, anytime, using any
                        internet-connected device.
                    </p>
                </div>
            </div>
        </div>
    );
}
