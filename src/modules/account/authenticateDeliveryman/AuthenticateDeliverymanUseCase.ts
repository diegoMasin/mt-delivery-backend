import { prisma } from "../../../database/prismaClient";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

interface IAuthenticateDeliveryman {
  username: string;
  password: string;
}

export class AuthenticateDeliverymanUseCase {
  async execute({ username, password }: IAuthenticateDeliveryman) {
    // received username and password
    // verify if user exists
    const deliveryman = await prisma.deliveryman.findFirst({
      where: {
        username,
      },
    });
    if (!deliveryman) {
      throw new Error("Deliveryman or Password is invalid.");
    }

    // verify if password is correct
    const passwordMatch = await compare(password, deliveryman.password);
    if (!passwordMatch) {
      throw new Error("Deliveryman or Password is invalid.");
    }

    // generate token
    const token = sign({ username }, "42eb83c0c6d285f83def4cffabfd4147", {
      subject: deliveryman.id,
      expiresIn: "1d",
    });

    return token;
  }
}
