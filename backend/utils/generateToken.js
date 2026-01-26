import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

};

export default generateToken;
