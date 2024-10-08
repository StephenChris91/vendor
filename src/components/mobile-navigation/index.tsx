import styled from "styled-components";
import { Chip } from "@component/Chip";
import Icon from "@component/icon/Icon";
import NavLink from "@component/nav-link";
import { useAppContext } from "@context/app-context";
import useWindowSize from "@hook/useWindowSize";
import { getTheme } from "@utils/utils";
import { layoutConstant } from "@utils/constants";
import { useAuth } from "@context/authContext";
import Login from "@sections/auth/Login";
import LoginDialog from "@component/header/LoginDialog";
import { LogoutButton } from "@component/logout-button";
import FlexBox from "@component/FlexBox";
import { useState } from "react";
import { BsPersonVcard } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";

// STYLED COMPONENT
const Wrapper = styled.div`
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
  position: fixed;
  align-items: center;
  justify-content: space-around;
  height: ${layoutConstant.mobileNavHeight};
  background: ${getTheme("colors.body.paper")};
  box-shadow: 0px 1px 4px 3px rgba(0, 0, 0, 0.1);
  z-index: 999;

  .link {
    flex: 1 1 0;
    display: flex;
    font-size: 13px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    color: inherit;
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;

    .icon {
      display: flex;
      margin-bottom: 4px;
      align-items: center;
      justify-content: center;
    }
  }

  @media only screen and (max-width: 900px) {
    display: flex;
    width: 100vw;
  }
`;

export default function MobileNavigationBar() {
  const width = useWindowSize();
  const { state } = useAppContext();
  const { user, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const LOGIN_HANDLE = (
    <div className="link">
      <Icon className="icon" variant="small">
        user
      </Icon>
      <BsPersonVcard size={20} />
    </div>
  );

  if (width <= 900) {
    return (
      <Wrapper>
        {list.map((item) => (
          <NavLink className="link" href={item.href} key={item.title}>
            <Icon className="icon" variant="small">
              {item.icon}
            </Icon>

            {item.title}

            {item.title === "Cart" && !!state.cart.length && (
              <Chip
                top="4px"
                px="0.25rem"
                fontWeight="600"
                bg="primary.main"
                position="absolute"
                color="primary.text"
                left="calc(50% + 8px)"
              >
                {state.cart.length}
              </Chip>
            )}
          </NavLink>
        ))}
        {user && user.role === "Vendor" && (
          <NavLink className="link" href="/vendor/dashboard">
            <RxDashboard size={24} />
            Dashboard
          </NavLink>
        )}
        <FlexBox className="header-right" alignItems="center">
          {user ? (
            <LogoutButton>{user.firstname}</LogoutButton>
          ) : (
            <LoginDialog handle={LOGIN_HANDLE}>
              <Login />
            </LoginDialog>
          )}
        </FlexBox>
      </Wrapper>
    );
  }

  return null;
}

const list = [
  { title: "Home", icon: "home", href: "/" },
  { title: "Category", icon: "category", href: "/mobile-category-nav" },
  { title: "Cart", icon: "bag", href: "/cart" },
];
