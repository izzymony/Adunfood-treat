"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from "@/lib/cart"
import type { Cart } from "@/lib/cart"
import { toast } from "@/hooks/use-toast"

interface CartContextType {
  cart: Cart
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  isLoading: boolean
  addItem: (formData: FormData) => Promise<void>
  updateItemQuantity: (formData: FormData) => Promise<void>
  removeItem: (formData: FormData) => Promise<void>
  clearAllItems: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [cart, setCart] = useState<Cart>({ items: [] })
  const [isLoading, setIsLoading] = useState(true)

  // Calculate cart totals
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 35 ? 0 : 5.99
  const total = subtotal + shipping
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  // Fetch cart on initial load
  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData = await getCart()
        setCart(cartData ?? { items: [] })
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  // Add item to cart
  async function addItem(formData: FormData) {
    try {
      const result = await addToCart(formData)

      if (result.success) {
        setCart(result.cart ?? { items: [] })
        toast({
          title: "Item added to cart",
          description: `${formData.get("name")} has been added to your cart.`,
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  // Update item quantity
  async function updateItemQuantity(formData: FormData) {
    try {
      const result = await updateCartItemQuantity(formData)

      if (result.success) {
        setCart(result.cart ?? { items: [] })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: "Failed to update item quantity.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating item quantity:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  // Remove item from cart
  async function removeItem(formData: FormData) {
    try {
      const result = await removeFromCart(formData)

      if (result.success) {
        setCart(result.cart ?? { items: [] })
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: "Failed to remove item from cart.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  // Clear cart
  async function clearAllItems() {
    try {
      const result = await clearCart()

      if (result.success) {
        setCart(result.cart)
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: "Failed to clear cart.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        shipping,
        total,
        isLoading,
        addItem,
        updateItemQuantity,
        removeItem,
        clearAllItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}
