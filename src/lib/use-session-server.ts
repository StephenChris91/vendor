import { auth } from "@/auth"



export const useCurrentUser = async () => {
    const session = await auth();
    const user = session?.user;
    console.log('User from server: ', user)

    return user;
}


export const useCurrentSession = async () => {
    const session = await auth();
    // const user = session;
    console.log('Session from server: ', session)

    return session;
}