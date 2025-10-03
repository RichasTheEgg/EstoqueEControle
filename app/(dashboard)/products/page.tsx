"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { ProductDialog } from "@/components/products/product-dialog"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    // TODO: Buscar produtos da sua API
    const mockProducts: Product[] = [
      { id: "1", name: "Produto A", price: 50, quantity: 3, category: "Categoria 1" },
      { id: "2", name: "Produto B", price: 100, quantity: 15, category: "Categoria 2" },
      { id: "3", name: "Produto C", price: 75, quantity: 8, category: "Categoria 1" },
    ]
    setProducts(mockProducts)
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveProduct = (product: Omit<Product, "id"> | Product) => {
    if ("id" in product) {
      // TODO: Atualizar produto na sua API
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
    } else {
      // TODO: Criar produto na sua API
      const newProduct = { ...product, id: Date.now().toString() }
      setProducts([...products, newProduct])
    }
    setDialogOpen(false)
    setEditingProduct(null)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleDeleteProduct = (id: string) => {
    // TODO: Deletar produto na sua API
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleNewProduct = () => {
    setEditingProduct(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
        </div>
        <Button onClick={handleNewProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">Nenhum produto encontrado</p>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Preço</p>
                      <p className="font-semibold">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Quantidade</p>
                      <p className="font-semibold">{product.quantity} un.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
