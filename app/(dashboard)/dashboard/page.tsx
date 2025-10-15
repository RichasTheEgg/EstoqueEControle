"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { getProducts, getMovements, type Product, type Movement } from "@/lib/firestore"
import styles from "./dashboard.module.css"

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [productsData, movementsData] = await Promise.all([
        getProducts(),
        getMovements()
      ])
      setProducts(productsData)
      setMovements(movementsData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const lowStockProducts = products.filter((p) => p.quantity < p.maxStock * 0.2)
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const currentMonth = new Date().getMonth()
  const monthMovements = movements.filter((m) => {
    const moveDate = new Date(m.date)
    return moveDate.getMonth() === currentMonth
  })

  const entries = monthMovements.filter((m) => m.type === "entry").length
  const exits = monthMovements.filter((m) => m.type === "exit").length

  const chartData = [
    { name: "Entradas", value: entries },
    { name: "Saídas", value: exits },
  ]

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando dados...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Visão geral do seu estoque</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Produtos em Estoque</span>
            <span className={styles.statIcon}>📦</span>
          </div>
          <div className={styles.statValue}>{products.length}</div>
          <div className={styles.statDescription}>Total de produtos cadastrados</div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardWarning}`}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Estoque Baixo</span>
            <span className={styles.statIcon}>⚠️</span>
          </div>
          <div className={styles.statValue}>{lowStockProducts.length}</div>
          <div className={styles.statDescription}>Produtos com menos de 20% do estoque</div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardSuccess}`}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Valor Total</span>
            <span className={styles.statIcon}>💰</span>
          </div>
          <div className={styles.statValue}>R$ {totalValue.toFixed(2)}</div>
          <div className={styles.statDescription}>Valor total do estoque</div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Produtos com Estoque Baixo</h2>
          </div>
          <div className={styles.cardContent}>
            {lowStockProducts.length === 0 ? (
              <p className={styles.emptyState}>Nenhum produto com estoque baixo</p>
            ) : (
              <div className={styles.productList}>
                {lowStockProducts.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <div className={styles.productInfo}>
                      <p className={styles.productName}>{product.name}</p>
                      <p className={styles.productCategory}>{product.category}</p>
                    </div>
                    <div className={styles.productDetails}>
                      <p className={styles.productQuantity}>{product.quantity} un.</p>
                      <p className={styles.productPrice}>R$ {product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Movimentações do Mês</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#6b6b85" />
                  <YAxis stroke="#6b6b85" />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a24",
                      border: "1px solid #2a2a3a",
                      borderRadius: "0.5rem",
                      color: "#ffffff",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.movementStats}>
              <div className={styles.movementStat}>
                <span className={styles.movementIcon}>⬆️</span>
                <div>
                  <p className={styles.movementLabel}>Entradas</p>
                  <p className={styles.movementValue}>{entries}</p>
                </div>
              </div>
              <div className={styles.movementStat}>
                <span className={styles.movementIcon}>⬇️</span>
                <div>
                  <p className={styles.movementLabel}>Saídas</p>
                  <p className={styles.movementValue}>{exits}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
