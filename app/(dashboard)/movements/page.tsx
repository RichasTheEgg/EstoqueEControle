"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { MovementDialog } from "@/components/movements/movement-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Product {
  id: string
  name: string
}

interface Movement {
  id: string
  productId: string
  productName: string
  type: "entry" | "exit"
  quantity: number
  date: string
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // TODO: Buscar movimentações e produtos da sua API
    const mockProducts: Product[] = [
      { id: "1", name: "Produto A" },
      { id: "2", name: "Produto B" },
      { id: "3", name: "Produto C" },
    ]

    const mockMovements: Movement[] = [
      {
        id: "1",
        productId: "1",
        productName: "Produto A",
        type: "entry",
        quantity: 10,
        date: "2025-03-01T10:00:00",
      },
      {
        id: "2",
        productId: "2",
        productName: "Produto B",
        type: "exit",
        quantity: 5,
        date: "2025-03-02T14:30:00",
      },
      {
        id: "3",
        productId: "1",
        productName: "Produto A",
        type: "exit",
        quantity: 7,
        date: "2025-03-03T09:15:00",
      },
    ]

    setProducts(mockProducts)
    setMovements(mockMovements)
  }, [])

  const handleSaveMovement = (movement: Omit<Movement, "id" | "productName">) => {
    // TODO: Criar movimentação na sua API
    const product = products.find((p) => p.id === movement.productId)
    const newMovement = {
      ...movement,
      id: Date.now().toString(),
      productName: product?.name || "",
    }
    setMovements([newMovement, ...movements])
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Movimentações</h1>
          <p className="text-muted-foreground">Registre entradas e saídas de estoque</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Movimentação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movements.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">Nenhuma movimentação registrada</p>
            ) : (
              movements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    {movement.type === "entry" ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <ArrowUpCircle className="h-5 w-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                        <ArrowDownCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{movement.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {movement.type === "entry" ? "Entrada" : "Saída"} de {movement.quantity} unidades
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(movement.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <MovementDialog open={dialogOpen} onOpenChange={setDialogOpen} products={products} onSave={handleSaveMovement} />
    </div>
  )
}
