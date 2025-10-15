import { db } from "./firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  type DocumentData
} from "firebase/firestore"

export interface Product {
  id: string
  name: string
  price: number
  quantity: number
  maxStock: number
  category: string
  createdAt: string
  updatedAt: string
}

export interface Movement {
  id: string
  productId: string
  productName: string
  type: "entry" | "exit"
  quantity: number
  date: string
  createdAt: string
}

// Products CRUD
export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product))
  } catch (error) {
    console.error("Error getting products:", error)
    return []
  }
}

export const addProduct = async (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product | null> => {
  try {
    const now = new Date().toISOString()
    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      createdAt: now,
      updatedAt: now
    })
    return {
      id: docRef.id,
      ...product,
      createdAt: now,
      updatedAt: now
    }
  } catch (error) {
    console.error("Error adding product:", error)
    return null
  }
}

export const updateProduct = async (id: string, product: Partial<Product>): Promise<boolean> => {
  try {
    const docRef = doc(db, "products", id)
    await updateDoc(docRef, {
      ...product,
      updatedAt: new Date().toISOString()
    })
    return true
  } catch (error) {
    console.error("Error updating product:", error)
    return false
  }
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "products", id))
    return true
  } catch (error) {
    console.error("Error deleting product:", error)
    return false
  }
}

// Movements CRUD
export const getMovements = async (): Promise<Movement[]> => {
  try {
    const q = query(collection(db, "movements"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Movement))
  } catch (error) {
    console.error("Error getting movements:", error)
    return []
  }
}

export const addMovement = async (movement: Omit<Movement, "id" | "createdAt">): Promise<Movement | null> => {
  try {
    const docRef = await addDoc(collection(db, "movements"), {
      ...movement,
      createdAt: new Date().toISOString()
    })
    return {
      id: docRef.id,
      ...movement,
      createdAt: new Date().toISOString()
    }
  } catch (error) {
    console.error("Error adding movement:", error)
    return null
  }
}

// Update product quantity when movement is added
export const updateProductQuantity = async (productId: string, quantityChange: number): Promise<boolean> => {
  try {
    const products = await getProducts()
    const product = products.find(p => p.id === productId)
    if (!product) return false

    const newQuantity = product.quantity + quantityChange

    return await updateProduct(productId, { quantity: newQuantity })
  } catch (error) {
    console.error("Error updating product quantity:", error)
    return false
  }
}
