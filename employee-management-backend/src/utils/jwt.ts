import jwt from 'jsonwebtoken';

interface UserPayload {
  id: number;
  email: string;
  role: string;
}

const generateToken = (user: UserPayload): string => {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken };