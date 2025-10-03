"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: string
  name: string
}

interface Movement {
  productId: string
  type: "entry" | "exit"
  quantity: number
  date: string
}

interface MovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  onSave: (movement: Movement) => void
}

export function MovementDialog({ open, onOpenChange, products, onSave }: MovementDialogProps) {
  const [formData, setFormData] = useState({
    productId: "",
    type: "entry" as "entry" | "exit",
    quantity: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      productId: formData.productId,
      type: formData.type,
      quantity: Number.parseInt(formData.quantity),
      date: new Date().toISOString(),
    })

    setFormData({ productId: "", type: "entry", quantity: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Movimentação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => setFormData({ ...formData, productId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Movimentação</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "entry" | "exit") => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entrada</SelectItem>
                <SelectItem value="exit">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
