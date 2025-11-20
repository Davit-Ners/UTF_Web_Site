import {
    DataTypes,
    Model,
    Optional,
    Sequelize,
} from "sequelize";

// --------------------------
// Types
// --------------------------

export type ProductCategory = "apparel" | "music" | "accessories";
export type ProductBadge = "New" | "Limited" | "Pre-order";

// --------------------------
// Attributs DB
// --------------------------

export interface ProductAttributes {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  category: ProductCategory;
  badge?: ProductBadge | null;
  shortDesc?: string | null;
  stock?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

// Pour la création → champs optionnels
export type ProductCreationAttributes = Optional<
  ProductAttributes,
  "id" | "image" | "badge" | "shortDesc" | "stock" | "createdAt" | "updatedAt"
>;

// --------------------------
// Classe Sequelize
// --------------------------

export class Product
    extends Model<ProductAttributes, ProductCreationAttributes>
    implements ProductAttributes
{
    public id!: string;
    public name!: string;
    public price!: number;
    public image!: string | null;
    public category!: ProductCategory;
    public badge!: ProductBadge | null;
    public shortDesc!: string | null;
    public stock!: number | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// --------------------------
// Init function
// --------------------------

export function initProductModel(sequelize: Sequelize): typeof Product {
    Product.init(
        {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        category: {
            type: DataTypes.ENUM("apparel", "music", "accessories"),
            allowNull: false,
        },

        badge: {
            type: DataTypes.ENUM("New", "Limited", "Pre-order"),
            allowNull: true,
        },

        shortDesc: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        },
        {
        sequelize,
        tableName: "product",
        }
    );

    return Product;
};
