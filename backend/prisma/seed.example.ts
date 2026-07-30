import bcrypt from "bcryptjs";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash("1234.Abcd*", 10);

    await prisma.empleado.create({
        data: {
            nombreEmpl: "Nombre",
            apellido1Empl: "Apellido1",
            apellido2Empl: "Apellido2",
            dniEmpl: "00000000A",
            emailEmpl: "empleado1@motosbenito.com",
            passwordEmpl: hashedPassword,
            tipoViaEmpl: "Calle",
            nombreViaEmpl: "Nombre de la calle",
            numViaEmpl: "1",
            localidadEmpl: "Localidad",
            provinciaEmpl: "Provincia",
            cpEmpl: "00000",
            paisEmpl: "España",
            activoEmpl: true,
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