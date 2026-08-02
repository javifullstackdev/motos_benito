import bcrypt from "bcryptjs";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash("1234.Abcd*", 10);

    await prisma.employee.create({
        data: {
            firstName: "Nombre",
            lastName1: "Apellido1",
            lastName2: "Apellido2",
            nationalId: "00000000A",
            email: "empleado1@motosbenito.com",
            password: hashedPassword,
            streetType: "Calle",
            streetName: "Nombre de la calle",
            streetNumber: "1",
            city: "Localidad",
            province: "Provincia",
            postalCode: "00000",
            country: "España",
            active: true,
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });