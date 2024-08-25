import styled from "styled-components";
import { H1, H2, Paragraph } from "@component/Typography";
import Container from "@component/Container";
import Card from "@component/Card";
import { Button } from "@component/buttons";
import FlexBox from "@component/FlexBox";

const StyledSection = styled.section`
  padding: 4rem 0;
  background-color: ${(props) => props.theme.colors.gray[100]};
`;

const FeatureCard = styled(Card)`
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const AboutUsPage = () => {
  return (
    <Container>
      <StyledSection>
        <H1 textAlign="center" mb="3rem">
          About Vendorspot
        </H1>
        <Paragraph textAlign="center" fontSize="1.2rem" mb="3rem">
          Vendorspot is Nigeria's safest platform for worry-free buying,
          selling, and finding trusted vendors close to you. Our system is
          designed to protect you from scams and ensure you get exactly what you
          ordered.
        </Paragraph>

        <FlexBox justifyContent="space-between" flexWrap="wrap">
          <FeatureCard flex="1 1 300px" m="1rem">
            <H2 mb="1rem">Shop Locally</H2>
            <Paragraph>
              Reduce delivery costs by shopping from vendors close to you. Enjoy
              multiple options in delivery costs.
            </Paragraph>
          </FeatureCard>

          <FeatureCard flex="1 1 300px" m="1rem">
            <H2 mb="1rem">Reliability</H2>
            <Paragraph>
              We thoroughly check vendors' backgrounds and withhold product fees
              until after delivery confirmation, giving you peace of mind.
            </Paragraph>
          </FeatureCard>

          <FeatureCard flex="1 1 300px" m="1rem">
            <H2 mb="1rem">Earn While Shopping</H2>
            <Paragraph>
              Make money by shopping or recommending products through our
              system. We've also created a system for people to earn while they
              sell for vendors.
            </Paragraph>
          </FeatureCard>
        </FlexBox>

        <FlexBox justifyContent="center" mt="3rem">
          <Button variant="contained" color="primary" size="large">
            Start Shopping Now
          </Button>
        </FlexBox>
      </StyledSection>

      <StyledSection>
        <H2 textAlign="center" mb="3rem">
          Frequently Asked Questions
        </H2>
        <FlexBox flexDirection="column" alignItems="center">
          <FeatureCard width="100%" maxWidth="800px" mb="1rem">
            <H2 fontSize="1.2rem">How safe is the platform?</H2>
            <Paragraph>
              It is very safe because all vendors on the platform are verified
              and trusted.
            </Paragraph>
          </FeatureCard>

          <FeatureCard width="100%" maxWidth="800px" mb="1rem">
            <H2 fontSize="1.2rem">How does Vendorspot protect buyers?</H2>
            <Paragraph>
              The platform ensures all registered vendors are reliable and
              legit. Buyers have the power to instruct the platform to pay
              vendors for a delivered product, ensuring you can get a refund if
              a wrong item is delivered.
            </Paragraph>
          </FeatureCard>

          <FeatureCard width="100%" maxWidth="800px" mb="1rem">
            <H2 fontSize="1.2rem">
              How do I make money as a buyer on Vendorspot?
            </H2>
            <Paragraph>
              You can make money using your reseller account to recommend
              products from the website to your friends using generated product
              links, and get commission on all orders they make through your
              link.
            </Paragraph>
          </FeatureCard>
        </FlexBox>
      </StyledSection>
    </Container>
  );
};

export default AboutUsPage;
