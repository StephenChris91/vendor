import axios from "axios";

const getSummeryCards = async () => {
  const response = await axios.get("/api/vendors/dashboard/summary");
  return response.data;
};

const getSalesByStates = async () => {
  const response = await axios.get("/api/vendors/dashboard/top-states");
  return response.data;
};

const getSales = async () => {
  const response = await axios.get("/api/vendors/dashboard/sales");
  return response.data;
};

export default { getSummeryCards, getSalesByStates, getSales };
