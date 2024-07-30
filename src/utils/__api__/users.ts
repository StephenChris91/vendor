import axios from "@lib/axios";
import { User } from "next-auth";
import { auth } from "auth";
import { IDParams } from "interfaces";

export const getUser = async (): Promise<User> => {
  const response = await auth();
  return response.user;
};

export const getUserIds = async (): Promise<IDParams[]> => {
  const response = await axios.get("/api/users-list");
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
};

export default { getUser, getUserIds, getUserById };