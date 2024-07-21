import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            firstname: string
            lastname: string
            isOnboardedVendor: boolean
        } & DefaultSession["user"]
    }

    interface User {
        role: string
        firstname: string
        lastname: string
        isOnboardedVendor: boolean
    }
}