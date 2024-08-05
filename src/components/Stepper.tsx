import React from "react";
import styled from "styled-components";
import FlexBox from "@component/FlexBox";
import { Small } from "@component/Typography";

const StepperWrapper = styled(FlexBox)`
  margin-bottom: 2rem;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  ${({ active, completed, theme }) => `
    background-color: ${
      active || completed ? theme.colors.primary.main : theme.colors.gray[200]
    };
    color: ${active || completed ? theme.colors.blue : theme.colors.gray[600]};
  `}
`;

const StepConnector = styled.div<{ completed: boolean }>`
  flex: 1;
  height: 4px;
  ${({ completed, theme }) => `
    background-color: ${
      completed ? theme.colors.primary.main : theme.colors.gray[200]
    };
  `}
`;

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <StepperWrapper>
      {steps?.map((step, index) => (
        <React.Fragment key={index}>
          <FlexBox flexDirection="column" alignItems="center">
            <Step
              active={index === currentStep}
              completed={index < currentStep}
            >
              {index + 1}
            </Step>
            <Small mt="0.5rem">{step}</Small>
          </FlexBox>
          {index < steps.length - 1 && (
            <StepConnector completed={index < currentStep} />
          )}
        </React.Fragment>
      ))}
    </StepperWrapper>
  );
};

export default Stepper;
