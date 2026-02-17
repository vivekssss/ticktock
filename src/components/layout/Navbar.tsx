"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { toast } from "react-toastify";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        toast.success("Successfully logged out!");
        signOut({ callbackUrl: "/login" });
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!session) return null;

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Left side  */}
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center">
                            <span className="text-xl font-bold text-gray-900">ticktock</span>
                        </Link>
                        <Link
                            href="/dashboard"
                            className={cn(
                                "text-sm font-medium transition-colors",
                                pathname.startsWith("/dashboard")
                                    ? "text-gray-900"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            Timesheets
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                    {session.user?.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </span>
                            </div>
                            <span className="hidden sm:inline font-medium">
                                {session.user?.name}
                            </span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">
                                        {session.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {session.user?.email}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        setLogoutModalOpen(true);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={logoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Sign Out"
                message="Are you sure you want to sign out of your account?"
                confirmText="Sign Out"
                variant="danger"
            />
        </nav>
    );
}
