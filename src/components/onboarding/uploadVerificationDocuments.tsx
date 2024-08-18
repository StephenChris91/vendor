"use client";

import React, { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { submitVerificationDocuments } from "actions/submitVerificationDocuments";

import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import DropZone from "@component/DropZone";
import { Button } from "@component/buttons";

interface UploadVerificationDocumentsProps {
  userId: string;
  userEmail: string;
}

interface FormValues {
  documents: File[];
}

const formSchema = yup.object().shape({
  documents: yup
    .array()
    .of(
      yup
        .mixed()
        .test(
          "fileFormat",
          "Unsupported file format. Please upload PDF or document files.",
          (value) => {
            if (value instanceof File) {
              const acceptedFormats = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.oasis.opendocument.text",
              ];
              return acceptedFormats.includes(value.type);
            }
            return false;
          }
        )
    )
    .min(1, "At least one document is required")
    .required("At least one document is required"),
});

const UploadVerificationDocuments: React.FC<
  UploadVerificationDocumentsProps
> = ({ userId, userEmail }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const formik = useFormik<FormValues>({
    initialValues: {
      documents: [],
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      if (values.documents.length === 0) return;

      try {
        const documentData = await Promise.all(
          values.documents.map(async (file) => {
            const base64 = await fileToBase64(file);
            return {
              name: file.name,
              content: base64,
              type: file.type,
            };
          })
        );

        await submitVerificationDocuments(userId, userEmail, documentData);

        toast.success("Documents submitted successfully for verification!");
        formik.resetForm();
        setFileNames([]);
      } catch (error) {
        console.error("Error submitting documents:", error);
        toast.error("Failed to submit documents. Please try again.");
      }
    },
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = useCallback(
    (result: string | File[]) => {
      if (Array.isArray(result)) {
        const acceptedFormats = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.oasis.opendocument.text",
        ];

        const validFiles = result.filter((file) =>
          acceptedFormats.includes(file.type)
        );

        if (validFiles.length !== result.length) {
          toast.error(
            "Some files were not added. Please upload only PDF or document files."
          );
        }

        formik.setFieldValue("documents", [
          ...formik.values.documents,
          ...validFiles,
        ]);
        setFileNames((prevNames) => [
          ...prevNames,
          ...validFiles.map((file) => file.name),
        ]);
      } else {
        console.error("Unexpected result type from DropZone");
        toast.error("Failed to add files. Please try again.");
      }
    },
    [formik]
  );

  const removeFile = (index: number) => {
    const newDocuments = [...formik.values.documents];
    newDocuments.splice(index, 1);
    formik.setFieldValue("documents", newDocuments);

    const newFileNames = [...fileNames];
    newFileNames.splice(index, 1);
    setFileNames(newFileNames);
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
      </H5>

      <DropZone
        uploadType="verification-documents"
        useS3={false}
        multiple={true}
        acceptedFileTypes={{
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
          "application/vnd.oasis.opendocument.text": [".odt"],
        }}
      />

      {formik.touched.documents && formik.errors.documents && (
        <Small color="error.main" mt="0.5rem">
          {formik.errors.documents}
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
        disabled={formik.values.documents.length === 0 || formik.isSubmitting}
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
