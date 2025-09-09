import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Importa o hook para ler a URL
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Download, FileText, Eye, X, Tag, DollarSign, User, Info, Fingerprint, ArrowUpDown, FilterX, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Search } from "lucide-react";
import { getDamageReports, DamageReport } from "@/services/storageService";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Componente do Modal (sem alterações) ---
const ReportDetailsModal = ({ item, onClose }: { item: DamageReport | null, onClose: () => void }) => {
    if (!item) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <Card className="w-full max-w-2xl bg-card shadow-xl relative animate-in fade-in-0 zoom-in-95">
                <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
                    <div>
                        <CardTitle className="text-2xl text-primary">{item.productName}</CardTitle>
                        <CardDescription>Detalhes do registro de avaria</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 right-3"><X className="h-6 w-6" /></Button>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
                        <img src={item.photoUrl} alt={`Foto da avaria do produto ${item.productName}`} className="rounded-md object-cover w-full h-auto max-h-64 border" onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/600x400/cccccc/ffffff?text=Imagem+Indisponivel'; }} />
                        <span className="text-xs text-muted-foreground mt-2">Imagem da avaria</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-primary">Informações do Registro</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-secondary"/> <strong>SKU:</strong> {item.code}</div>
                                <div className="flex items-center gap-2"><Fingerprint className="w-4 h-4 text-secondary"/> <strong>N/S:</strong> {item.serialNumber}</div>
                                <div className="flex items-center gap-2"><User className="w-4 h-4 text-secondary"/> <strong>Vendedor:</strong> {item.seller}</div>
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-secondary"/> <strong>Data:</strong> {new Date(item.date).toLocaleDateString('pt-BR')}</div>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-lg mb-2 text-primary">Detalhes da Avaria</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2"><Info className="w-4 h-4 text-secondary mt-1"/> <div><strong>Descrição:</strong><p className="text-muted-foreground">{item.damage}</p></div></div>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-lg mb-2 text-primary">Valores</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-500"/> <strong>Preço Original:</strong> {item.originalPrice}</div>
                                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-red-500"/> <strong>Desconto Aplicado:</strong> {item.discount}</div>
                                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-600"/> <strong>Novo Preço:</strong> <span className="font-bold">{item.newPrice}</span></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


const Reports = () => {
    const [reportsData, setReportsData] = useState<DamageReport[]>([]);
    const initialFilters = { searchTerm: "", startDate: "", endDate: "", category: "all" };
    const [filters, setFilters] = useState(initialFilters);
    const [sortConfig, setSortConfig] = useState<{ key: keyof DamageReport; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DamageReport | null>(null);
    const [searchParams] = useSearchParams();

    const ITEMS_PER_PAGE = 8;
    
    useEffect(() => {
        const data = getDamageReports();
        setReportsData(data);

        const filtroUrl = searchParams.get('filtro');
        if (filtroUrl) {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            
            if (filtroUrl === 'hoje') {
                setFilters(prev => ({ ...prev, startDate: todayStr, endDate: todayStr }));
            }
            if (filtroUrl === 'mes') {
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];
                setFilters(prev => ({ ...prev, startDate: firstDayStr, endDate: todayStr }));
            }
        }
    }, [searchParams]);

    const processedData = useMemo(() => {
        let filteredItems = reportsData.filter(item => {
            const searchTermLower = filters.searchTerm.toLowerCase();
            const searchTermMatch = 
                item.productName.toLowerCase().includes(searchTermLower) || 
                item.code.toLowerCase().includes(searchTermLower) ||
                item.serialNumber.toLowerCase().includes(searchTermLower);

            const categoryMatch = filters.category === 'all' || item.category === filters.category;
            
            const itemDate = item.date.split('T')[0];
            const startDateMatch = !filters.startDate || itemDate >= filters.startDate;
            const endDateMatch = !filters.endDate || itemDate <= filters.endDate;
            return searchTermMatch && categoryMatch && startDateMatch && endDateMatch;
        });

        if (sortConfig !== null) {
            filteredItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filteredItems;
    }, [filters, sortConfig, reportsData]);

    const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
    const paginatedData = processedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const requestSort = (key: keyof DamageReport) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(18);
        doc.text('Relatório de Avarias', 14, 22);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);
        doc.text(`Total de registros: ${processedData.length}`, 14, 38);
        
        const tableData = processedData.map((item) => [
            item.productName,
            item.code,
            item.serialNumber,
            item.seller,
            new Date(item.date).toLocaleDateString('pt-BR'),
            item.discount,
            item.originalPrice,
            item.newPrice
        ]);
        
        autoTable(doc, {
            head: [['Produto', 'SKU', 'N/S', 'Vendedor', 'Data', 'Desconto', 'Preço Original', 'Novo Preço']],
            body: tableData,
            startY: 45,
            styles: {
                fontSize: 7,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: { cellWidth: 40 }, // Produto
                1: { cellWidth: 20 }, // SKU
                2: { cellWidth: 25 }, // N/S
                3: { cellWidth: 25 }, // Vendedor
                4: { cellWidth: 20 }, // Data
                5: { cellWidth: 18 }, // Desconto
                6: { cellWidth: 22 }, // Preço Original
                7: { cellWidth: 22 }  // Novo Preço
            },
            margin: { left: 14, right: 14 }
        });
        
        const fileName = `relatorio-avarias-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    const handleShowDetails = (item: DamageReport) => { setSelectedItem(item); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedItem(null); };
    const handleClearFilters = () => { setFilters(initialFilters); setCurrentPage(1); };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-primary">Relatórios de Avarias</h1>
                <p className="text-muted-foreground">Analise, filtre e exporte os dados de produtos avariados.</p>
            </div>

            <Card className="shadow-soft">
                <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2"><Search className="w-5 h-5" />Filtros e Pesquisa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2 space-y-2">
                            <label htmlFor="search-term">Buscar por Termo</label>
                            <Input id="search-term" placeholder="Produto, SKU ou N/S..." value={filters.searchTerm} onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="start-date">Data Inicial</label>
                            <Input id="start-date" type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="end-date">Data Final</label>
                            <Input id="end-date" type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} />
                        </div>
                        <Button onClick={handleClearFilters} variant="ghost"><FilterX className="w-4 h-4 mr-2" />Limpar</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-medium">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-primary">Resultados</CardTitle>
                        <CardDescription>{processedData.length} registros encontrados</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="w-4 h-4 mr-2" />PDF</Button>
                        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Excel</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead onClick={() => requestSort('productName')} className="cursor-pointer hover:bg-muted/50">Produto <ArrowUpDown className="inline-block h-4 w-4 ml-1" /></TableHead>
                                    <TableHead>Desconto</TableHead>
                                    <TableHead onClick={() => requestSort('seller')} className="cursor-pointer hover:bg-muted/50">Vendedor <ArrowUpDown className="inline-block h-4 w-4 ml-1" /></TableHead>
                                    <TableHead onClick={() => requestSort('date')} className="cursor-pointer hover:bg-muted/50">Data <ArrowUpDown className="inline-block h-4 w-4 ml-1" /></TableHead>
                                    <TableHead className="text-center">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.productName}
                                                <div className="text-xs text-muted-foreground flex items-center gap-4 mt-1">
                                                    <span className="flex items-center gap-1.5"><Tag className="w-3 h-3"/> {item.code}</span>
                                                    <span className="flex items-center gap-1.5"><Fingerprint className="w-3 h-3"/> {item.serialNumber}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 font-medium">{item.discount}</span></TableCell>
                                            <TableCell>{item.seller}</TableCell>
                                            <TableCell>{new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                                            <TableCell className="text-center"><Button variant="ghost" size="icon" onClick={() => handleShowDetails(item)}><Eye className="h-5 w-5 text-secondary" /></Button></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">Nenhum resultado encontrado.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
                    </div>
                </CardContent>
            </Card>

            {isModalOpen && <ReportDetailsModal item={selectedItem} onClose={handleCloseModal} />}
        </div>
    );
};

export default Reports;



// import { useState, useMemo } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Calendar, Download, FileText, Eye, X, Tag, DollarSign, User, Info, Search, ArrowUpDown, FilterX, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

// // Tipagem para os dados do relatório
// type ReportItem = {
//     id: number;
//     code: string;
//     productName: string;
//     damage: string;
//     discount: string;
//     seller: string;
//     date: string; // Manter como string para facilitar ordenação e filtragem
//     category: string;
//     newPrice: string;
//     originalPrice: string;
//     photoUrl: string;
// };

// // --- Componente do Modal (sem alterações, apenas para manter a completude) ---
// const ReportDetailsModal = ({ item, onClose }: { item: ReportItem | null, onClose: () => void }) => {
//     if (!item) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <Card className="w-full max-w-2xl bg-card shadow-xl relative animate-in fade-in-0 zoom-in-95">
//                 <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
//                     <div>
//                         <CardTitle className="text-2xl text-primary">{item.productName}</CardTitle>
//                         <CardDescription>Detalhes do registro de avaria</CardDescription>
//                     </div>
//                     <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 right-3"><X className="h-6 w-6" /></Button>
//                 </CardHeader>
//                 <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
//                         <img src={item.photoUrl} alt={`Foto da avaria do produto ${item.productName}`} className="rounded-md object-cover w-full h-auto max-h-64 border" onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/600x400/cccccc/ffffff?text=Imagem+Indisponivel'; }} />
//                         <span className="text-xs text-muted-foreground mt-2">Imagem da avaria</span>
//                     </div>
//                     <div className="space-y-4">
//                         <div>
//                             <h3 className="font-semibold text-lg mb-2 text-primary">Informações do Registro</h3>
//                             <div className="space-y-2 text-sm">
//                                 <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-secondary"/> <strong>Código:</strong> {item.code}</div>
//                                 <div className="flex items-center gap-2"><User className="w-4 h-4 text-secondary"/> <strong>Vendedor:</strong> {item.seller}</div>
//                                 <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-secondary"/> <strong>Data:</strong> {new Date(item.date).toLocaleDateString('pt-BR')}</div>
//                             </div>
//                         </div>
//                         <div className="border-t pt-4">
//                             <h3 className="font-semibold text-lg mb-2 text-primary">Detalhes da Avaria</h3>
//                             <div className="space-y-2 text-sm">
//                                 <div className="flex items-start gap-2"><Info className="w-4 h-4 text-secondary mt-1"/> <div><strong>Descrição:</strong><p className="text-muted-foreground">{item.damage}</p></div></div>
//                             </div>
//                         </div>
//                         <div className="border-t pt-4">
//                             <h3 className="font-semibold text-lg mb-2 text-primary">Valores</h3>
//                             <div className="space-y-2 text-sm">
//                                 <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-500"/> <strong>Preço Original:</strong> {item.originalPrice}</div>
//                                 <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-red-500"/> <strong>Desconto Aplicado:</strong> {item.discount}</div>
//                                 <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-600"/> <strong>Novo Preço:</strong> <span className="font-bold">{item.newPrice}</span></div>
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };


// const Reports = () => {
//     const initialFilters = { searchTerm: "", startDate: "", endDate: "", category: "all" };
//     const [filters, setFilters] = useState(initialFilters);
//     const [sortConfig, setSortConfig] = useState<{ key: keyof ReportItem; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });
//     const [currentPage, setCurrentPage] = useState(1);
    
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedItem, setSelectedItem] = useState<ReportItem | null>(null);

//     const ITEMS_PER_PAGE = 10;
    
//     const mockData: ReportItem[] = [
//         // ... (Seus dados mockados aqui, adicionei mais alguns para testar a paginação)
//         { id: 1, code: "ABC123", productName: "Smart TV LG 55” 4K", damage: "Arranhão profundo na lateral direita da tela.", discount: "15%", seller: "João Silva", date: "2025-09-08", category: "Eletrônicos", newPrice: "R$ 2.549,15", originalPrice: "R$ 2.999,00", photoUrl: "https://placehold.co/600x400/cccccc/ffffff?text=Arranhao+na+Tela" },
//         { id: 2, code: "DEF456", productName: "Geladeira Brastemp Frost Free", damage: "Embalagem danificada.", discount: "10%", seller: "Maria Santos", date: "2025-09-07", category: "Eletrodomesticos", newPrice: "R$ 3.149,10", originalPrice: "R$ 3.499,00", photoUrl: "https://placehold.co/600x400/cccccc/ffffff?text=Embalagem+Danificada" },
//         { id: 3, code: "GHI789", productName: "Guarda-Roupa Casal Madesa", damage: "Pequeno defeito no puxador.", discount: "20%", seller: "Pedro Costa", date: "2025-09-06", category: "Móveis", newPrice: "R$ 799,20", originalPrice: "R$ 999,00", photoUrl: "https://placehold.co/600x400/cccccc/ffffff?text=Defeito+Puxador" },
//         { id: 4, code: "JKL012", productName: "Notebook Dell Inspiron 15", damage: "Não liga.", discount: "30%", seller: "Ana Lima", date: "2025-09-05", category: "Eletrônicos", newPrice: "R$ 2.799,30", originalPrice: "R$ 3.999,00", photoUrl: "https://placehold.co/600x400/cccccc/ffffff?text=Nao+Liga" },
//     ];
    
//     // Lógica de filtragem, ordenação e paginação otimizada com useMemo
//     const processedData = useMemo(() => {
//         let filteredItems = mockData.filter(item => {
//             const searchTermMatch = item.productName.toLowerCase().includes(filters.searchTerm.toLowerCase()) || item.code.toLowerCase().includes(filters.searchTerm.toLowerCase());
//             const categoryMatch = filters.category === 'all' || item.category === filters.category;
//             const startDateMatch = !filters.startDate || new Date(item.date) >= new Date(filters.startDate);
//             const endDateMatch = !filters.endDate || new Date(item.date) <= new Date(filters.endDate);
//             return searchTermMatch && categoryMatch && startDateMatch && endDateMatch;
//         });

//         if (sortConfig !== null) {
//             filteredItems.sort((a, b) => {
//                 if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
//                 if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
//                 return 0;
//             });
//         }
//         return filteredItems;
//     }, [filters, sortConfig]);

//     const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
//     const paginatedData = processedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//     const requestSort = (key: keyof ReportItem) => {
//         let direction: 'asc' | 'desc' = 'asc';
//         if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
//             direction = 'desc';
//         }
//         setSortConfig({ key, direction });
//     };

//     const handleShowDetails = (item: ReportItem) => { setSelectedItem(item); setIsModalOpen(true); };
//     const handleCloseModal = () => { setIsModalOpen(false); setSelectedItem(null); };
//     const handleClearFilters = () => { setFilters(initialFilters); setCurrentPage(1); };

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h1 className="text-3xl font-bold text-primary">Relatórios de Avarias</h1>
//                 <p className="text-muted-foreground">Analise, filtre e exporte os dados de produtos avariados.</p>
//             </div>

//             <Card className="shadow-soft">
//                 <CardHeader>
//                     <CardTitle className="text-primary flex items-center gap-2"><Calendar className="w-5 h-5" />Filtros Avançados</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <Input placeholder="Buscar por produto ou código..." value={filters.searchTerm} onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })} className="md:col-span-2" />
//                         <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
//                             <SelectTrigger><SelectValue /></SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">Todas as Categorias</SelectItem>
//                                 <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
//                                 <SelectItem value="Eletrodomesticos">Eletrodomésticos</SelectItem>
//                                 <SelectItem value="Móveis">Móveis</SelectItem>
//                             </SelectContent>
//                         </Select>
//                         <Button onClick={handleClearFilters} variant="ghost"><FilterX className="w-4 h-4 mr-2" />Limpar Filtros</Button>
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="shadow-medium">
//                 <CardHeader className="flex flex-row items-center justify-between">
//                     <div>
//                         <CardTitle className="text-primary">Resultados</CardTitle>
//                         <CardDescription>{processedData.length} registros encontrados</CardDescription>
//                     </div>
//                     <div className="flex gap-2">
//                         <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2" />PDF</Button>
//                         <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Excel</Button>
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="rounded-md border">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead onClick={() => requestSort('productName')} className="cursor-pointer hover:bg-muted/50">Produto <ArrowUpDown className="inline-block h-4 w-4 ml-1" /></TableHead>
//                                     <TableHead>Desconto</TableHead>
//                                     <TableHead onClick={() => requestSort('seller')} className="cursor-pointer hover:bg-muted/50">Vendedor <ArrowUpDown className="inline-block h-4 w-4 ml-1" /></TableHead>
//                                     <TableHead onClick={() => requestSort('date')} className="cursor-pointer hover:bg-muted/50">Data <ArrowUpDown className="inline-block h-4 w-4 ml-1" /></TableHead>
//                                     <TableHead className="text-center">Ações</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {paginatedData.length > 0 ? (
//                                     paginatedData.map((item) => (
//                                         <TableRow key={item.id}>
//                                             <TableCell className="font-medium">{item.productName}<span className="block text-xs text-muted-foreground">{item.code}</span></TableCell>
//                                             <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 font-medium">{item.discount}</span></TableCell>
//                                             <TableCell>{item.seller}</TableCell>
//                                             <TableCell>{new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
//                                             <TableCell className="text-center"><Button variant="ghost" size="icon" onClick={() => handleShowDetails(item)}><Eye className="h-5 w-5 text-secondary" /></Button></TableCell>
//                                         </TableRow>
//                                     ))
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell colSpan={5} className="text-center h-24">Nenhum resultado encontrado.</TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </div>
//                     {/* Controles de Paginação */}
//                     <div className="flex items-center justify-end space-x-2 py-4">
//                         <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
//                         <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
//                         <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
//                         <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
//                         <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
//                     </div>
//                 </CardContent>
//             </Card>

//             {isModalOpen && <ReportDetailsModal item={selectedItem} onClose={handleCloseModal} />}
//         </div>
//     );
// };

// export default Reports;


