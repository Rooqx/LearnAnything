"use server";

import { comparePassword, hashPassword } from "@/src/lib/helpers/bcrypt";

export const login = async ({ email, password }) => {
  if (email === "" || password === "") {
    return { success: true, error: "invalid credientials" };
  }

  const user = getUserByEmail(email);

  if (!user) return { success: false, error: "invalid credientials" };

  const compareParams = {
    password: password,
    hashPassword: user?.hash_password,
  };

  const isPasswordValid = comparePassword(compareParams);
  if (!isPasswordValid)
    return { success: false, error: "invalid credientials" };

  return { success: true, data: user };
};
