"use client";

import { useState, useEffect } from "react";
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
import styled from "styled-components";

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

const MobileNavToggle = styled(Icon)`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const SideNav = styled(Box)<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: ${(props) => (props.open ? "0" : "-300px")};
  width: 300px;
  height: 100%;
  background-color: white;
  transition: left 0.3s ease-in-out;
  z-index: 1000;
  overflow-y: auto;
`;

const Overlay = styled(Box)<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.open ? "block" : "none")};
  z-index: 999;
`;

export default function Navbar({ navListOpen }: NavbarProps) {
  const user = useCurrentUser();
  const router = useRouter();
  const windowWidth = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const [sideNavOpen, setSideNavOpen] = useState(false);

  useEffect(() => {
    if (windowWidth !== null) {
      setIsMobile(windowWidth < 768);
    }
  }, [windowWidth]);

  const handleNavClick = (nav: Nav) => {
    if (nav.requiresAuth && !user) {
      router.push("/login");
    } else if (nav.url) {
      router.push(nav.url);
    }
    if (isMobile) {
      setSideNavOpen(false);
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

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const MobileMenu = () => (
    <>
      <SideNav open={sideNavOpen}>
        <FlexBox justifyContent="space-between" p="1rem">
          <Typography variant="h6">Menu</Typography>
          <Icon onClick={toggleSideNav}>close</Icon>
        </FlexBox>
        <Box p="1rem">{renderNestedNav(navbarNavigations)}</Box>
      </SideNav>
      <Overlay open={sideNavOpen} onClick={toggleSideNav} />
    </>
  );

  const NavbarContent = () => (
    <Container
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      {isMobile ? (
        <MobileNavToggle onClick={toggleSideNav}>menu</MobileNavToggle>
      ) : (
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
      )}
      {!isMobile && (
        <FlexBox style={{ gap: 32 }}>
          {renderNestedNav(navbarNavigations, true)}
        </FlexBox>
      )}
    </Container>
  );

  return (
    <StyledNavbar>
      <NavbarContent />
      {isMobile && <MobileMenu />}
    </StyledNavbar>
  );
}
