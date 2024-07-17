import axios from "@lib/axios";
// import User from "models/user.model";
// CUSTOM DATA MODEL
import { IDParams } from "interfaces";
import { User } from "next-auth";
import { auth } from "auth"

export const getUser = async (): Promise<User> => {
  const response = await auth();
  return response.user;
};

export const getUserIds = async (): Promise<IDParams[]> => {
  const response = await axios.get("/api/user-list/id-list");
  return response.data;
};

export default { getUser, getUserIds };
