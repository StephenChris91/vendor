import { useSession } from 'next-auth/react';

export const useCurrentUser = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return undefined;
    }

    const user = session?.user;
    return user;
}
