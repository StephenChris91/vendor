import axios from "axios";

export async function reverseGeocode(latitude, longitude) {
  try {
    // This example uses OpenStreetMap Nominatim. You might want to use a different service.
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );

    const address = response.data.address;

    return {
      street: `${address.road || ""} ${address.house_number || ""}`.trim(),
      city: address.city || address.town || address.village || "",
      state: address.state || "",
      postalCode: address.postcode || "",
      country: address.country || "",
    };
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    throw new Error("Failed to get address from coordinates");
  }
}
