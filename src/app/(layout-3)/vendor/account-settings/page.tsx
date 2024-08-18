"use client";

import { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "@lib/axios";
import Box from "@component/Box";
import Hidden from "@component/hidden";
import Select, { SelectOption } from "@component/Select";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import { Card1 } from "@component/Card1";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import countryList from "@data/countryList";
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ShopDetails {
  shopName: string;
  description: string;
  logo: string;
  banner: string;
  country: string;
  city: string;
  email: string;
  phone: string;
}

const fetchShopDetails = async (): Promise<ShopDetails> => {
  const response = await axios.get("/api/vendors/dashboard/shop");
  return response.data;
};

const updateShopDetails = async (data: ShopDetails): Promise<any> => {
  const response = await axios.put("/api/vendors/dashboard/shop", data);
  return response.data;
};

export default function AccountSettings() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);

  const { data: shopDetails, isLoading } = useQuery<ShopDetails>({
    queryKey: ["shopDetails"],
    queryFn: fetchShopDetails,
  });

  const mutation: UseMutationResult<any, Error, ShopDetails> = useMutation({
    mutationFn: (data: ShopDetails) => updateShopDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopDetails"] });
      toast.success("Shop details updated successfully");
      // Redirect to dashboard
      router.push("/vendor/dashboard");
    },
    onError: (error) => {
      toast.error(`Failed to update shop details: ${error.message}`);
    },
  });

  const initialValues: ShopDetails = {
    shopName: shopDetails?.shopName || "",
    description: shopDetails?.description || "",
    logo: shopDetails?.logo || "",
    banner: shopDetails?.banner || "",
    country: shopDetails?.country || "",
    city: shopDetails?.city || "",
    email: shopDetails?.email || "",
    phone: shopDetails?.phone || "",
  };

  const accountSchema = yup.object().shape({
    shopName: yup.string().required("required"),
    description: yup.string().required("required"),
    country: yup.mixed().required("required"),
    city: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    phone: yup.string().required("required"),
  });

  const handleFormSubmit = async (
    values: ShopDetails,
    { resetForm }: { resetForm: () => void }
  ) => {
    mutation.mutate(
      {
        ...values,
        logo: logoImage || values.logo,
        banner: coverImage || values.banner,
      },
      {
        onSuccess: () => {
          resetForm();
          setCoverImage(null);
          setLogoImage(null);
        },
      }
    );
  };

  const handleLogoUpload = async (file: File, type: "logo" | "banner") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await axios.post("/api/upload/shop-logo", formData);
      if (type === "logo") {
        setLogoImage(response.data.url);
      } else {
        setCoverImage(response.data.url);
      }
      toast.success(`${type} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    }
  };

  const handleBannerUpload = async (file: File, type: "logo" | "banner") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await axios.post("/api/upload/shop-banner", formData);
      if (type === "logo") {
        setLogoImage(response.data.url);
      } else {
        setCoverImage(response.data.url);
      }
      toast.success(`${type} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Fragment>
      <DashboardPageHeader title="Shop Settings" iconName="settings_filled" />

      <Card1 p="24px 30px" borderRadius={8}>
        <Box
          mb="1.5rem"
          height="173px"
          overflow="hidden"
          borderRadius="10px"
          position="relative"
          style={{
            background: `url(${
              coverImage ||
              shopDetails?.banner ||
              "/assets/images/banners/banner-10.png"
            }) center/cover`,
          }}
        >
          <Box
            display="flex"
            alignItems="flex-end"
            position="absolute"
            bottom="20px"
            left="24px"
          >
            <Avatar
              size={80}
              border="4px solid"
              borderColor="gray.100"
              src={
                logoImage ||
                shopDetails?.logo ||
                "/assets/images/faces/propic(9).png"
              }
            />

            <Box ml="-20px" zIndex={1}>
              <label htmlFor="profile-image">
                <Button
                  p="6px"
                  as="span"
                  size="small"
                  height="auto"
                  bg="gray.300"
                  color="secondary"
                  borderRadius="50%"
                >
                  <Icon>camera</Icon>
                </Button>
              </label>
            </Box>

            <Hidden>
              <input
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleLogoUpload(e.target.files[0], "logo")
                }
                id="profile-image"
                accept="image/*"
                type="file"
              />
            </Hidden>
          </Box>

          <Box
            display="flex"
            alignItems="flex-end"
            position="absolute"
            top="20px"
            right="24px"
          >
            <label htmlFor="cover-image">
              <Button
                as="span"
                size="small"
                bg="primary.light"
                color="secondary"
                height="auto"
                p="6px"
                borderRadius="50%"
              >
                <Icon color="primary">camera</Icon>
              </Button>
            </label>

            <Hidden>
              <input
                className="hidden"
                onChange={(e) =>
                  e.target.files &&
                  handleBannerUpload(e.target.files[0], "banner")
                }
                id="cover-image"
                accept="image/*"
                type="file"
              />
            </Hidden>
          </Box>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={accountSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <Box mb="30px">
                <Grid container horizontal_spacing={6} vertical_spacing={4}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      name="shopName"
                      label="Shop Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.shopName}
                      errorText={touched.shopName && errors.shopName}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      name="description"
                      label="Description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      errorText={touched.description && errors.description}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      name="email"
                      type="email"
                      label="Email"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      errorText={touched.email && errors.email}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      type="tel"
                      label="Phone"
                      name="phone"
                      onBlur={handleBlur}
                      value={values.phone}
                      onChange={handleChange}
                      errorText={touched.phone && errors.phone}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Select
                      label="Country"
                      options={countryList}
                      value={
                        countryList.find(
                          (country) => country.value === values.country
                        ) || null
                      }
                      errorText={touched.country && (errors.country as string)}
                      onChange={(selectedOption) =>
                        setFieldValue(
                          "country",
                          (selectedOption as SelectOption)?.value || ""
                        )
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      name="city"
                      label="City"
                      value={values.city}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      errorText={touched.city && errors.city}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </form>
          )}
        </Formik>
      </Card1>
    </Fragment>
  );
}
