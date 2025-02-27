import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode("alams-store-secret-key-2025");

export const TokenService = {
  async generateToken() {
    const token = await new SignJWT({ user: "guest" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(SECRET_KEY);

    sessionStorage.setItem("jwt", token);
    return token;
  },

  async verifyToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      return payload;
    } catch (error) {
      return null;
    }
  },

  getToken() {
    return sessionStorage.getItem("jwt");
  },

  removeToken() {
    sessionStorage.removeItem("jwt");
  },
};
