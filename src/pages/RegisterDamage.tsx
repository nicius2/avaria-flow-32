import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const RegisterDamage = () => {
  const [formData, setFormData] = useState({
    productCode: "",
    description: "",
    discount: [10],
    category: "",
    linkedProduct: "",
    price: "" // Adicionado o campo de preço
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação do formulário
    if (!formData.productCode || !formData.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Simulação de chamada de API
    toast({
      title: "Sucesso!",
      description: "Avaria registrada com sucesso",
    });

    // Reset do formulário
    setFormData({
      productCode: "",
      description: "",
      discount: [10],
      category: "",
      linkedProduct: "",
      price: ""
    });
  };

  // Cálculo do preço com desconto
  const originalPrice = parseFloat(formData.price) || 0;
  const discountPercentage = formData.discount[0] / 100;
  const discountedPrice = originalPrice * (1 - discountPercentage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Registrar Avaria</h1>
        <p className="text-muted-foreground">
          Cadastre um novo produto com avaria no sistema
        </p>
      </div>

      <Card className="max-w-2xl shadow-medium">
        <CardHeader>
          <CardTitle className="text-primary">Dados da Avaria</CardTitle>
          <CardDescription>
            Preencha as informações do produto avariado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Código do Produto */}
            <div className="space-y-2">
              <Label htmlFor="productCode">Código do Produto *</Label>
              <Input
                id="productCode"
                placeholder="Ex: ABC123"
                value={formData.productCode}
                onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                required
              />
            </div>

            {/* Preço do Produto */}
            <div className="space-y-2">
              <Label htmlFor="price">Preço Original (R$)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Ex: 150.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                  <SelectItem value="eletrodomesticos">Eletrodomesticos</SelectItem>
                  <SelectItem value="moveis">Móveis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Descrição da Avaria */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição da Avaria *</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente o problema encontrado no produto"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Porcentagem de Desconto */}
            <div className="space-y-4">
              <Label htmlFor="discount">Percentual de Desconto: {formData.discount[0]}%</Label>
              <Slider
                id="discount"
                min={0}
                max={50}
                step={1}
                value={formData.discount}
                onValueChange={(value) => setFormData({ ...formData, discount: value })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Exibição dos Preços */}
            <div className="mt-4">
              <p className="text-sm">
                Preço original: <span className="line-through">R$ {originalPrice.toFixed(2)}</span>
              </p>
              <p className="text-lg font-semibold text-green-600">
                Preço com desconto: R$ {discountedPrice.toFixed(2)}
              </p>
            </div>

            {/* Botão de Envio */}
            <div className="pt-4">
              <Button type="submit" className="bg-accent hover:bg-accent-hover text-accent-foreground">
                Registrar Avaria
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterDamage;