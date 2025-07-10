import {signIn} from "@/auth";
import {redirect} from "next/navigation";

export function SignInButtonLarge() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("keycloak");
                redirect("/dashboard");
            }}
        >
            <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 text-white text-xl font-semibold shadow-lg hover:bg-indigo-700 transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
                Get Started Now
            </button>
        </form>
    )
}