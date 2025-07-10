import Link from "next/link";
import SignOut from "@/components/sign-out";
import SignIn from "@/components/sign-in";
import { auth } from "@/auth"; //

export default async function NavHeader() {
    const session = await auth(); // resolved server-side!
    const user = session?.user;

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
            <Link href="/" className="text-xl font-bold text-blue-600">
                Maiita Care
            </Link>

            <nav className="flex items-center gap-4">
                {!session ? (
                    <SignIn />
                ) : (
                    <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hi, {user?.name || user?.email}
            </span>
                        <SignOut />
                    </div>
                )}
            </nav>
        </header>
    );
}
