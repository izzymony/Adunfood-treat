'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProductById } from "@/lib/firebase/products";

interface Product {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  images:string[];
  // Add other fields as needed
}

export default function ProductDetail ()  {

  const {id} = useParams()
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle potential array case for dynamic routes
    const productId = Array.isArray(params.id) ? params.id[0] : params.id;
    
    if (!productId) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    fetchProductById(productId)
      .then((data) => {
        if (!data) {
          throw new Error("Product data is empty");
        }
        setProduct(data);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setError(err.message || "Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
   <div className="px-4">
    <h2>Product  in {id}</h2>

     <div className="lg:w-1/2">
          <div className="aspect-square overflow-hidden rounded-lg">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src="/placeholder.svg"
                alt="Product placeholder"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          </div>
   </div>
  );
};