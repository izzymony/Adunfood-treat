import { db, storage } from "@/firebaseConfig";
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  deleteDoc  // Added for delete functionality
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export interface Category {
  id: string;
  name: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchCategories(): Promise<Category[]> {
  console.log("[Firebase] Fetching categories...");
  try {
    const q = query(collection(db, "categories"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const categories = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        image: data.image || undefined,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as Category;
    });
    
    console.log("[Firebase] Successfully fetched categories:", categories.length);
    return categories;
  } catch (error) {
    console.error("[Firebase] Error fetching categories:", error);
    throw new Error("Failed to fetch categories. Please try again later.");
  }
}

export async function addCategory(
  categoryData: Category,
  imageFile?: File
): Promise<Category> {
  console.log("[Firebase] Adding new category with ID:", categoryData.id);
  
  try {
    // Validate input
    if (!categoryData.id) {
      throw new Error("Category ID is required");
    }
    if (!categoryData.name?.trim()) {
      throw new Error("Category name is required");
    }

    // Handle image upload
    const imageUrl = imageFile 
      ? await uploadCategoryImage(imageFile, categoryData.id)
      : categoryData.image || undefined;

    // Prepare category document
    const categoryDoc = {
      name: categoryData.name.trim(),
      ...(imageUrl && { image: imageUrl }),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log("[Firebase] Creating category document with ID:", categoryData.id);
    await setDoc(doc(db, "categories", categoryData.id), categoryDoc);
    
    console.log("[Firebase] Category created successfully with custom ID");
    return {
      id: categoryData.id,
      ...categoryDoc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("[Firebase] Error adding category:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to create category. Please try again."
    );
  }
}

export async function updateCategoryImage(
  categoryId: string,
  newImageFile: File,
  oldImageUrl?: string
): Promise<string> {
  console.log(`[Firebase] Updating image for category: ${categoryId}`);
  
  try {
    // Delete old image if exists
    if (oldImageUrl) {
      await deleteImage(oldImageUrl);
    }

    // Upload new image
    const newImageUrl = await uploadCategoryImage(newImageFile, categoryId);
    
    // Update the category document with new image URL
    await setDoc(doc(db, "categories", categoryId), {
      image: newImageUrl,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return newImageUrl;
  } catch (error) {
    console.error("[Firebase] Error updating category image:", error);
    throw new Error("Failed to update category image");
  }
}

export async function deleteCategory(categoryId: string, imageUrl?: string): Promise<void> {
  console.log(`[Firebase] Deleting category: ${categoryId}`);
  
  try {
    // Delete associated image if it exists
    if (imageUrl) {
      try {
        await deleteImage(imageUrl);
        console.log(`[Firebase] Deleted image for category: ${categoryId}`);
      } catch (error) {
        console.warn(`[Firebase] Could not delete image for category ${categoryId}:`, error);
      }
    }

    // Delete the category document
    await deleteDoc(doc(db, "categories", categoryId));
    console.log(`[Firebase] Successfully deleted category: ${categoryId}`);
  } catch (error) {
    console.error(`[Firebase] Error deleting category ${categoryId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to delete category. Please try again."
    );
  }
}

async function uploadCategoryImage(
  file: File,
  categoryId?: string
): Promise<string> {
  console.log("[Firebase] Starting image upload...");
  
  try {
    // Validate file
    if (!file.type.match('image.*')) {
      throw new Error("Only image files are allowed");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size exceeds 5MB limit");
    }

    // Generate filename
    const extension = file.name.split('.').pop();
    const fileName = categoryId 
      ? `category-${categoryId}-${Date.now()}.${extension}`
      : `temp-${Date.now()}.${extension}`;

    const storagePath = `categories/${fileName}`;
    const storageRef = ref(storage, storagePath);

    console.log("[Firebase] Uploading image to:", storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log("[Firebase] Image uploaded successfully. URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("[Firebase] Image upload failed:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Image upload failed. Please try again."
    );
  }
}

async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const urlParts = imageUrl.split('/o/');
    const path = decodeURIComponent(urlParts[1].split('?')[0]);
    
    console.log("[Firebase] Deleting image:", path);
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
    console.log("[Firebase] Image deleted successfully");
  } catch (error) {
    console.warn("[Firebase] Failed to delete image:", error);
  }
}