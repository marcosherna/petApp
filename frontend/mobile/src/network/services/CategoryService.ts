import { Category, CategoryOptions } from "../models/Category";

export const categories: Category[] = [
  {
    id: 1,
    name: "Comida",
  },
  {
    id: 2,
    name: "Juguetes",
  },
  {
    id: 3,
    name: "Higiene",
  },
  {
    id: 4,
    name: "Salud",
  },
];

export const categoriesOptions: CategoryOptions[] = [
  {
    id: 1,
    name: "Comida",
    icon: "Salad",
    color: "#4CAF50",
  },
  {
    id: 2,
    name: "Juguetes",
    icon: "Shapes",
    color: "#FFB300",
  },
  {
    id: 3,
    name: "Higiene",
    icon: "Bubbles",
    color: "#03A9F4",
  },
  {
    id: 4,
    name: "Salud",
    icon: "HeartPulse",
    color: "#E91E63",
  },
];
