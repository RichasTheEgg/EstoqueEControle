"use client"

import type React from "react"

import { useState } from "react"
import { addMovement, updateProductQuantity, type Product } from "@/lib/firestore"
import styles from "./movement-dialog.module.css"

interface MovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  onMovementAdded: () => void
}

export function MovementDialog({ open, onOpenChange, products, onMovementAdded }: MovementDialogProps) {
  const [formData, setFormData] = useState({
    productId: "",
    type: "entry" as "entry" | "exit",
    quantity: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const product = products.find(p => p.id === formData.productId)
    if (!product) return

    const movement = {
      productId: formData.productId,
      productName: product.name,
      type: formData.type,
      quantity: Number.parseInt(formData.quantity),
      date: new Date().toISOString(),
    }

    const newMovement = await addMovement(movement)
    if (newMovement) {
      const quantityChange = formData.type === "entry" ? Number.parseInt(formData.quantity) : -Number.parseInt(formData.quantity)
      await updateProductQuantity(formData.productId, quantityChange)
      onMovementAdded()
      setFormData({ productId: "", type: "entry", quantity: "" })
      onOpenChange(false)
    }

    setLoading(false)
  }

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={() => onOpenChange(false)}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nova Movimentação</h2>
          <button type="button" className={styles.closeButton} onClick={() => onOpenChange(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.content}>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Produto</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className={styles.select}
                required
              >
                <option value="">Selecione um produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de Movimentação</label>
              <div className={styles.typeButtons}>
                <button
                  type="button"
                  className={`${styles.typeButton} ${formData.type === "entry" ? styles.active : ""}`}
                  onClick={() => setFormData({ ...formData, type: "entry" })}
                >
                  Entrada
                </button>
                <button
                  type="button"
                  className={`${styles.typeButton} ${formData.type === "exit" ? styles.active : ""}`}
                  onClick={() => setFormData({ ...formData, type: "exit" })}
                >
                  Saída
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Quantidade</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className={styles.input}
                placeholder="Digite a quantidade"
                required
              />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => onOpenChange(false)}>
              Cancelar
            </button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
