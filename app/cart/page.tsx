"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, Loader2 } from "lucide-react"
import { fetchCart, updateCartItem, removeCartItem, clearCart } from "@/lib/firebase/cart"

const userId = "demo-user-id" // Replace with real user ID

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")

  useEffect(() => {
    fetchCart(userId).then(items => {
      setCart(items)
      setLoading(false)
    })
  }, [])

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateCartItem(userId, id, newQuantity)
    setCart(cart =>
      cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    )
  }

  const handleRemoveItem = async (id: string) => {
    await removeCartItem(userId, id)
    setCart(cart => cart.filter(item => item.id !== id))
  }

  const handleClearCart = async () => {
    await clearCart(userId)
    setCart([])
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 35 ? 0 : 5
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className=" py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl md:text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 md:mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/products">
            <Button className="bg-green-600 hover:bg-green-700">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 text-xs uppercase">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left">Product</th>
                    <th className="px-4 md:px-6 py-3 text-center">Quantity</th>
                    <th className="px-4 md:px-6 py-3 text-right">Price</th>
                    <th className="px-4 md:px-6 py-3 text-right">Total</th>
                    <th className="px-4 md:px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cart.map((item) => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-12 w-12 md:h-16 md:w-16 object-cover rounded mr-3 md:mr-4"
                          />
                          <div className="text-sm md:text-base">
                            <Link href={`/product/${item.id}`} className="font-medium hover:text-green-600">
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                          <span className="mx-2 md:mx-3">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right text-sm md:text-base">₦{item.price.toFixed(2)}</td>
                      <td className="px-4 md:px-6 py-4 text-right font-medium text-sm md:text-base">₦{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 md:mt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </Link>
              <Button
                variant="outline"
                className="w-full sm:w-auto text-red-500 hover:text-red-700 hover:border-red-700"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="border rounded-lg p-4 md:p-6 space-y-4 md:space-y-6">
              <h2 className="text-lg md:text-xl font-bold">Order Summary</h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm md:text-base">Subtotal</span>
                  <span className="text-sm md:text-base">₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm md:text-base">Shipping</span>
                  <span className="text-sm md:text-base">{shipping === 0 ? "Free" : `₦${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-3 md:pt-4 flex justify-between font-bold">
                  <span className="text-sm md:text-base">Total</span>
                  <span className="text-sm md:text-base">₦{total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">Proceed to Checkout</Button>
              <div className="text-xs text-gray-500">
                <p>Free shipping on orders over ₦35</p>
                <p className="mt-1">Estimated delivery: 2-4 business days</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}