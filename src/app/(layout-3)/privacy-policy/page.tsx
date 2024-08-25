import React from "react";
import styled from "styled-components";
import { H1, H2, Paragraph } from "@component/Typography";
import Container from "@component/Container";
import FlexBox from "@component/FlexBox";
import Card from "@component/Card";

const StyledSection = styled.section`
  padding: 4rem 0;
  background-color: ${(props) => props.theme.colors.gray[100]};
`;

const PolicyCard = styled(Card)`
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PrivacyPolicyPage = () => {
  return (
    <Container>
      <StyledSection>
        <H1 textAlign="center" mb="3rem">
          Privacy Policy
        </H1>
        <Paragraph textAlign="center" fontSize="1.2rem" mb="3rem">
          At Vendorspot, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy outlines how we
          collect, use, and safeguard your data.
        </Paragraph>

        <FlexBox flexDirection="column" alignItems="center">
          <PolicyCard width="100%" maxWidth="800px" mb="2rem">
            <H2 mb="1rem">Information We Collect</H2>
            <Paragraph>
              We collect information that you provide directly to us, such as
              when you create an account, make a purchase, or contact our
              customer support. This may include your name, email address, phone
              number, and payment information.
            </Paragraph>
          </PolicyCard>

          <PolicyCard width="100%" maxWidth="800px" mb="2rem">
            <H2 mb="1rem">How We Use Your Information</H2>
            <Paragraph>
              We use your information to process your orders, provide customer
              support, improve our services, and send you important updates
              about your account or our platform. We may also use your
              information to personalize your shopping experience and send you
              marketing communications, which you can opt out of at any time.
            </Paragraph>
          </PolicyCard>

          <PolicyCard width="100%" maxWidth="800px" mb="2rem">
            <H2 mb="1rem">Information Sharing</H2>
            <Paragraph>
              We share your information with vendors only to the extent
              necessary to fulfill your orders. We do not sell your personal
              information to third parties. We may share your information with
              service providers who help us operate our platform, but they are
              bound by confidentiality agreements.
            </Paragraph>
          </PolicyCard>

          <PolicyCard width="100%" maxWidth="800px" mb="2rem">
            <H2 mb="1rem">Data Security</H2>
            <Paragraph>
              We implement a variety of security measures to protect your
              personal information. This includes encryption of sensitive data,
              regular security audits, and strict access controls for our
              employees.
            </Paragraph>
          </PolicyCard>

          <PolicyCard width="100%" maxWidth="800px" mb="2rem">
            <H2 mb="1rem">Your Rights</H2>
            <Paragraph>
              You have the right to access, correct, or delete your personal
              information. You can also object to the processing of your data or
              request a restriction on its use. To exercise these rights, please
              contact our customer support team.
            </Paragraph>
          </PolicyCard>

          <PolicyCard width="100%" maxWidth="800px" mb="2rem">
            <H2 mb="1rem">Changes to This Policy</H2>
            <Paragraph>
              We may update this Privacy Policy from time to time. We will
              notify you of any significant changes by posting a notice on our
              website or sending you an email.
            </Paragraph>
          </PolicyCard>

          <PolicyCard width="100%" maxWidth="800px">
            <H2 mb="1rem">Contact Us</H2>
            <Paragraph>
              If you have any questions about this Privacy Policy, please
              contact us at contact@vendorspot.ng or call (+234) 704 5882 161.
            </Paragraph>
          </PolicyCard>
        </FlexBox>
      </StyledSection>
    </Container>
  );
};

export default PrivacyPolicyPage;
