// components/admin/carousel-settings.tsx
"use client";

import React, { useState } from "react";
import { H5 } from "@component/Typography";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import FlexBox from "@component/FlexBox";
import Box from "@component/Box";
import { CreateCarouselItemInput } from "types";

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
    buttonLink: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCarouselItem(formData);
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        image: "",
      });
      alert("Carousel item created successfully!");
    } catch (error) {
      console.error("Error creating carousel item:", error);
      alert("Failed to create carousel item. Please try again.");
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
        <TextField
          fullwidth
          mb={2}
          name="buttonLink"
          label="Button Link"
          value={formData.buttonLink}
          onChange={handleChange}
        />
        <TextField
          fullwidth
          mb={2}
          name="image"
          label="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
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
