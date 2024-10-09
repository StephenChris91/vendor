"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { newVerification } from "actions/new-verification";
import { useCurrentUser } from "@lib/use-session-client";
import Box from "@component/Box";
import Card from "@component/Card";
import { H4, Paragraph } from "@component/Typography";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import Spinner from "@component/Spinner";

const StyledCard = styled(Card)`
  padding: 2rem;
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: ${(props) => props.theme.shadows.large};
  width: 100%;
  max-width: 400px;
`;

const StatusMessage = styled(Paragraph)<{ $error?: boolean }>`
  color: ${(props) =>
    props.$error
      ? props.theme.colors.error.main
      : props.theme.colors.success.main};
  text-align: center;
  margin-bottom: 1rem;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingIcon = styled(Icon)`
  animation: ${spin} 1s linear infinite;
`;

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const token = searchParams.get("token");
  const user = useCurrentUser();

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token");
      setIsLoading(false);
      return;
    }

    try {
      const result = await newVerification(token);
      if (result.error) {
        setError(result.error);
      }
      if (result.success) {
        setSuccess(result.success);
      }
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Box height="100vh">
      <FlexBox justifyContent="center" alignItems="center" height="100%">
        <StyledCard>
          <H4 textAlign="center" mb={3}>
            Email Verification
          </H4>
          {error && <StatusMessage $error>{error}</StatusMessage>}
          {success && <StatusMessage>{success}</StatusMessage>}
          {isLoading && (
            <FlexBox
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <LoadingIcon size="40px" color="primary">
                refresh-ccw
              </LoadingIcon>
              <Paragraph mt={2}>
                <Spinner
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#f3f3f3",
                    transformOrigin: "center",
                    margin: "0 auto",
                  }}
                />
              </Paragraph>
            </FlexBox>
          )}
        </StyledCard>
      </FlexBox>
    </Box>
  );
};

export default VerifyEmail;
