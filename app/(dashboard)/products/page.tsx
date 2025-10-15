"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getProducts, addProduct, updateProduct, deleteProduct, type Product } from "@/lib/firestore"
import styles from "./products.module.css"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ name: "", price: "", quantity: "", maxStock: "", category: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const data = await getProducts()
    setProducts(data)
    setLoading(false)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const productData = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      quantity: Number.parseInt(formData.quantity),
      maxStock: Number.parseInt(formData.maxStock),
      category: formData.category,
    }

    if (editingProduct) {
      const success = await updateProduct(editingProduct.id, productData)
      if (success) {
        await fetchProducts()
      }
    } else {
      const newProduct = await addProduct(productData)
      if (newProduct) {
        await fetchProducts()
      }
    }

    setSaving(false)
    setDialogOpen(false)
    setEditingProduct(null)
    setFormData({ name: "", price: "", quantity: "", maxStock: "", category: "" })
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      maxStock: product.maxStock.toString(),
      category: product.category,
    })
    setDialogOpen(true)
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const success = await deleteProduct(id)
      if (success) {
        await fetchProducts()
      }
    }
  }

  const handleNewProduct = () => {
    setEditingProduct(null)
    setFormData({ name: "", price: "", quantity: "", maxStock: "", category: "" })
    setDialogOpen(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Produtos</h1>
          <p className={styles.subtitle}>Gerencie seu catálogo de produtos</p>
        </div>
        <button onClick={handleNewProduct} className={styles.addButton}>
          <span className={styles.buttonIcon}>➕</span>
          Novo Produto
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.productList}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Carregando produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className={styles.emptyState}>Nenhum produto encontrado</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productCategory}>{product.category}</p>
                </div>
                <div className={styles.productStats}>
                  <div className={styles.productStat}>
                    <span className={styles.productStatLabel}>Preço</span>
                    <span className={styles.productStatValue}>R$ {product.price.toFixed(2)}</span>
                  </div>
                  <div className={styles.productStat}>
                    <span className={styles.productStatLabel}>Quantidade</span>
                    <span className={styles.productStatValue}>{product.quantity} un.</span>
                  </div>
                </div>
                <div className={styles.productActions}>
                  <button onClick={() => handleEditProduct(product)} className={styles.actionButton}>
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {dialogOpen && (
        <div className={styles.modal} onClick={() => setDialogOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingProduct ? "Editar Produto" : "Novo Produto"}</h2>
              <button onClick={() => setDialogOpen(false)} className={styles.modalClose}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Categoria</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Preço</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Quantidade</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Estoque Máximo</label>
                <input
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setDialogOpen(false)} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingProduct ? "Salvar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
