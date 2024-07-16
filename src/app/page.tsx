import Box from "@component/Box";
// PAGE SECTION COMPONENTS
import Footer from "@sections/landing/footer";
import Section1 from "@sections/landing/Section1";
import Section2 from "@sections/landing/Section2";
import Section3 from "@sections/landing/Section3";
import Section4 from "@sections/landing/Section4";
import Section5 from "@sections/landing/Section5";
import HomeLanding from "./(layout-1)/market-1/page";
import { Footer1 } from "@component/footer";
import { Header } from "@component/header";
import Topbar from "@component/topbar";

export default function Home() {
  return (
    <Box id="top" overflow="hidden" bg="gray.white">
      <Topbar />
      <Header />
      <HomeLanding />
      <Footer1 />
    </Box>
  );
}
