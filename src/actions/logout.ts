'use server';


import { signOut } from "@/auth";

export const Logout = async () => {
    await signOut({
        redirect: true,
        redirectTo: '/',
    })


    
    return { success: true }
}