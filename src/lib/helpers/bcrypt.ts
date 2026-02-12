import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

export const comparePassword = async ({
  password,
  hashPassword,
}: {
  password: string;
  hashPassword: string;
}) => {
  return await bcrypt.compare(password, hashPassword);
};
