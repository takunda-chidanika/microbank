import {signIn} from "@/auth"

export default function SignIn() {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("keycloak", {redirectTo: "/client"});
            }}
        >
            <button
                type="submit"
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base text-green-600 border border-green-600 hover:bg-green-50 hover:border-green-700 hover:text-green-700 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
            >
                Sign In
            </button>
        </form>
    )
}