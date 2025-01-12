import { ClerkProvider } from "@clerk/nextjs";


export default function Home() {
    return(
        <ClerkProvider afterSignOutUrl={"/"}>

        <div>
            this is a page
        </div>
        </ClerkProvider>
    )
}