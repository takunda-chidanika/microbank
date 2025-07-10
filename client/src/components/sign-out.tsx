import {signOut} from "@/auth"

export default function SignOut() {
    return (
        <form
            action={async () => {
                "use server"
                await signOut({redirectTo: "/"});
            }}
        >
            <button
                type="submit"
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
            >
                Sign Out
            </button>
        </form>
    )
}