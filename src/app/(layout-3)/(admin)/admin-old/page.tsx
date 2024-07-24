import { H1 } from "@component/Typography";
import Flexbox from "@component/FlexBox";
import React from "react";

interface pageProps {}

const page: React.FC<pageProps> = () => {
  return (
    <Flexbox>
      <H1>This is the Admin page</H1>
    </Flexbox>
  );
};

export default page;
