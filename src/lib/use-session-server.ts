import { auth } from "auth"



export const useCurrentUser = async () => {
    const session = await auth();
    const user = session?.user;

    return user;
}


export const useCurrentSession = async () => {
    const session = await auth();

    return session;
}