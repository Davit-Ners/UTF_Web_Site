import { Sequelize } from "sequelize";
import { initProductModel } from "../models/product.model";

const { NODE_ENV } = process.env;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

// 🔹 On déclare le type du global pour éviter les @ts-ignore
declare global {
    // eslint-disable-next-line no-var
    var __sequelize: Sequelize | undefined;
    }

// 🔹 Singleton Sequelize (Next.js + hot reload)
let sequelizeInstance: Sequelize;

if (NODE_ENV === "production") {
    sequelizeInstance = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
        },
        logging: false,
    });
} else {
  if (!global.__sequelize) {
        global.__sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                require: true,
                rejectUnauthorized: false,
                },
            },
            logging: false,
            });
    }
    sequelizeInstance = global.__sequelize;
}

// 🔹 Types pour db / models
type ModelsMap = Record<string, unknown>;

interface Db {
    sequelize: Sequelize;
    models: ModelsMap;
}

export const db: Db = {
    sequelize: sequelizeInstance,
    models: {},
};

const productModel = initProductModel(sequelizeInstance);

const models: ModelsMap = {
    Product: productModel
};

db.models = models;

// 🔧 Fonction d'init DB, adaptée à Next (pas de process.exit)
let isInitialized = false;
let initPromise: Promise<void> | null = null;

export const connectDB = async (): Promise<void> => {
    if (isInitialized) return initPromise ?? Promise.resolve();

    if (!initPromise) {
        initPromise = (async () => {
        try {
            await db.sequelize.authenticate();
            console.log("DB connection OK ✅");

            if (NODE_ENV === "development") {
            await db.sequelize.sync({ alter: true });
            console.log("DB sync (alter) en dev");
            } else {
            await db.sequelize.sync();
            console.log("DB sync en prod");
            }

            isInitialized = true;
        } catch (err) {
            console.error("DB connection error");
            console.error(err);
            throw err;
        }
        })();
    }

    return initPromise;
};

export default db;
