import { db, storage } from "@/firebaseConfig"
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  doc, 
  getDoc,
  deleteDoc,
  Timestamp,
  DocumentData,
  
  QueryDocumentSnapshot
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { Product, ProductInput } from "@/types"

interface FirestoreProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function createProduct(product: ProductInput): Promise<string> {
  const imageUrl = await handleImageUpload(product.image)
  
  const docRef = await addDoc(collection(db, "products"), {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: imageUrl,
    createdAt: Timestamp.now(),
  } as FirestoreProduct)
  
  return docRef.id
}

export async function fetchProducts(): Promise<Product[]> {
  const querySnapshot = await getDocs(collection(db, "products"))
  return querySnapshot.docs.map(doc => transformFirestoreData(doc))
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const q = query(collection(db, "products"), where("category", "==", category))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => transformFirestoreData(doc))
}

export async function fetchProductById(productId: string): Promise<Product> {
  const docRef = doc(db, "products", productId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    throw new Error(`Product with ID ${productId} not found`)
  }
  
  return transformFirestoreData(docSnap)
}

export async function updateProduct(
  productId: string, 
  product: ProductInput,
  oldImageUrl?: string
): Promise<void> {
  let imageUrl = typeof product.image === 'string' ? product.image : ''
  
  if (product.image instanceof File) {
    if (oldImageUrl) {
      await deleteImage(oldImageUrl).catch(console.warn)
    }
    imageUrl = await handleImageUpload(product.image)
  }

  await setDoc(doc(db, "products", productId), {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: imageUrl,
    updatedAt: Timestamp.now(),
  } as Partial<FirestoreProduct>, { merge: true })
}

export async function deleteProduct(productId: string, imageUrl?: string): Promise<void> {
  if (imageUrl) {
    await deleteImage(imageUrl).catch(console.warn)
  }
  await deleteDoc(doc(db, "products", productId))
}

// Helper functions
async function handleImageUpload(image: File | string): Promise<string> {
  if (typeof image === 'string') return image
  
  try {
    const fileName = `products/${Date.now()}-${image.name}`
    const storageRef = ref(storage, fileName)
    const snapshot = await uploadBytes(storageRef, image)
    return await getDownloadURL(snapshot.ref)
  } catch (error) {
    console.error("Error uploading product image:", error)
    throw new Error("Failed to upload product image")
  }
}

async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const imagePath = imageUrl.split('?')[0].split('/o/')[1]
    const decodedPath = decodeURIComponent(imagePath)
    const imageRef = ref(storage, decodedPath)
    await deleteObject(imageRef)
  } catch (error) {
    console.error("Error deleting product image:", error)
    throw new Error("Failed to delete product image")
  }
}

function transformFirestoreData(doc: QueryDocumentSnapshot<DocumentData>): Product {
  const data = doc.data() as FirestoreProduct
  return {
    id: doc.id,
    name: data.name || 'Unnamed Product',
    description: data.description || '',
    price: data.price || 0,
    category: data.category || 'Uncategorized',
    image: data.image || '/placeholder-product.png',
    createdAt: data.createdAt?.toDate().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString()
  }
}