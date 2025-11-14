export interface Category {
  id: number | string;
  name: string;
}

export interface CategoryOptions extends Category {
  icon: any;
  color: string;
}
