"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingDown, DollarSign, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

interface Movement {
  id: string
  productId: string
  type: "entry" | "exit"
  quantity: number
  date: string
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<Movement[]>([])

  useEffect(() => {
    // TODO: Buscar dados da sua API
    // Dados de exemplo por enquanto
    const mockProducts: Product[] = [
      { id: "1", name: "Produto A", price: 50, quantity: 3, category: "Categoria 1" },
      { id: "2", name: "Produto B", price: 100, quantity: 15, category: "Categoria 2" },
      { id: "3", name: "Produto C", price: 75, quantity: 8, category: "Categoria 1" },
    ]

    const mockMovements: Movement[] = [
      { id: "1", productId: "1", type: "entry", quantity: 10, date: "2025-03-01" },
      { id: "2", productId: "2", type: "exit", quantity: 5, date: "2025-03-02" },
      { id: "3", productId: "1", type: "exit", quantity: 7, date: "2025-03-03" },
    ]

    setProducts(mockProducts)
    setMovements(mockMovements)
  }, [])

  const lowStockProducts = products.filter((p) => p.quantity < 5)
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu estoque</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Total de produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Produtos com menos de 5 unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Valor total do estoque</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum produto com estoque baixo</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive">{product.quantity} un.</p>
                      <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentações do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-around">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Entradas</p>
                  <p className="text-xl font-bold">{entries}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Saídas</p>
                  <p className="text-xl font-bold">{exits}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
