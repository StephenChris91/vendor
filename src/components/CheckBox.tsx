import { InputHTMLAttributes, useEffect, useState } from "react";
import styled from "styled-components";
import { color, compose, space, SpaceProps } from "styled-system";
import systemCss from "@styled-system/css";

import { colorOptions } from "../interfaces";
import { isValidProp } from "@utils/utils";

// ==============================================================
type CheckBoxProps = {
  color?: colorOptions;
  labelColor?: colorOptions;
  labelPlacement?: "start" | "end";
  label?: any;
  id?: any;
  size?: number;
};
// ==============================================================

type WrapperProps = { labelPlacement?: "start" | "end" };

const StyledCheckBox = styled.input.withConfig({
  shouldForwardProp: (prop: string) => isValidProp(prop),
})<CheckBoxProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ color, size }) =>
    systemCss({
      appearance: "none",
      outline: "none",
      cursor: "pointer",

      margin: 0,
      width: size,
      height: size,
      border: "2px solid",
      borderColor: "text.hint",
      borderRadius: 2,
      position: "relative",

      "&:checked": {
        borderColor: color,
        backgroundColor: color,
      },

      /* create custom checkbox appearance */
      "&:after": {
        content: '""',
        position: "absolute",
        display: "none",
        left: "50%",
        top: "50%",
        width: "30%",
        height: "60%",
        border: "solid white",
        borderWidth: "0 2px 2px 0",
        transform: "translate(-50%, -60%) rotate(45deg)",
      },

      /* appearance for checked checkbox */
      "&:checked:after": {
        display: "block",
      },

      "&:disabled": {
        borderColor: `text.disabled`,
        backgroundColor: `text.disabled`,
      },

      "&:checked:disabled:after": {
        borderColor: "white",
      },
    }),
  compose(color)
);

const Wrapper = styled.div.withConfig({
  shouldForwardProp: (prop: string) => isValidProp(prop),
})<WrapperProps & SpaceProps>`
  display: flex;
  align-items: center;
  flex-direction: ${(props) =>
    props.labelPlacement !== "end" ? "row" : "row-reverse"};
  input {
    ${(props) =>
      props.labelPlacement !== "end"
        ? "margin-right: 0.5rem"
        : "margin-left: 0.5rem"};
  }
  label {
    cursor: pointer;
  }
  input[disabled] + label {
    color: disabled;
    cursor: unset;
  }

  ${color}
  ${space}
`;

const CheckBox = ({
  id,
  label,
  labelPlacement,
  labelColor = "secondary",
  color = "primary",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & CheckBoxProps & SpaceProps) => {
  const [checkboxId, setCheckboxId] = useState(id);

  // extract spacing props
  let spacingProps: any = {};
  for (const key in props) {
    const propKey = key as "color" | "size";
    if (key.startsWith("m") || key.startsWith("p"))
      spacingProps[propKey] = props[propKey];
  }

  useEffect(() => setCheckboxId(Math.random()), []);

  return (
    <Wrapper
      size={18}
      color={`${labelColor}.main`}
      labelPlacement={labelPlacement}
      {...spacingProps}
    >
      <StyledCheckBox
        id={checkboxId}
        type="checkbox"
        color={`${color}`}
        {...props}
      />
      <label htmlFor={checkboxId}>{label}</label>
    </Wrapper>
  );
};

export default CheckBox;
