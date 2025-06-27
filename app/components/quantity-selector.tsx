"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Heart } from "lucide-react"
import { AddToCartButton } from "@/app/components/add-to-cart-button"

interface QuantitySelectorProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    stock?: number
  }
  initialQuantity?: number
}

export function QuantitySelector({ product, initialQuantity = 1 }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const maxStock = product.stock || 99

  const increment = () => {
    if (quantity < maxStock) {
      setQuantity(quantity + 1)
    }
  }

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="mr-6 flex items-center border rounded-md">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="px-3 py-2 hover:bg-gray-100"
            onClick={decrement}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="px-3 py-2 hover:bg-gray-100"
            onClick={increment}
            disabled={quantity >= maxStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {product.stock && <div className="text-sm text-gray-500">{product.stock} available</div>}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <AddToCartButton product={product} quantity={quantity} className="flex-1" />
        <Button variant="outline" className="flex-1">
          <Heart className="mr-2 h-5 w-5" />
          Add to Wishlist
        </Button>
      </div>
    </div>
  )
}
