"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { onSnapshot, collection } from "firebase/firestore"
import { db } from "@/firebaseConfig"

const CartContext = createContext<{ count: number }>({ count: 0 })

export function CartProvider({ userId, children }: { userId: string, children: React.ReactNode }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!userId) return
    const colRef = collection(db, "carts", userId, "items")
    const unsubscribe = onSnapshot(colRef, (snap) => {
      let total = 0
      snap.forEach(doc => {
        const data = doc.data()
        total += data.quantity || 1
      })
      setCount(total)
    })
    return () => unsubscribe()
  }, [userId])

  return <CartContext.Provider value={{ count }}>{children}</CartContext.Provider>
}

export function useCartCount() {
  return useContext(CartContext).count
}