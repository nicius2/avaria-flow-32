import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addDamageReport, findProductByCode, Product } from "@/services/storageService";

const RegisterDamage = () => {
  const [productCode, setProductCode] = useState("");
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState([10]);
  const [image, setImage] = useState<File | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearchProduct = () => {
    if (!productCode) {
        toast({ title: "Atenção", description: "Digite um código de produto para buscar.", variant: "default" });
        return;
    }
    setIsLoading(true);

    setTimeout(() => {
        const product = findProductByCode(productCode);

        if (product) {
            setFoundProduct(product);
            toast({ title: "Produto Encontrado!", description: product.name });
        } else {
            setFoundProduct(null);
            toast({ title: "Erro", description: `Produto com o código "${productCode}" não foi encontrado.`, variant: "destructive" });
        }
        setIsLoading(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundProduct || !description || !serialNumber) {
      toast({ title: "Erro de Validação", description: "Todos os campos, incluindo o número de série, são obrigatórios.", variant: "destructive" });
      return;
    }

    const originalPrice = foundProduct?.price || 0;
    const discountPercentage = discount[0] / 100;
    const discountedPrice = originalPrice * (1 - discountPercentage);

    const newReportData = {
        code: foundProduct.id,
        serialNumber: serialNumber,
        productName: foundProduct.name,
        damage: description,
        discount: `${discount[0]}%`,
        seller: "Usuário Atual",
        date: new Date().toISOString(),
        category: foundProduct.category,
        newPrice: `R$ ${discountedPrice.toFixed(2).replace('.',',')}`,
        originalPrice: `R$ ${originalPrice.toFixed(2).replace('.',',')}`,
        photoUrl: image ? URL.createObjectURL(image) : `https://placehold.co/600x400/cccccc/ffffff?text=Sem+Imagem`
    };

    addDamageReport(newReportData);
    toast({ title: "Sucesso!", description: `Avaria para "${foundProduct.name}" registrada.` });
    
    setProductCode("");
    setFoundProduct(null);
    setSerialNumber("");
    setDescription("");
    setDiscount([10]);
    setImage(null);
    
    setTimeout(() => {
        // CORREÇÃO APLICADA AQUI
        navigate('/dashboard/reports');
    }, 1000);
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
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-primary">1. Localizar Produto</CardTitle>
            <CardDescription>Busque pelo código ou SKU para carregar as informações.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                id="productCode"
                placeholder="Ex: TV-LG-55, GEL-BRA-01..."
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                disabled={!!foundProduct}
              />
              <Button type="button" onClick={handleSearchProduct} disabled={isLoading || !!foundProduct}>
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {foundProduct && (
          <Card className="animate-in fade-in-0 duration-500">
            <CardHeader>
              <CardTitle className="text-primary">2. Detalhar Avaria</CardTitle>
              <CardDescription>Informe o número de série único deste item e descreva o dano.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold">{foundProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {foundProduct.id}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Número de Série do Item *</Label>
                <Input 
                    id="serialNumber" 
                    placeholder="Ex: SN-BRX5487A" 
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Identificador único do item físico (geralmente encontrado na etiqueta do produto).
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Avaria *</Label>
                <Textarea id="description" placeholder="Ex: Arranhão profundo na tela, embalagem rasgada..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="damage-image">Foto da Avaria</Label>
                 <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">{image ? `Arquivo: ${image.name}` : <><span className="font-semibold">Clique para enviar</span> ou arraste e solte</>}</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && setImage(e.target.files[0])}/>
                    </label>
                </div> 
              </div>

              <div className="space-y-4">
                <Label>Percentual de Desconto: {discount[0]}%</Label>
                <Slider min={0} max={50} step={1} value={discount} onValueChange={setDiscount} />
              </div>
              
              <div className="p-4 border-t mt-4">
                <p className="text-sm text-muted-foreground">Preço original: <span className="line-through">R$ {originalPrice.toFixed(2).replace('.',',')}</span></p>
                <p className="text-2xl font-bold text-green-600">
                  Preço final com desconto: R$ {discountedPrice.toFixed(2).replace('.',',')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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