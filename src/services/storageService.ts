// --- Tipos de Dados ---
export type DamageReport = {
    id: number;
    code: string;
    productName: string;
    damage: string;
    discount: string;
    seller: string;
    date: string;
    category: 'Eletrônicos' | 'Eletrodomesticos' | 'Móveis';
    newPrice: string;
    originalPrice: string;
    photoUrl: string;
};

// Tipo para os nossos produtos
export type Product = {
  id: string; // SKU ou código de barras
  name: string;
  price: number;
  category: 'Eletrônicos' | 'Eletrodomesticos' | 'Móveis';
};

// --- Dados Iniciais (Seed Data) ---
const INITIAL_DAMAGE_REPORTS: DamageReport[] = [
    { id: 1, code: "TV-LG-55", productName: "Smart TV LG 55” 4K UHD", damage: "Arranhão profundo na lateral.", discount: "15%", seller: "João Silva", date: "2025-09-08T12:00:00.000Z", category: "Eletrônicos", newPrice: "R$ 2.549,15", originalPrice: "R$ 2.999,00", photoUrl: "https://placehold.co/600x400/cccccc/ffffff?text=Arranhao+na+Tela" },
];

// Lista de produtos para o nosso "banco de dados"
const INITIAL_PRODUCTS: Product[] = [
    { id: 'TV-LG-55', name: 'Smart TV LG 55” 4K UHD', price: 2999.00, category: 'Eletrônicos' },
    { id: 'GEL-BRA-01', name: 'Geladeira Brastemp Frost Free Inverse 540L', price: 4199.00, category: 'Eletrodomesticos' },
    { id: 'NOTE-DELL-I15', name: 'Notebook Dell Inspiron 15', price: 3799.00, category: 'Eletrônicos' },
    { id: 'GR-MAD-03', name: 'Guarda-Roupa Casal Madesa Rustic', price: 999.00, category: 'Móveis' },
    { id: 'FOG-CON-05', name: 'Fogão 5 Bocas Consul Inox', price: 1499.00, category: 'Eletrodomesticos' },
];

// --- Funções do Serviço de Avarias ---
export const getDamageReports = (): DamageReport[] => {
    try {
        const data = localStorage.getItem('damageReports');
        if (data) {
            return JSON.parse(data);
        } else {
            localStorage.setItem('damageReports', JSON.stringify(INITIAL_DAMAGE_REPORTS));
            return INITIAL_DAMAGE_REPORTS;
        }
    } catch (error) {
        console.error("Erro ao buscar relatórios de avaria do localStorage:", error);
        return [];
    }
};

export const saveDamageReports = (reports: DamageReport[]): void => {
    try {
        localStorage.setItem('damageReports', JSON.stringify(reports));
    } catch (error) {
        console.error("Erro ao salvar relatórios de avaria no localStorage:", error);
    }
};

export const addDamageReport = (newReportData: Omit<DamageReport, 'id'>): void => {
    const currentReports = getDamageReports();
    const newId = currentReports.length > 0 ? Math.max(...currentReports.map(r => r.id)) + 1 : 1;
    const newReport: DamageReport = { id: newId, ...newReportData };
    const updatedReports = [newReport, ...currentReports];
    saveDamageReports(updatedReports);
};

