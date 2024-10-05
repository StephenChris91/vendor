import React, { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import DropZone from "@component/DropZone";
import { Button } from "@component/buttons";
import { submitVerificationDocuments } from "actions/submitVerificationDocuments"; // Import the server action

interface UploadVerificationDocumentsProps {
  userId: string;
  userEmail: string;
  setDocumentsUploaded: (uploaded: boolean) => void;
}

interface DocumentData {
  name: string;
  content: string;
  type: string;
}

interface FormValues {
  documents: DocumentData[];
}

const formSchema = yup.object().shape({
  documents: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(),
        content: yup.string().required(),
        type: yup.string().required(),
      })
    )
    .min(2, "At least two documents are required")
    .required("At least two documents are required"),
});

const UploadVerificationDocuments: React.FC<
  UploadVerificationDocumentsProps
> = ({ userId, userEmail, setDocumentsUploaded }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const formik = useFormik<FormValues>({
    initialValues: {
      documents: [],
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      if (values.documents.length < 2) {
        toast.error("At least two documents are required");
        return;
      }

      try {
        // Call the server-side action to submit documents
        const result = await submitVerificationDocuments(
          userId,
          userEmail,
          values.documents
        );

        if (result.success) {
          toast.success(result.message || "Documents submitted successfully!");
          formik.resetForm();
          setFileNames([]);
          setDocumentsUploaded(true);
        } else {
          throw new Error("Failed to submit documents.");
        }
      } catch (error) {
        console.error("Error submitting documents:", error);
        if (error instanceof Error) {
          toast.error(`Failed to submit documents: ${error.message}`);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        setDocumentsUploaded(false);
      }
    },
  });

  // Handle file upload using DropZone
  const handleUpload = useCallback(
    async (files: File[]) => {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const base64Content = await fileToBase64(file);
          return {
            name: file.name,
            content: base64Content,
            type: file.type,
          };
        })
      );

      formik.setFieldValue("documents", [
        ...formik.values.documents,
        ...uploadedFiles,
      ]);
      setFileNames((prevNames) => [
        ...prevNames,
        ...files.map((file) => file.name),
      ]);

      toast.success("Documents uploaded successfully!");
    },
    [formik]
  );

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Remove file
  const removeFile = (index: number) => {
    const newDocuments = [...formik.values.documents];
    newDocuments.splice(index, 1);
    formik.setFieldValue("documents", newDocuments);

    const newFileNames = [...fileNames];
    newFileNames.splice(index, 1);
    setFileNames(newFileNames);

    if (newDocuments.length === 0) {
      setDocumentsUploaded(false);
    }
  };

  return (
    <Box className="content" width="auto" height="auto" paddingBottom={6}>
      <H5
        fontWeight="600"
        fontSize="12px"
        color="gray.800"
        textAlign="center"
        mb="2.25rem"
      >
        Please upload PDF or document files for verification
        <h5>
          2 of these 3 documents are required to complete your registration:
          CAC, NIN slip, Address verification
        </h5>
      </H5>

      <DropZone onChange={handleUpload} />

      {formik.touched.documents && formik.errors.documents && (
        <Small color="error.main" mt="0.5rem">
          {formik.errors.documents as string}
        </Small>
      )}

      {fileNames.length > 0 && (
        <Box mt="2rem">
          <H5 mb="0.5rem">Selected files:</H5>
          {fileNames.map((name, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb="0.5rem"
            >
              <Small>{name}</Small>
              <Button size="small" onClick={() => removeFile(index)}>
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <Button
        mt="2rem"
        variant="contained"
        color="primary"
        fullwidth
        onClick={() => formik.handleSubmit()}
        disabled={formik.values.documents.length < 2 || formik.isSubmitting}
      >
        {formik.isSubmitting
          ? "Submitting..."
          : `Submit ${formik.values.documents.length} Document${
              formik.values.documents.length > 1 ? "s" : ""
            } for Verification`}
      </Button>
    </Box>
  );
};

export default UploadVerificationDocuments;
