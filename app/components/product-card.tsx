'use client'
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from '@/components/ui/button'
import { ShoppingCart, Loader2 } from "lucide-react"
import { addToCart } from "@/lib/firebase/cart"

interface Product {
  id: string | number
  name: string
  description: string
  price: number
  category?: string
  image: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [addingId, setAddingId] = useState<string | null>(null)
  // Replace this with your actual auth logic
  // const { user } = useAuth()
  const user = { uid: "demo-user-id" } // Replace with real user
  
  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert("Please sign in to add to cart")
      return
    }
    setAddingId(String(product.id))
    try {
      await addToCart(user.uid, { 
        ...product, 
        id: String(product.id),
        price: Number(product.price)
      })
      alert("Added to cart!")
    } catch (error) {
      console.error("Failed to add to cart:", error)
      alert("Failed to add to cart")
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <Image
            src={product.image || "/image.png"}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            priority={false}
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
            disabled={addingId === String(product.id)}
          >
            {addingId === String(product.id) ? (
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