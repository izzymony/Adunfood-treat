"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Loader2 } from "lucide-react"
import { useCart } from '@/app/components/cart-provider'
interface AddToCartButtonProps {
  product: {
    id: number
    name: string
    price: number
    image: string
  }
  quantity?: number
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "default",
  size = "default",
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  async function handleAddToCart() {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("id", product.id.toString())
    formData.append("name", product.name)
    formData.append("price", product.price.toString())
    formData.append("quantity", quantity.toString())
    formData.append("image", product.image)

    await addItem(formData)

    setIsLoading(false)
    setIsAdded(true)

    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={`${className} ${variant === "default" ? "bg-green-600 hover:bg-green-700" : ""}`}
      disabled={isLoading || isAdded}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
