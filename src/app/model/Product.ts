import { Category } from "./Category";

export class Product {
  name: string;
  stock: number;
  price: number;
  active: boolean;
  date_added: Date;
  kind_product: Category;
}
