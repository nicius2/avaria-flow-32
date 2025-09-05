import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Download, FileText, Table as TableIcon } from "lucide-react";

const Reports = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
  });

  const mockData = [
    {
      code: "ABC123",
      damage: "Arranhão na lateral",
      discount: "15%",
      seller: "João Silva",
      linkedProduct: "ABC124",
      date: "2024-01-15",
      category: "Eletrônicos"
    },
    {
      code: "DEF456",
      damage: "Embalagem danificada",
      discount: "10%",
      seller: "Maria Santos",
      linkedProduct: "DEF457",
      date: "2024-01-14",
      category: "Roupas"
    },
    {
      code: "GHI789",
      damage: "Pequeno defeito",
      discount: "20%",
      seller: "Pedro Costa",
      linkedProduct: "GHI790",
      date: "2024-01-13",
      category: "Casa"
    },
    {
      code: "JKL012",
      damage: "Problema no funcionamento",
      discount: "30%",
      seller: "Ana Lima",
      linkedProduct: "JKL013",
      date: "2024-01-12",
      category: "Eletrônicos"
    }
  ];

  const exportToPDF = () => {
    // Simulate PDF export
    alert("Relatório exportado para PDF!");
  };

  const exportToExcel = () => {
    // Simulate Excel export
    alert("Relatório exportado para Excel!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Relatório de Vendas de Avariados</h1>
        <p className="text-muted-foreground">
          Visualize e exporte relatórios de produtos avariados vendidos
        </p>
      </div>

      {/* Filters Section */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Configure os filtros para gerar o relatório desejado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                  <SelectItem value="eletrodomesticos">Eletrodomesticos</SelectItem>
                  <SelectItem value="moveis">Móveis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button className="bg-primary hover:bg-primary-hover">
              <TableIcon className="w-4 h-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card className="shadow-medium">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-primary">Resultados</CardTitle>
            <CardDescription>{mockData.length} registros encontrados</CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={exportToPDF} variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button onClick={exportToExcel} variant="outline" size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Avaria</TableHead>
                  <TableHead className="font-semibold">Desconto</TableHead>
                  <TableHead className="font-semibold">Vendedor</TableHead>
                  <TableHead className="font-semibold">Produto Vinculado</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Categoria</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.damage}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent font-medium">
                        {item.discount}
                      </span>
                    </TableCell>
                    <TableCell>{item.seller}</TableCell>
                    <TableCell>
                      <span className="text-secondary hover:underline cursor-pointer">
                        {item.linkedProduct}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {item.category}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;