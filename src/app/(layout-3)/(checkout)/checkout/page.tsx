"use client";

// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Typography from "@component/Typography";
import { Button } from "@component/buttons";
// PAGE SECTION COMPONENTS
import CheckoutForm from "@sections/checkout/CheckoutForm";
import CheckoutSummary from "@sections/checkout/CheckoutSummary";
import Link from "next/link";
import { useCart } from "hooks/useCart";

export default function Checkout() {
  const { cartItems } = useCart();

  // if (cartItems.length === 0) {
  //   return (
  //     <Box mt="2rem" mb="2rem">
  //       <Typography color="gray.600" mb="1rem">
  //         Your cart is empty.
  //       </Typography>
  //       <Link href="/">
  //         <Button size="small" variant="contained">
  //           <Link href="/shop">Continue Shopping</Link>
  //         </Button>
  //       </Link>
  //     </Box>
  //   );
  // }
  return (
    <Grid container flexWrap="wrap-reverse" spacing={6}>
      <Grid item lg={8} md={8} xs={12}>
        <CheckoutForm />
      </Grid>

      <Grid item lg={4} md={4} xs={12}>
        <CheckoutSummary />
      </Grid>
    </Grid>
  );
}
