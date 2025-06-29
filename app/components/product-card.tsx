'use client'
import Link from "next/link"
import { addToCart } from "@/lib/firebase/cart"
import { useState } from "react"
import {Button } from '@/components/ui/button'
import { ShoppingCart, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
// You need to implement/use a hook to get the current user
// Example: import { useAuth } from "@/hooks/use-auth"

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    description: string
    price: number
    category?: string
    image: string
  }
}



/**
 * The `ProductCard` function in TypeScript React renders a card component for displaying product
 * information and allows users to add the product to their cart.
 * @param {ProductCardProps}  - The `ProductCard` component takes a `product` object as a prop, which
 * contains information about a specific product. The component displays this product information,
 * including the product image, category, name, description, and price. It also provides a button to
 * add the product to the cart.
 * @returns The `ProductCard` component is being returned. It displays product information such as
 * image, category, name, description, and price. It also includes a button to add the product to the
 * cart. The component handles the logic for adding the product to the cart, including checking if the
 * user is signed in, displaying loading state while adding to cart, and showing success or failure
 * alerts.
 */
export function ProductCard({ product }: ProductCardProps) {

    const [addingId, setAddingId] = useState<string | null>(null)
  // Replace this with your actual auth logic
  // const { user } = useAuth()
  const user = { uid: "demo-user-id" } // Replace with real user
  
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


  return (
    <div className=" relative overflow-hidden  rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/product/${product.id}`}>
      <div className="aspect-[4/3] overflow-hidden"> {/* 4:3 ratio instead of square */}
      <img
        src={product.image || "/image.png"}
        alt={product.name}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
    </div>
      </Link>
      <div className="p-4">
        {product.category && <div className="text-xs text-gray-500 mb-1">{product.category}</div>}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-medium text-lg">₦{product.price.toFixed(2)}</span>
          <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
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
  )
}