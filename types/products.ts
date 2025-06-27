export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  rating?: number;
  reviews?: number;
  stock?: number;
  details?: string[];
  nutritionFacts?: {
    servingSize: string;
    calories: number;
    totalFat: string;
    saturatedFat: string;
    transFat: string;
    cholesterol: string;
    sodium: string;
    totalCarbs: string;
    dietaryFiber: string;
    sugars: string;
    protein: string;
  };
}