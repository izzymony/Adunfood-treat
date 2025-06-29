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

  deleteDoc  // Added for delete functionality
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

interface FirestoreProduct {
  id: string;          // The field you're querying by
  firestoreId: string; // The actual document ID
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  createdAt?: any;
}


export async function createProduct(product: {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | File;
  id: string;
  imageUrl: string;
  images: string[];
}) {
  let imageUrl = typeof product.image === 'string' ? product.image : '';

  // If image is a File object, upload it to storage first
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

export async function fetchProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function fetchProductsByCategory(category: string) {
  const q = query(collection(db, "products"), where("category", "==", category));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function setProductWithId(product: { 
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | File;
  oldImageUrl?: string;
}) {
  let imageUrl = typeof product.image === 'string' ? product.image : '';

  // If image is a File object, upload it to storage first
  if (product.image instanceof File) {
    try {
      // Delete old image if provided
      if (product.oldImageUrl) {
        try {
          // Extract path from URL or use full URL
          const oldImagePath = product.oldImageUrl.split('?')[0].split('/o/')[1];
          const decodedPath = decodeURIComponent(oldImagePath);
          const oldImageRef = ref(storage, decodedPath);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn("Failed to delete old image:", error);
        }
      }
      
      // Upload new image
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
    // Extract path from URL or use full URL
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

/**
 * The function `deleteProduct` deletes a product document from Firestore and optionally deletes the
 * associated image.
 * @param {string} productId - The `productId` parameter is a string that represents the unique
 * identifier of the product that you want to delete.
 * @param {string} [imageUrl] - The `imageUrl` parameter in the `deleteProduct` function is an optional
 * parameter that represents the URL of the image associated with the product that is being deleted. If
 * an `imageUrl` is provided when calling the `deleteProduct` function, the function will attempt to
 * delete the product image before deleting the
 * @returns The `deleteProduct` function returns a `Promise<boolean>`. The boolean value indicates
 * whether the product deletion was successful (`true`) or if an error occurred during the deletion
 * process (`false`).
 */
export async function deleteProduct(productId: string, imageUrl?: string): Promise<boolean> {
  try {
    // Delete the product image first if it exists
    if (imageUrl) {
      try {
        await deleteProductImage(imageUrl);
      } catch (error) {
        console.warn("Failed to delete product image, continuing with product deletion:", error);
      }
    }

    // Delete the product document from Firestore
    await deleteDoc(doc(db, "products", productId));
    
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}

/**
 * The function fetches a product by its ID from a database and returns the product data if found,
 * otherwise throws an error.
 * @param {string} productId - The `productId` parameter is a string that represents the unique
 * identifier of the product you want to fetch from the database.
 * @returns The `fetchProductById` function returns a Promise that resolves to an object containing the
 * product information if the product with the specified `productId` exists in the database. The object
 * includes the product id (`id`) and all the data associated with the product. If the product is not
 * found, an error with the message "Product not found" is thrown.
 */
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
      firestoreId: doc.id,  // The document ID
      id: data.id,          // The id field from your document
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
// Type definition



