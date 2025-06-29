import { db, storage } from "@/firebaseConfig";
import { 
  collection, 
  addDoc, 
  Timestamp, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  doc, 
  deleteDoc,
 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

interface FirestoreProduct {
  id: string;
  firestoreId: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

interface ProductInput {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | File;
  imageUrl?: string;
  images?: string[];
  oldImageUrl?: string;
}

export async function createProduct(product: ProductInput): Promise<string> {
  let imageUrl = typeof product.image === 'string' ? product.image : '';

  if (product.image instanceof File) {
    try {
      const fileName = `products/${Date.now()}-${product.image.name}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, product.image);
      imageUrl = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading product image:", error);
      throw new Error("Failed to upload product image");
    }
  }

  const docRef = await addDoc(collection(db, "products"), {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: imageUrl,
    createdAt: Timestamp.now(),
  });
  
  return docRef.id;
}

export async function fetchProducts(): Promise<FirestoreProduct[]> {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(doc => ({
    firestoreId: doc.id,
    ...doc.data(),
  } as FirestoreProduct));
}

export async function fetchProductsByCategory(category: string): Promise<FirestoreProduct[]> {
  const q = query(collection(db, "products"), where("category", "==", category));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    firestoreId: doc.id,
    ...doc.data(),
  } as FirestoreProduct));
}

export async function setProductWithId(product: ProductInput): Promise<void> {
  let imageUrl = typeof product.image === 'string' ? product.image : '';

  if (product.image instanceof File) {
    try {
      if (product.oldImageUrl) {
        try {
          const oldImagePath = product.oldImageUrl.split('?')[0].split('/o/')[1];
          const decodedPath = decodeURIComponent(oldImagePath);
          const oldImageRef = ref(storage, decodedPath);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn("Failed to delete old image:", error);
        }
      }
      
      const fileName = `products/${product.id}-${Date.now()}-${product.image.name}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, product.image);
      imageUrl = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading product image:", error);
      throw new Error("Failed to upload product image");
    }
  }

  const docRef = doc(db, "products", product.id);
  await setDoc(docRef, {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: imageUrl,
    updatedAt: Timestamp.now(),
  }, { merge: true });
}

export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  try {
    const imagePath = imageUrl.split('?')[0].split('/o/')[1];
    const decodedPath = decodeURIComponent(imagePath);
    const imageRef = ref(storage, decodedPath);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error("Error deleting product image:", error);
    return false;
  }
}

export async function deleteProduct(productId: string, imageUrl?: string): Promise<boolean> {
  try {
    if (imageUrl) {
      try {
        await deleteProductImage(imageUrl);
      } catch (error) {
        console.warn("Failed to delete product image, continuing with product deletion:", error);
      }
    }

    await deleteDoc(doc(db, "products", productId));
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}

export async function fetchProductById(productId: string): Promise<FirestoreProduct> {
  try {
    const q = query(
      collection(db, "products"),
      where("id", "==", productId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      firestoreId: doc.id,
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image,
      createdAt: data.createdAt
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch product");
  }
}

export async function fetchAllProductIds(): Promise<string[]> {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(doc => doc.id);
}