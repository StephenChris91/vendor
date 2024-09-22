"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "../Box";
import Card from "../Card";
import Badge from "../badge";
import Icon from "../icon/Icon";
import FlexBox from "../FlexBox";
import NavLink from "../nav-link";
import MenuItem from "../MenuItem";
import { Button } from "../buttons";
import Container from "../Container";
import Typography, { Span } from "../Typography";
import Categories from "../categories/Categories";
import StyledNavbar from "./styles";
import navbarNavigations from "@data/navbarNavigations";
import { useCurrentUser } from "@lib/use-session-client";
import useWindowSize from "@hook/useWindowSize";

interface Nav {
  url: string;
  child?: Nav[];
  title: string;
  badge?: string;
  extLink?: boolean;
  requiresAuth?: boolean;
  requiresNoAuth?: boolean;
  requiresRole?: string;
}

type NavbarProps = { navListOpen?: boolean };

export default function Navbar({ navListOpen }: NavbarProps) {
  const user = useCurrentUser();
  const router = useRouter();
  const windowWidth = useWindowSize();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (nav: Nav) => {
    if (nav.requiresAuth && !user) {
      router.push("/login");
    } else if (nav.url) {
      router.push(nav.url);
    }
  };

  const renderNestedNav = (list: Nav[], isRoot = false) => {
    return list?.map((nav: Nav) => {
      if (nav.requiresAuth && !user) return null;
      if (nav.requiresNoAuth && user) return null;
      if (nav.requiresRole && user?.role !== nav.requiresRole) return null;

      if (isRoot) {
        if (nav.url && nav.extLink) {
          return (
            <NavLink
              href={nav.url}
              key={nav.title}
              target="_blank"
              className="nav-link"
              rel="noopener noreferrer"
            >
              {nav.badge ? (
                <Badge style={{ marginRight: "0px" }} title={nav.badge}>
                  {nav.title}
                </Badge>
              ) : (
                <Span className="nav-link">{nav.title}</Span>
              )}
            </NavLink>
          );
        }

        if (nav.child) {
          return (
            <FlexBox
              className="root"
              position="relative"
              flexDirection="column"
              alignItems="center"
              key={nav.title}
            >
              <Span className="nav-link" onClick={() => handleNavClick(nav)}>
                {nav.title}
              </Span>
              <div className="root-child">
                <Card
                  borderRadius={8}
                  mt="1.25rem"
                  py="0.5rem"
                  boxShadow="large"
                  minWidth="230px"
                >
                  {renderNestedNav(nav.child)}
                </Card>
              </div>
            </FlexBox>
          );
        }

        return (
          <Span
            className="nav-link"
            key={nav.title}
            onClick={() => handleNavClick(nav)}
          >
            {nav.badge ? (
              <Badge style={{ marginRight: "0px" }} title={nav.badge}>
                {nav.title}
              </Badge>
            ) : (
              nav.title
            )}
          </Span>
        );
      } else {
        if (nav.url) {
          return (
            <MenuItem key={nav.title} onClick={() => handleNavClick(nav)}>
              {nav.badge ? (
                <Badge style={{ marginRight: "0px" }} title={nav.badge}>
                  {nav.title}
                </Badge>
              ) : (
                <Span className="nav-link">{nav.title}</Span>
              )}
            </MenuItem>
          );
        }

        if (nav.child) {
          return (
            <Box
              className="parent"
              position="relative"
              minWidth="230px"
              key={nav.title}
            >
              <MenuItem
                color="gray.700"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Span className="nav-link">{nav.title}</Span>
                <Icon size="8px" defaultcolor="currentColor">
                  right-arrow
                </Icon>
              </MenuItem>

              <Box className="child" pl="0.5rem">
                <Card
                  py="0.5rem"
                  borderRadius={8}
                  boxShadow="large"
                  minWidth="230px"
                >
                  {renderNestedNav(nav.child)}
                </Card>
              </Box>
            </Box>
          );
        }
      }
    });
  };

  const MobileMenu = () => (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="white"
      zIndex="1000"
      overflowY="auto"
      p="1rem"
    >
      <FlexBox justifyContent="space-between" mb="1rem">
        <Typography variant="h6">Menu</Typography>
        <Icon onClick={() => setMobileMenuOpen(false)}>close</Icon>
      </FlexBox>
      <Box>{renderNestedNav(navbarNavigations)}</Box>
    </Box>
  );

  const DesktopNavbar = () => (
    <StyledNavbar>
      <Container
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Categories open={navListOpen}>
          <Button width="278px" height="40px" bg="body.default" variant="text">
            <Icon>categories</Icon>
            <Typography
              ml="10px"
              flex="1 1 0"
              fontWeight="600"
              textAlign="left"
              color="text.muted"
            >
              Categories
            </Typography>
            <Icon className="dropdown-icon" variant="small">
              chevron-right
            </Icon>
          </Button>
        </Categories>
        <FlexBox style={{ gap: 32 }}>
          {renderNestedNav(navbarNavigations, true)}
        </FlexBox>
      </Container>
    </StyledNavbar>
  );

  const MobileNavbar = () => (
    <StyledNavbar>
      <Container
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Icon onClick={() => setMobileMenuOpen(true)}>menu</Icon>
        <Typography variant="h6">Vendorspot</Typography>
        <Icon>search</Icon>
      </Container>
      {mobileMenuOpen && <MobileMenu />}
    </StyledNavbar>
  );

  return windowWidth && windowWidth < 768 ? (
    <MobileNavbar />
  ) : (
    <DesktopNavbar />
  );
}
