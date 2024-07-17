
import { auth } from "auth"


export const currentUser = async () => {
    const session = await auth()

    console.log('Server session:', session?.user)
    return session?.user
}

export const useCurrentRole = async () => {

    const user = await currentUser()

    return user?.role
}

