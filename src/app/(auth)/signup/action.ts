"use server";

import { hashPassword } from "@/src/lib/helpers/bcrypt";

export const register = async (formData: any) => {
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");

  if (username === "" || email === "" || password === "") {
    return { success: false, error: "invalid Credential" };
  }
  const hash = hashPassword(password);

  const params = {
    email: email,
    username: username,
    password: hash,
  };

  const isSuccessful = await storeUser(params);
};
