/* "use server"

import { cookies } from "next/headers"
import { z } from "zod"

// Cart item interface
export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

// Cart interface
export interface Cart {
  items: CartItem[]
}

// Get cart from cookies
export async function getCart(): Promise<Cart> {
  const cartCookie = (await cookies()).get("cart")?.value

  if (!cartCookie) {
    return { items: [] }
  }

  try {
    return JSON.parse(cartCookie) as Cart
  } catch (error) {
    // If the cart is invalid, return an empty cart
    return { items: [] }
  }
}

// Save cart to cookies
async function saveCart(cart: Cart): Promise<void> {
  (await cookies()).set({
    name: "cart",
    value: JSON.stringify(cart),
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "strict",
  })
}

// Add item to cart
export async function addToCart(formData: FormData) {
  const schema = z.object({
    id: z.coerce.number(),
    name: z.string(),
    price: z.coerce.number(),
    quantity: z.coerce.number().default(1),
    image: z.string(),
  })

  const validatedFields = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    image: formData.get("image"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, name, price, quantity, image } = validatedFields.data
  const cart = await getCart()

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex((item) => item.id === id)

  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    cart.items[existingItemIndex].quantity += quantity
  } else {
    // Add new item if it doesn't exist
    cart.items.push({
      id,
      name,
      price,
      quantity,
      image,
    })
  }

  await saveCart(cart)

  return {
    success: true,
    cart,
  }
}

// Update item quantity in cart
export async function updateCartItemQuantity(formData: FormData) {
  const schema = z.object({
    id: z.coerce.number(),
    quantity: z.coerce.number().min(1),
  })

  const validatedFields = schema.safeParse({
    id: formData.get("id"),
    quantity: formData.get("quantity"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, quantity } = validatedFields.data
  const cart = await getCart()

  // Find item in cart
  const itemIndex = cart.items.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    return {
      success: false,
      error: { id: ["Item not found in cart"] },
    }
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity

  await saveCart(cart)

  return {
    success: true,
    cart,
  }
}

// Remove item from cart
export async function removeFromCart(formData: FormData) {
  const schema = z.object({
    id: z.coerce.number(),
  })

  const validatedFields = schema.safeParse({
    id: formData.get("id"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id } = validatedFields.data
  const cart = await getCart()

  // Remove item from cart
  cart.items = cart.items.filter((item) => item.id !== id)

  await saveCart(cart)

  return {
    success: true,
    cart,
  }
}

// Clear cart
export async function clearCart() {
  await saveCart({ items: [] })

  return {
    success: true,
    cart: { items: [] },
  }
}

// Calculate cart totals

 */