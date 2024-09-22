"use client";

import React from "react";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import Box from "@component/Box";
import { H2, H3, Paragraph } from "@component/Typography";
import { generalTerms, privacyPolicyItems } from "@lib/data/generalTerms";
import styled from "styled-components";
import Icon from "@component/icon/Icon";

const StyledAccordionHeader = styled(AccordionHeader)`
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 3px;
  padding: 20px 10px;
  height: auto;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #374151;
  }
`;

const AccordionTitle = styled(H3)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #e5e7eb;
  padding: 8px;
  cursor: pointer;
`;

const AccordionContent = styled(Paragraph)`
  color: #9ca3af;
  background-color: #1f2937;
  padding: 10px 8px;
  height: auto;
`;

const PrivacyPolicyFAQ = () => {
  return (
    <Box height="auto">
      <H2 mb="2rem" color="primary.main">
        Privacy Policy
      </H2>
      {privacyPolicyItems.map((item, index) => (
        <Accordion key={index}>
          <StyledAccordionHeader>
            <AccordionTitle fontWeight="600" fontSize="1rem">
              {item.title}
            </AccordionTitle>
          </StyledAccordionHeader>
          <AccordionContent>{item.content}</AccordionContent>
        </Accordion>
      ))}

      <H2 mt="4rem" mb="2rem" color="primary">
        General Terms and Conditions
      </H2>
      {generalTerms.map((item, index) => (
        <Box key={index} mb="2rem">
          <H3
            fontWeight="600"
            fontSize="1.2rem"
            mb="0.5rem"
            color="primary.main"
          >
            {item.title}
          </H3>
          <Paragraph color="#9ca3af">{item.content}</Paragraph>
        </Box>
      ))}
    </Box>
  );
};

export default PrivacyPolicyFAQ;