export const getDashboardStats = () => {
    const reports = getDamageReports();
    const today = new Date().toISOString().split('T')[0];
    const reportsToday = reports.filter(r => r.date.startsWith(today));
    
    const parsePrice = (priceStr: string) => {
        if (!priceStr) return 0;
        return parseFloat(priceStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
    }

    const totalValueMonth = reports.reduce((acc, report) => {
        const reportDate = new Date(report.date);
        const currentDate = new Date();
        if (reportDate.getMonth() === currentDate.getMonth() && reportDate.getFullYear() === currentDate.getFullYear()){
            return acc + parsePrice(report.newPrice);
        }
        return acc;
    }, 0);

    return {
        damagedToday: reportsToday.length,
        monthlyValue: totalValueMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        pendingWarnings: 3,
        totalReports: reports.length,
    };
};

// --- Funções do Serviço de Produtos ---
export const getProducts = (): Product[] => {
    try {
        const data = localStorage.getItem('products');
        if (data) {
            return JSON.parse(data);
        } else {
            localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
            return INITIAL_PRODUCTS;
        }
    } catch (error) {
        console.error("Erro ao buscar produtos do localStorage:", error);
        return [];
    }
};

export const findProductByCode = (code: string): Product | undefined => {
    const products = getProducts();
    return products.find(p => p.id.toLowerCase() === code.toLowerCase());
};

// // --- Tipos de Dados ---
// // É uma boa prática definir os tipos dos seus dados.
// export type DamageReport = {
//     id: number;
//     code: string;
//     productName: string;
//     damage: string;
//     discount: string;
//     seller: string;
//     date: string;
//     category: string;
//     newPrice: string;
//     originalPrice: string;
//     photoUrl: string;
// };

// // --- Dados Iniciais (Seed Data) ---
// // Estes são os dados que irão popular o localStorage na primeira vez.
// const INITIAL_DAMAGE_REPORTS: DamageReport[] = [
//     { id: 1, code: "ABC123", productName: "Smart TV LG 55” 4K", damage: "Arranhão profundo na lateral direita da tela.", discount: "15%", seller: "João Silva", date: "2025-09-08", category: "Eletrônicos", newPrice: "R$ 2.549,15", originalPrice: "R$ 2.999,00", photoUrl: "https://placehold.co/600x400/cccccc/ffffff?text=Arranhao+na+Tela" },
//     { id: 2, code: "DEF456", productName: "Geladeira Brastemp Frost Free", damage: "Embalagem danificada.", discount: "10%", seller: "Maria Santos", date: "2025-09-07", category: "Eletrodomesticos", newPrice: "R$ 3.149,10", originalPrice: "R$ 3.499,00", photoUrl: "https://placehold.co/600x400/cccccc/ffffff?text=Embalagem+Danificada" },
//     { id: 3, code: "GHI789", productName: "Guarda-Roupa Casal Madesa", damage: "Pequeno defeito no puxador.", discount: "20%", seller: "Pedro Costa", date: "2025-09-06", category: "Móveis", newPrice: "R$ 799,20", originalPrice: "R$ 999,00", photoUrl: "https://placehold.co/600x400/cccccc/ffffff?text=Defeito+Puxador" },
//     { id: 4, code: "JKL012", productName: "Notebook Dell Inspiron 15", damage: "Não liga.", discount: "30%", seller: "Ana Lima", date: "2025-09-05", category: "Eletrônicos", newPrice: "R$ 2.799,30", originalPrice: "R$ 3.999,00", photoUrl: "https://placehold.co/600x400/cccccc/ffffff?text=Nao+Liga" },
// ];

// // --- Funções do Serviço ---

// /**
//  * Busca todos os relatórios de avaria do localStorage.
//  * Se não houver dados, popula com os dados iniciais.
//  * @returns {DamageReport[]} Uma lista de relatórios de avaria.
//  */
// export const getDamageReports = (): DamageReport[] => {
//     try {
//         const data = localStorage.getItem('damageReports');
//         if (data) {
//             return JSON.parse(data);
//         } else {
//             // Se não houver nada no localStorage, salvamos os dados iniciais e os retornamos.
//             localStorage.setItem('damageReports', JSON.stringify(INITIAL_DAMAGE_REPORTS));
//             return INITIAL_DAMAGE_REPORTS;
//         }
//     } catch (error) {
//         console.error("Erro ao buscar relatórios de avaria do localStorage:", error);
//         return [];
//     }
// };

// /**
//  * Salva uma lista completa de relatórios de avaria no localStorage.
//  * @param {DamageReport[]} reports - A lista de relatórios a ser salva.
//  */
// export const saveDamageReports = (reports: DamageReport[]): void => {
//     try {
//         localStorage.setItem('damageReports', JSON.stringify(reports));
//     } catch (error) {
//         console.error("Erro ao salvar relatórios de avaria no localStorage:", error);
//     }
// };

// /**
//  * Adiciona um novo relatório de avaria à lista existente.
//  * @param {Omit<DamageReport, 'id'>} newReportData - Os dados do novo relatório, sem o ID.
//  */
// export const addDamageReport = (newReportData: Omit<DamageReport, 'id'>): void => {
//     const currentReports = getDamageReports();
//     const newId = currentReports.length > 0 ? Math.max(...currentReports.map(r => r.id)) + 1 : 1;
    
//     const newReport: DamageReport = {
//         id: newId,
//         ...newReportData,
//     };

//     const updatedReports = [...currentReports, newReport];
//     saveDamageReports(updatedReports);
// };

// // Você pode adicionar mais funções aqui para outras "tabelas" como 'settings', 'products', etc.