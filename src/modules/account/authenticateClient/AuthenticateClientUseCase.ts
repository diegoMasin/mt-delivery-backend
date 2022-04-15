import { prisma } from "../../../database/prismaClient";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

interface IAuthenticateClient {
  username: string;
  password: string;
}

export class AuthenticateClientUseCase {
  async execute({ username, password }: IAuthenticateClient) {
    // received username and password
    // verify if user exists
    const client = await prisma.clients.findFirst({
      where: {
        username,
      },
    });
    if (!client) {
      throw new Error("Client or Password is invalid.");
    }

    // verify if password is correct
    const passwordMatch = await compare(password, client.password);
    if (!passwordMatch) {
      throw new Error("Client or Password is invalid.");
    }

    // generate token
    const token = sign({ username }, "bbcb6a822defddcd12abb7fe27cc982f", {
      subject: client.id,
      expiresIn: "1d",
    });

    return token;
  }
}
