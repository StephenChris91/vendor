// components/admin/carousel-settings.tsx

"use client";

import React, { useState, useEffect } from "react";
import { H5, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import FlexBox from "@component/FlexBox";
import Box from "@component/Box";
import DropZone from "@component/DropZone";
import Modal from "@component/Modal";
import { CreateCarouselItemInput, MainCarouselItem } from "types";
import { toast } from "react-hot-toast";

interface CarouselSettingsProps {
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const CarouselSettings: React.FC<CarouselSettingsProps> = ({
  setHasUnsavedChanges,
}) => {
  const [formData, setFormData] = useState<CreateCarouselItemInput>({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    imgUrl: "",
  });
  const [carouselItems, setCarouselItems] = useState<MainCarouselItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  const fetchCarouselItems = async () => {
    try {
      const response = await fetch("/api/carousel");
      if (!response.ok) {
        throw new Error("Failed to fetch carousel items");
      }
      const items = await response.json();
      setCarouselItems(items);
    } catch (error) {
      console.error("Error fetching carousel items:", error);
      toast.error("Failed to fetch carousel items.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasUnsavedChanges(true);
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imgUrl: url });
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/carousel";
      const method = editingItemId ? "PUT" : "POST";
      const body = editingItemId
        ? JSON.stringify({ id: editingItemId, ...formData })
        : JSON.stringify(formData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Failed to save carousel item");
      }

      toast.success(
        editingItemId
          ? "Carousel item updated successfully!"
          : "Carousel item created successfully!"
      );

      setFormData({
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        imgUrl: "",
      });
      setEditingItemId(null);
      setHasUnsavedChanges(false);
      fetchCarouselItems();
    } catch (error) {
      console.error("Error saving carousel item:", error);
      toast.error("Failed to save carousel item. Please try again.");
    }
  };

  const handleEdit = (item: MainCarouselItem) => {
    setFormData(item);
    setEditingItemId(item.id);
    setHasUnsavedChanges(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch("/api/carousel", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: itemToDelete }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete carousel item");
        }

        toast.success("Carousel item deleted successfully!");
        fetchCarouselItems();
      } catch (error) {
        console.error("Error deleting carousel item:", error);
        toast.error("Failed to delete carousel item. Please try again.");
      } finally {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <H5 mb="1rem">{editingItemId ? "Edit" : "Create"} Carousel Item</H5>

        <TextField
          fullwidth
          mb="0.75rem"
          name="title"
          label="Title (Optional)"
          onChange={handleChange}
          value={formData.title}
        />

        <TextField
          fullwidth
          mb="0.75rem"
          name="description"
          label="Description (Optional)"
          onChange={handleChange}
          value={formData.description}
        />

        <TextField
          fullwidth
          mb="0.75rem"
          name="buttonText"
          label="Button Text (Optional)"
          onChange={handleChange}
          value={formData.buttonText}
        />

        <TextField
          fullwidth
          mb="0.75rem"
          name="buttonLink"
          label="Button Link (Optional)"
          onChange={handleChange}
          value={formData.buttonLink}
        />

        <DropZone
          uploadType="carousel-image"
          maxSize={4 * 1024 * 1024}
          acceptedFileTypes={{ "image/*": [".png", ".jpg", ".jpeg", ".gif"] }}
          onUpload={handleImageUpload}
        />
        <FlexBox mt="1rem" mb="1.5rem">
          {formData.imgUrl && (
            <img
              src={formData.imgUrl}
              alt="Carousel Image"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          )}
        </FlexBox>

        <Button type="submit" variant="contained" color="primary">
          {editingItemId ? "Update" : "Create"} Carousel Item
        </Button>
      </form>

      <Box mt="2rem">
        <H5 mb="1rem">Existing Carousel Items</H5>
        {carouselItems.map((item) => (
          <Box
            key={item.id}
            mb="1rem"
            p="1rem"
            border="1px solid #eee"
            borderRadius="4px"
          >
            <FlexBox justifyContent="space-between" alignItems="center">
              <Box>
                <H5>{item.title || "Untitled"}</H5>
                {item.imgUrl && (
                  <img
                    src={item.imgUrl}
                    alt="Carousel Image"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                )}
                {item.buttonLink && (
                  <Paragraph>Button: {item.buttonText || "View"}</Paragraph>
                )}
              </Box>
              <FlexBox>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(item)}
                  mr="0.5rem"
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteClick(item.id)}
                >
                  Delete
                </Button>
              </FlexBox>
            </FlexBox>
          </Box>
        ))}
      </Box>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box backgroundColor="white" p={3} borderRadius={8}>
          <H5 mb={2}>Confirm Deletion</H5>
          <Paragraph mb={3}>
            Are you sure you want to delete this carousel item?
          </Paragraph>
          <FlexBox justifyContent="flex-end">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsDeleteModalOpen(false)}
              mr={1}
            >
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </FlexBox>
        </Box>
      </Modal>
    </Box>
  );
};

export default CarouselSettings;
