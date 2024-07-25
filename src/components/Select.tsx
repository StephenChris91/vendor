import React from "react";
import { SpaceProps } from "styled-system";
import ReactSelect, { Props } from "react-select";

import Box from "@component/Box";
import Typography from "@component/Typography";
import { colors } from "@utils/themeColors";

export type SelectOption = { label: string; value: string };

interface SelectProps extends Omit<Props, "onChange">, SpaceProps {
  value?: SelectOption | null;
  label?: string;
  errorText?: string;
  options: SelectOption[];
  onChange: (option: SelectOption | null) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  errorText,
  onChange,
  ...props
}) => {
  // extract spacing props
  let spacingProps = {};
  for (const key in props) {
    if (key.startsWith("m") || key.startsWith("p"))
      spacingProps[key] = props[key];
  }

  return (
    <Box {...spacingProps}>
      {label && (
        <Typography fontSize="0.875rem" mb="6px">
          {label}
        </Typography>
      )}

      <ReactSelect
        options={options}
        styles={customStyles}
        onChange={(option) => onChange(option as SelectOption | null)}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary50: colors.gray[100],
            primary: colors.primary.main,
            neutral20: colors.text.disabled,
          },
        })}
        {...props}
      />

      {errorText && (
        <Typography color="error.main" ml="0.25rem" mt="0.25rem" as="small">
          {errorText}
        </Typography>
      )}
    </Box>
  );
};

const customStyles = {
  input: (styles) => ({ ...styles, height: 30 }),
  option: (provided, state) => ({
    ...provided,
    color: "inherit",
    cursor: "pointer",
    backgroundColor: state.isFocused ? "rgba(0,0,0, 0.015)" : "inherit",
  }),
};

export default Select;
