import React, { InputHTMLAttributes, useState, useEffect } from "react";
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
  id?: string;
  size?: number;
};
// ==============================================================

type WrapperProps = { labelPlacement?: "start" | "end" };

const StyledCheckBox = styled.input<CheckBoxProps & { $isChecked: boolean }>`
  appearance: none;
  outline: none;
  cursor: pointer;
  width: ${(props) => props.size || 18}px;
  height: ${(props) => props.size || 18}px;
  border: 2px solid ${(props) => props.theme.colors.text.hint};
  border-radius: 2px;
  position: relative;
  background-color: ${(props) =>
    props.$isChecked
      ? props.theme.colors[props.color || "primary"].main
      : "transparent"};
  display: inline-block;
  transition: all 0.2s ease-in-out;

  &:checked::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 30%;
    height: 60%;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -50%) rotate(45deg);
  }
`;

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
    color: ${(props) => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }

  ${color}
  ${space}
`;

const CheckBox: React.FC<
  InputHTMLAttributes<HTMLInputElement> & CheckBoxProps & SpaceProps
> = ({
  id,
  label,
  labelPlacement,
  labelColor = "secondary",
  color = "primary",
  checked,
  onChange,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked || false);
  const [checkboxId, setCheckboxId] = useState(
    id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    if (onChange) {
      onChange(event);
    }
  };

  // extract spacing props
  let spacingProps: any = {};
  for (const key in props) {
    const propKey = key as "color" | "size";
    if (key.startsWith("m") || key.startsWith("p"))
      spacingProps[propKey] = props[propKey];
  }

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
        color={color}
        checked={isChecked}
        onChange={handleChange}
        $isChecked={isChecked}
        {...props}
      />
      <label htmlFor={checkboxId}>{label}</label>
    </Wrapper>
  );
};

export default CheckBox;
