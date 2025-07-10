import Link from "next/link";
import SignIn from "@/components/sign-in";
import {SignInButtonLarge} from "@/components/sign-up";
import SignOut from "@/components/sign-out";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 font-sans text-gray-900">
            {/* Navbar */}
            <header className="w-full p-3 sm:p-4 lg:p-6 bg-white shadow-sm">
                <nav className="container mx-auto flex justify-between items-center">
                    <Link href="/"
                          className="text-xl sm:text-2xl font-bold text-green-700 hover:text-green-800 transition-colors duration-300">
                        MicroBank
                    </Link>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <SignIn/>
                        <SignOut/>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto flex flex-col items-center justify-center text-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 text-gray-900 max-w-5xl">
                    Your Future, Simplified.
                    <br className="hidden sm:block"/>
                    <span className="sm:hidden"> </span>
                    Seamless Banking.
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl lg:max-w-3xl mb-8 sm:mb-10 px-2">
                    Experience modern banking designed for you. Manage your finances,
                    make transactions, and secure your future with ease.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <SignInButtonLarge/>
                </div>
            </main>

            {/* Features Section */}
            <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
                <div className="container mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-gray-800">
                        Why Choose MicroBank?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="p-4 sm:p-6 rounded-xl shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:scale-105">
                            <div className="text-green-600 text-4xl sm:text-5xl mb-3 sm:mb-4">
                                &#128176;
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Smart Savings</h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                Tools to help you save effortlessly and reach your financial goals faster.
                            </p>
                        </div>
                        <div className="p-4 sm:p-6 rounded-xl shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:scale-105">
                            <div className="text-green-600 text-4xl sm:text-5xl mb-3 sm:mb-4">
                                &#128241;
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Mobile First</h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                Manage your accounts anytime, anywhere, right from your smartphone.
                            </p>
                        </div>
                        <div className="p-4 sm:p-6 rounded-xl shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:scale-105 sm:col-span-2 lg:col-span-1">
                            <div className="text-green-600 text-4xl sm:text-5xl mb-3 sm:mb-4">
                                &#128272;
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Secure & Reliable</h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                Your security is our top priority. Bank with confidence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto text-center text-sm">
                    <p className="mb-2 sm:mb-3">&copy; {new Date().getFullYear()} MicroBank. All rights reserved.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <Link href="#" className="hover:text-green-300 transition-colors duration-300">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-green-300 transition-colors duration-300">
                            Terms of Service
                        </Link>
                        <Link href="#" className="hover:text-green-300 transition-colors duration-300">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}