"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "actions/new-verification";
import { useCurrentUser } from "@lib/use-session-client";

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
    <div className="flex justify-center items-center h-screen">
      <div className="p-8 bg-white shadow-md rounded-lg">
        {error && (
          <div className="text-red-500 text-center mb-4">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="text-green-500 text-center mb-4">
            <p>{success}</p>
          </div>
        )}
        {!error && !success && (
          <div className="text-center">
            <p>Verifying your email...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
