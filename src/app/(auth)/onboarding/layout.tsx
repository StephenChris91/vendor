import { PropsWithChildren } from "react";
import FlexBox from "@component/FlexBox";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <FlexBox
      height="auto"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      {children}
    </FlexBox>
  );
}
