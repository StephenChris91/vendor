import { useSession } from 'next-auth/react';

export const useCurrentUser = () => {
    const { data: session, status } = useSession();
    console.log("Session:", session);
    
    if (status === "loading") {
        return undefined;
    }

    const user = session?.user;
    console.log("User from client:", user);
    return user;
}
