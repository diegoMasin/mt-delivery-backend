import { prisma } from "../../../../database/prismaClient";
import { hash } from "bcrypt";

interface ICreCreateDeliveryman {
  username: string;
  password: string;
}

export class CreateDeliverymanUseCase {
  async execute({ username, password }: ICreCreateDeliveryman) {
    // validate if deliveryman exists
    const deliverymanExists = await prisma.deliveryman.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (deliverymanExists) {
      throw new Error("Deliveryman already exists");
    }

    // crypto password
    const hashedPassword = await hash(password, 10);

    // salve deliveryman
    const deliveryman = await prisma.deliveryman.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return deliveryman;
  }
}
