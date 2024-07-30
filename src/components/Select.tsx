import React from "react";
import { SpaceProps } from "styled-system";
import ReactSelect, { Props, StylesConfig } from "react-select";
import Box from "@component/Box";
import Typography from "@component/Typography";
import { colors } from "@utils/themeColors";

export type SelectOption = {
  id?: string;
  name?: string;
  slug?: string;
  label?: string;
  value?: string;
  placeholder?: string;
};

interface SelectProps
  extends Omit<Props<SelectOption, boolean>, "onChange">,
    SpaceProps {
  value?: SelectOption | SelectOption[] | null;
  label?: string;
  errorText?: string;
  options: SelectOption[];
  isMulti?: boolean;
  onChange?: (option: SelectOption | SelectOption[] | null) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  errorText,
  onChange,
  isMulti,
  ...props
}) => {
  // extract spacing props
  const spacingProps: SpaceProps = {};
  for (const key in props) {
    if (key.startsWith("m") || key.startsWith("p")) {
      spacingProps[key] = props[key];
      delete props[key];
    }
  }

  const customStyles: StylesConfig<SelectOption, boolean> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? colors.primary.main : colors.gray[300],
      boxShadow: state.isFocused ? `0 0 0 2px ${colors.primary[100]}` : "none",
      "&:hover": {
        borderColor: colors.primary.main,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      color: "inherit",
      cursor: "pointer",
      backgroundColor: state.isFocused ? "rgba(0,0,0, 0.015)" : "inherit",
    }),
    input: (styles) => ({ ...styles, height: 30 }),
    placeholder: (provided) => ({
      ...provided,
      color: colors.gray[500],
    }),
    singleValue: (provided) => ({
      ...provided,
      color: colors.gray[900],
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: colors.primary[100],
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: colors.primary.main,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: colors.primary.main,
      "&:hover": {
        backgroundColor: colors.primary[200],
        color: colors.primary.dark,
      },
    }),
  };

  return (
    <Box {...spacingProps}>
      {label && (
        <Typography fontSize="0.875rem" mb="6px">
          {label}
        </Typography>
      )}

      <ReactSelect<SelectOption, boolean>
        options={options}
        styles={customStyles}
        isMulti={isMulti}
        onChange={(option) =>
          onChange(
            isMulti
              ? (option as SelectOption[])
              : (option as SelectOption | null)
          )
        }
        getOptionLabel={(option: SelectOption) => option.name}
        getOptionValue={(option: SelectOption) => option.id}
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

export default Select;
