/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function useRouterIfLoggedIn() {
    const router = useRouter();

    useEffect(() => {
        // Ensure code runs only in the client environment
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("next_username");

            if (user !== null) {
                router.push("/backoffice/sale");
            }
            router.push("/signin");
        }
    }, [router]);
}

export default function Home() {
    // Invoke custom hook for redirection
    useRouterIfLoggedIn();

    return (
        <div>
            {/* Add any additional content or components here */}
        </div>
    );
}