
import { db } from "@/firebaseConfig"
import { doc, setDoc, getDoc, updateDoc, increment, collection, getDocs, deleteDoc, writeBatch } from "firebase/firestore"

// Add or increment product in cart
export async function addToCart(userId: string, product: any) {
  const itemRef = doc(db, "carts", userId, "items", product.id)
  const itemSnap = await getDoc(itemRef)
  if (itemSnap.exists()) {
    // If item exists, increment quantity
    await updateDoc(itemRef, {
      quantity: increment(1),
    })
  } else {
    // If not, set with quantity 1
    await setDoc(itemRef, {
      ...product,
      quantity: 1,
    })
  }
}
// Fetch all cart items for user
export async function fetchCart(userId: string) {
  const itemsSnap = await getDocs(collection(db, "carts", userId, "items"))
  return itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Update quantity
export async function updateCartItem(userId: string, productId: string, quantity: number) {
  const itemRef = doc(db, "carts", userId, "items", productId)
  await updateDoc(itemRef, { quantity })
}

// Remove item
export async function removeCartItem(userId: string, productId: string) {
  const itemRef = doc(db, "carts", userId, "items", productId)
  await deleteDoc(itemRef)
}

// Clear all items
export async function clearCart(userId: string) {
  const itemsSnap = await getDocs(collection(db, "carts", userId, "items"))
  const batch = writeBatch(db)
  for (const docSnap of itemsSnap.docs) {
    batch.delete(docSnap.ref)
  }
  await batch.commit()
}