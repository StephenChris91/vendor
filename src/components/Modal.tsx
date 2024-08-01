import { ReactElement, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import FlexBox from "./FlexBox";
import { isValidProp } from "@utils/utils";

// STYLED COMPONENT
const StyledModal = styled(FlexBox).withConfig({
  shouldForwardProp: (prop: string) => isValidProp(prop),
})<{ open?: boolean }>(({ open }) => ({
  inset: 0,
  zIndex: 999,
  height: "100%",
  position: "fixed",
  alignItems: "center",
  flexDirection: "column",
  opacity: open ? 1 : 0,
  visibility: open ? "visible" : "hidden",
  background: open ? "rgba(0, 0, 0, 0.6)" : "transparent",
  transition: "all 200ms",
  "& .container": {
    top: "50%",
    width: "auto",
    maxWidth: "90%",
    overflow: "auto",
    position: "relative",
    transform: "translateY(-50%)",
  },
}));

// ===============================================================
type ModalProps = {
  open?: boolean;
  onClose?: () => void;
  children?: ReactElement;
};
// ===============================================================

export default function Modal({ children, open = false, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (onClose) onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (globalThis.document && open) {
    let modal = document.querySelector("#modal-root");

    if (!modal) {
      modal = document.createElement("div");
      modal.setAttribute("id", "modal-root");
      document.body.appendChild(modal);
    }

    return createPortal(
      <StyledModal open={open} alignItems="center" flexDirection="column">
        <div className="container" ref={modalRef}>
          <FlexBox justifyContent="center" m="0.5rem">
            {children}
          </FlexBox>
        </div>
      </StyledModal>,
      modal
    );
  }

  return null;
}
