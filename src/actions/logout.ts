'use server';


import { signOut } from "auth";
import { revalidatePath } from "next/cache";

export const Logout = async () => {
    await signOut({
        redirect: true,
        redirectTo: '/',
    })

    revalidatePath('/')



    return { success: true }
}