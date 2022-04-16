import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticateClient(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // get the token from the header
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({
      message: "Token missing.",
    });
  }

  // got the token, now verify it
  // [0] - Bearer
  // [1] - token
  const [, token] = authHeader.split(" ");
  try {
    const { sub } = verify(
      token,
      "bbcb6a822defddcd12abb7fe27cc982f"
    ) as IPayload;

    request.id_client = sub;

    return next();
  } catch (error) {
    return response.status(401).json({
      message: "Token invalid.",
    });
  }
}
