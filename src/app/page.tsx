"use client";

import Box from "@component/Box";
// PAGE SECTION COMPONENTS

import HomeLanding from "./(layout-1)/market-1/page";
import { Footer1 } from "@component/footer";
import { Header } from "@component/header";
import Topbar from "@component/topbar";
import MobileNavigationBar from "@component/mobile-navigation";

export default function Home() {
  return (
    <Box id="top" overflow="hidden" bg="gray.white">
      <Topbar />
      {/* <MobileNavigationBar /> */}
      <Header />
      <HomeLanding />
      <Footer1 />
    </Box>
  );
}
