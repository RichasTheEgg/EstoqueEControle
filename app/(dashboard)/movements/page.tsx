"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { MovementDialog } from "@/components/movements/movement-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getMovements, getProducts, type Movement, type Product } from "@/lib/firestore"
import styles from "./movements.module.css"

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [movementsData, productsData] = await Promise.all([
      getMovements(),
      getProducts()
    ])
    setMovements(movementsData)
    setProducts(productsData)
    setLoading(false)
  }

  const handleMovementAdded = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando movimentações...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Movimentações</h1>
          <p className={styles.subtitle}>Registre entradas e saídas de estoque</p>
        </div>
        <button className={styles.addButton} onClick={() => setDialogOpen(true)}>
          <Plus size={20} />
          Nova Movimentação
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Histórico de Movimentações</h2>
        </div>
        <div className={styles.cardContent}>
          {movements.length === 0 ? (
            <p className={styles.emptyState}>Nenhuma movimentação registrada</p>
          ) : (
            <div className={styles.movementList}>
              {movements.map((movement) => (
                <div key={movement.id} className={styles.movementItem}>
                  <div className={styles.movementLeft}>
                    <div className={`${styles.movementIcon} ${movement.type === "entry" ? styles.entry : styles.exit}`}>
                      {movement.type === "entry" ? "⬆️" : "⬇️"}
                    </div>
                    <div className={styles.movementInfo}>
                      <h3>{movement.productName}</h3>
                      <p>
                        {movement.type === "entry" ? "Entrada" : "Saída"} de {movement.quantity} unidades
                      </p>
                    </div>
                  </div>
                  <div className={styles.movementRight}>
                    <p className={styles.movementDate}>
                      {format(new Date(movement.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MovementDialog open={dialogOpen} onOpenChange={setDialogOpen} products={products} onMovementAdded={handleMovementAdded} />
    </div>
  )
}
