import Link from "next/link";
import SignOut from "@/components/sign-out";
import React from "react";
import {auth} from "@/auth";
import SignIn from "@/components/sign-in";

export default async function Header() {
    const session = await auth();
    const user = session?.user;


    return (
        <header className="bg-white shadow-md p-3 sm:p-4 md:p-6 flex justify-between items-center z-10">
            <Link href="/"
                  className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 hover:text-green-800 transition-colors duration-300">
                <span className="hidden sm:inline">MicroBank Dashboard</span>
                <span className="sm:hidden">MicroBank</span>
            </Link>
            <nav className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                {
                    !session ? (
                        <SignIn/>
                    ) : (
                        <>
                            <Link href="/client/profile"
                                  className="px-2 sm:px-3 md:px-4 py-2 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-300 font-medium">
                                <span className="hidden sm:inline">Profile</span>
                                <span className="sm:hidden">&#128100;</span>
                            </Link>
                            <SignOut/></>


                    )
                }

            </nav>
        </header>
    )
}