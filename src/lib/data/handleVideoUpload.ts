import { useCallback, Dispatch, SetStateAction } from "react";
import { ProductType } from "@/app/types/types";
import { useCurrentUser } from "@/lib/use-session-client";

export type FormDataType = ProductType;

export const handleVideoUpload = (
  formData: FormDataType,
  setFormData: Dispatch<SetStateAction<FormDataType>>
) => {
  const user = useCurrentUser();

  return useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      console.log(file);

      if (file) {
        try {
          // Fetch the presigned URL from the server
          const response = await fetch("/api/upload-product-video", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              userName: user?.name, // Assuming user has a 'name' property
            }),
          });

          const data = await response.json();

          console.log("Server response:", data);

          if (response.ok) {
            const { presignedUrl, url } = data;

            // Upload the file to S3 using the presigned URL
            const uploadResponse = await fetch(presignedUrl, {
              method: "PUT",
              headers: {
                "Content-Type": file.type,
              },
              body: file,
            });

            if (uploadResponse.ok) {
              // Set the form data with the uploaded video URL
              setFormData((prevData) => ({
                ...prevData,
                video: url,
              }));
            } else {
              console.error(
                "Error uploading video:",
                await uploadResponse.text()
              );
            }
          } else {
            console.error(
              "Error generating presigned URL:",
              data.message || response.statusText
            );
          }
        } catch (error) {
          console.error("Error uploading video:", error);
        }
      }
    },
    [setFormData, user]
  );
};
