// components/admin/carousel-settings.tsx
"use client";

import React, { useState } from "react";
import { H5 } from "@component/Typography";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import FlexBox from "@component/FlexBox";
import Box from "@component/Box";
import DropZone from "@component/DropZone";
import { CreateCarouselItemInput } from "types";
import { toast } from "react-hot-toast";
interface CarouselSettingsProps {
  createCarouselItem: (item: CreateCarouselItemInput) => Promise<void>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const CarouselSettings: React.FC<CarouselSettingsProps> = ({
  createCarouselItem,
  setHasUnsavedChanges,
}) => {
  const [formData, setFormData] = useState<CreateCarouselItemInput>({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "/shop",
    imgUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasUnsavedChanges(true);
  };

  const handleImageUpload = (url: string, file: File) => {
    setFormData({ ...formData, imgUrl: url });
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCarouselItem(formData);

      setFormData({
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "/shop",
        imgUrl: "",
      });
      setHasUnsavedChanges(false);
      toast.success("Carousel item created successfully!");
    } catch (error) {
      console.error("Error creating carousel item:", error);
      toast.error("Failed to create carousel item. Please try again.");
    }
  };

  return (
    <Box>
      <H5 mb={3}>Create Carousel Item</H5>
      <form onSubmit={handleSubmit}>
        <TextField
          fullwidth
          mb={2}
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          fullwidth
          mb={2}
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          fullwidth
          mb={2}
          name="buttonText"
          label="Button Text"
          value={formData.buttonText}
          onChange={handleChange}
        />
        <Box mb={2}>
          <DropZone
            uploadType="carousel-image"
            maxSize={4 * 1024 * 1024} // 4MB limit
            acceptedFileTypes={{ "image/*": [".png", ".jpg", ".jpeg", ".gif"] }}
            onUpload={handleImageUpload}
          />
        </Box>
        {formData.imgUrl && (
          <Box mb={2}>
            <img
              src={formData.imgUrl}
              alt="Uploaded"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          </Box>
        )}
        <FlexBox justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit">
            Create Carousel Item
          </Button>
        </FlexBox>
      </form>
    </Box>
  );
};

export default CarouselSettings;
