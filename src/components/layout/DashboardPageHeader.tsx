"use client";

import { ReactNode, useState } from "react";

import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { H2 } from "@component/Typography";
import useWindowSize from "@hook/useWindowSize";
import Sidenav from "@component/sidenav/Sidenav";
import DashboardNavigation from "./DashboardNavigation";
import { IconButton } from "@component/buttons";

// ==============================================================
export interface DashboardPageHeaderProps {
  title?: string;
  iconName?: string;
  button?: ReactNode;
}
// ==============================================================

export default function DashboardPageHeader({
  iconName,
  title,
  button,
}: DashboardPageHeaderProps) {
  const width = useWindowSize();
  const isTablet = width < 1025;
  const [sidenavOpen, setSidenavOpen] = useState(false);

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
  };

  return (
    <Box mb="1.5rem" mt="-1rem">
      <FlexBox justifyContent="space-between" alignItems="center" mt="1rem">
        <FlexBox alignItems="center">
          {iconName ? <Icon color="primary">{iconName}</Icon> : null}
          <H2 ml="12px" my="0px" lineHeight="1" whitespace="pre">
            {title}
          </H2>
        </FlexBox>

        {isTablet && (
          <IconButton onClick={toggleSidenav}>
            <Icon>{sidenavOpen ? "close" : "menu"}</Icon>
          </IconButton>
        )}

        {!isTablet && button}
      </FlexBox>

      {isTablet && (
        <Sidenav
          position="left"
          open={sidenavOpen}
          width={260}
          handle={<></>}
          toggleSidenav={toggleSidenav}
        >
          <DashboardNavigation />
        </Sidenav>
      )}

      {isTablet && !!button && <Box mt="1rem">{button}</Box>}
    </Box>
  );
}
