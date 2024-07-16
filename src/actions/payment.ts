import { auth } from "@/auth";
import { db } from "@/prisma/prisma";
import axios from "axios";

interface paymentProps {
    config: {
        email: string,
        amount: number,
        reference: string
    },

}


const payment = async ({ config }: paymentProps) => {
    const { email, amount, reference } = config;
    const session = await auth();

    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amount * 100,
                reference
            }
        );

        if (response.data.status === false) {
            return response.data;
        }

        db.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                hasPaid: true
            }
        });

        return response.data;
    } catch (error) {
        return error;
    }
}