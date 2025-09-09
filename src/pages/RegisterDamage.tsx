import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload, Percent } from "lucide-react";

// Em um projeto real, esses tipos viriam de um arquivo de definições da API.
type Product = {
  id: string;
  name: string;
  price: number;
  category: 'eletronicos' | 'eletrodomesticos' | 'moveis';
};

const RegisterDamage = () => {
  const [productCode, setProductCode] = useState("");
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState([10]);
  const [image, setImage] = useState<File | null>(null);

  const { toast } = useToast();

  // Simula a busca de um produto na API
  const handleSearchProduct = () => {
    if (!productCode) {
        toast({ title: "Atenção", description: "Digite um código de produto para buscar.", variant: "default" });
        return;
    }
    setIsLoading(true);
    // Simulação de delay da API
    setTimeout(() => {
      // Lógica de busca simulada. Poderia retornar null se não encontrar.
      setFoundProduct({
        id: productCode,
        name: "Smart TV LG 55” 4K UHD",
        price: 2999.00,
        category: "eletronicos"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundProduct || !description) {
      toast({ title: "Erro de Validação", description: "Todos os campos de avaria são obrigatórios.", variant: "destructive" });
      return;
    }
    // Lógica para enviar os dados para a API...
    console.log({
      productId: foundProduct.id,
      damageDescription: description,
      discountPercentage: discount[0],
      finalPrice: discountedPrice,
      imageFile: image,
    });

    toast({ title: "Sucesso!", description: `Avaria para "${foundProduct.name}" registrada.` });
    
    // Resetar o formulário para um novo registro
    setProductCode("");
    setFoundProduct(null);
    setDescription("");
    setDiscount([10]);
    setImage(null);
  };
  
  const originalPrice = foundProduct?.price || 0;
  const discountPercentage = discount[0] / 100;
  const discountedPrice = originalPrice * (1 - discountPercentage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Registrar Avaria</h1>
        <p className="text-muted-foreground">Localize o produto e descreva o problema encontrado.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PASSO 1: IDENTIFICAÇÃO DO PRODUTO */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-primary">1. Localizar Produto</CardTitle>
            <CardDescription>Busque pelo código ou SKU para carregar as informações.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                id="productCode"
                placeholder="Digite o código do produto..."
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                disabled={!!foundProduct} // Desabilita após encontrar
              />
              <Button type="button" onClick={handleSearchProduct} disabled={isLoading || !!foundProduct}>
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PASSO 2: DETALHES DA AVARIA (Só aparece se o produto for encontrado) */}
        {foundProduct && (
          <Card className="animate-in fade-in-0 duration-500">
            <CardHeader>
              <CardTitle className="text-primary">2. Detalhar Avaria</CardTitle>
              <CardDescription>Descreva o dano, anexe uma foto e defina o novo preço.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações do Produto Carregado */}
              <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold">{foundProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">Categoria: <span className="capitalize">{foundProduct.category}</span></p>
                  <p className="text-sm text-muted-foreground">Preço Original: <span className="font-medium">R$ {originalPrice.toFixed(2)}</span></p>
              </div>

              {/* Descrição da Avaria */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Avaria *</Label>
                <Textarea id="description" placeholder="Ex: Arranhão profundo na tela, embalagem rasgada..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-2">
                <Label htmlFor="damage-image">Foto da Avaria</Label>
                 <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">{image ? `Arquivo: ${image.name}` : <><span className="font-semibold">Clique para enviar</span> ou arraste e solte</>}</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={(e) => e.target.files && setImage(e.target.files[0])}/>
                    </label>
                </div> 
              </div>

              {/* Percentual de Desconto */}
              <div className="space-y-4">
                <Label>Percentual de Desconto: {discount[0]}%</Label>
                <Slider min={0} max={80} step={1} value={discount} onValueChange={setDiscount} />
              </div>

              {/* Exibição dos Preços */}
              <div className="p-4 border-t mt-4">
                <p className="text-sm text-muted-foreground">Preço original: <span className="line-through">R$ {originalPrice.toFixed(2)}</span></p>
                <p className="text-2xl font-bold text-green-600">
                  Preço final com desconto: R$ {discountedPrice.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão de Envio */}
        <div className="pt-2">
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={!foundProduct || isLoading}>
            Registrar Avaria e Atualizar Estoque
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterDamage;

