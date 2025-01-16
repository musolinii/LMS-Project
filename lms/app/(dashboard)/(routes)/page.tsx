import { ClerkProvider, UserButton } from "@clerk/nextjs";


export default function Home() {
    return(
        <ClerkProvider afterSignOutUrl={"/sign-in"}>
            <UserButton />
            <div>
                this is a page
            </div>
        </ClerkProvider>
    )
}