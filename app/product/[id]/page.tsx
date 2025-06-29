'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProductById } from "@/lib/firebase/products";
import { addToCart } from "@/lib/firebase/cart"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  firestoreId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  map?:string
}

const user = {uid: "demo-user-id"}

const ProductPage = () => {
  const {id} = useParams()
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [addingId, setAddingId] = useState<string | null>(null)

  useEffect(() => {
    const productId = Array.isArray(params.id) ? params.id[0] : params.id;

    if (!productId) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(productId);
        
        // Transform with safe defaults
        const transformedProduct: Product = {
          firestoreId: productData.firestoreId,
          id: productData.id,
          name: productData.name || 'Unnamed Product',
          description: productData.description || 'No description available',
          price: productData.price || 0,
          category: productData.category || 'Uncategorized',
          image: productData.image || '/placeholder-product.jpg'
        };

        setProduct(transformedProduct);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

   const handleAddToCart = async (product: any) => {
      if (!user) {
        alert("Please sign in to add to cart")
        return
      }
      setAddingId(product.id)
      try {
        await addToCart(user.uid, { ...product, id: String(product.id) })
        alert("Added to cart!")
      } catch (e) {
        alert("Failed to add to cart")
      } finally {
        setAddingId(null)
      }
    }

  if (loading) return  
<div
  className="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"
></div>

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  return (
      <div className="py-6 md:py-12 px-4 sm:px-6">
  {/* Product Header */}
  <div className="mb-6 px-2 sm:px-5">
    <h1 className="font-bold text-black text-2xl sm:text-3xl">Product {id}</h1>
  </div>

  {/* Product Content */}
  <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
    {/* Image Section */}
    <div className="w-full lg:w-1/2">
      <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={600}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          priority
          unoptimized={!product.image.startsWith('http')}
        />
      </div>
    </div>

    {/* Details Section */}
    <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
        <p className="text-xl md:text-2xl font-semibold mt-2">₦{product.price.toFixed(2)}</p>
        <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mt-1">
          {product.category.replace(/-/g, ' ')}
        </p>
      </div>

      <div className="border-t border-b border-gray-200 py-4">
        <h2 className="font-medium text-base md:text-lg">Description</h2>
        <p className="mt-2 text-gray-700 text-sm md:text-base">
          {product.description}
        </p>
      </div>

      <div className="pt-2">
        <Button
          size="sm"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          onClick={() => handleAddToCart(product)}
          disabled={addingId === product.id}
        >
          {addingId === product.id ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  </div>
</div>    
  );
};

export default ProductPage;