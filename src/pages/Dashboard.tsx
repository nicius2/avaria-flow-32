import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Package, AlertTriangle, TrendingUp, Plus, PieChart, Activity } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { getDashboardStats, getCategoryChartData, getDamageReports, DamageReport } from "@/services/storageService";

// Tipagem para os dados do Dashboard
type DashboardStats = {
    damagedToday: number;
    monthlyValue: string;
    pendingWarnings: number;
    totalReports: number;
};

type ChartData = {
    category: string;
    total: number;
};

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [recentActivity, setRecentActivity] = useState<DamageReport[]>([]);

    useEffect(() => {
        const statsData = getDashboardStats();
        const chartData = getCategoryChartData();
        const allReports = getDamageReports();

        setStats(statsData);
        setChartData(chartData);
        setRecentActivity(allReports.slice(0, 2)); // Pega apenas os 2 registos mais recentes
    }, []);

    const statsCards = [
    {
      title: "Produtos Avariados Hoje",
      value: stats?.damagedToday ?? "...",
      description: "Novos registos hoje",
      icon: Package,
      color: "text-red-500",
      link: "/relatorios"
    },
    {
      title: "Valor Avariado no Mês",
      value: stats?.monthlyValue ?? "...",
      description: "Soma dos preços com desconto",
      icon: TrendingUp,
      color: "text-blue-500",
      link: "/relatorios"
    },
    {
      title: "Avisos Pendentes",
      value: stats?.pendingWarnings ?? "...",
      description: "Exemplo de dados estáticos",
      icon: AlertTriangle,
      color: "text-yellow-500",
      link: "/avisos"
    },
    {
      title: "Total de Registos",
      value: stats?.totalReports ?? "...",
      description: "Total no sistema",
      icon: BarChart3,
      color: "text-indigo-500",
      link: "/relatorios"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de controlo de avarias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Link to={card.link} key={index}>
            <Card className="shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="shadow-soft lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Avarias por Categoria
            </CardTitle>
            <CardDescription>Distribuição de todos os registos de avaria por categoria.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip cursor={{fill: 'rgba(220, 220, 220, 0.2)'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '0.5rem'}} />
                        <Bar dataKey="total" name="Total" fill="var(--color-primary, #173279)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                    <span>Não há dados suficientes para exibir o gráfico.</span>
                </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-primary">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Link to="/registrar-avaria">
                  <Button size="lg" className="w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Plus className="w-6 h-6" />
                    <span className="text-base font-medium">Nova Avaria</span>
                  </Button>
                </Link>
                <Link to="/relatorios">
                  <Button size="lg" variant="outline" className="w-full h-full flex flex-col items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5">
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-base font-medium">Ver Relatórios</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-primary">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.length > 0 ? (
                    recentActivity.map(activity => (
                        <div key={activity.id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                            <Activity className="w-4 h-4 text-secondary mt-1 shrink-0" />
                            <div>
                                <div className="text-sm font-medium">{activity.productName}</div>
                                <div className="text-xs text-muted-foreground">Novo registo de avaria adicionado.</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-center text-muted-foreground py-4">Nenhuma atividade recente.</div>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { BarChart3, Package, AlertTriangle, TrendingUp, Plus, PieChart } from "lucide-react";
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// // Dados para o novo gráfico (exemplo estático)
// const chartData = [
//   { category: 'Eletrônicos', total: 8 },
//   { category: 'Móveis', total: 5 },
//   { category: 'Eletrodom.', total: 2 },
// ];

// const Dashboard = () => {
//   const statsCards = [
//     {
//       title: "Produtos Avariados Hoje",
//       value: "15",
//       description: "3 novos desde ontem",
//       icon: Package,
//       color: "text-red-500",
//       link: "/relatorios?periodo=hoje"
//     },
//     {
//       title: "Vendas Avariadas no Mês",
//       value: "R$ 2.500",
//       description: "12% do total de vendas",
//       icon: TrendingUp,
//       color: "text-blue-500",
//       link: "/relatorios?tipo=vendas"
//     },
//     {
//       title: "Avisos Pendentes",
//       value: "3",
//       description: "Necessitam atenção",
//       icon: AlertTriangle,
//       color: "text-yellow-500",
//       link: "/avisos"
//     },
//     {
//       title: "Relatórios Gerados",
//       value: "28",
//       description: "Este mês",
//       icon: BarChart3,
//       color: "text-indigo-500",
//       link: "/relatorios"
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
//         <p className="text-muted-foreground">
//           Visão geral do sistema de controle de avarias
//         </p>
//       </div>

//       {/* Statistics Cards - Agora são clicáveis */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {statsCards.map((card, index) => (
//           <Link to={card.link} key={index}>
//             <Card className="shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {card.title}
//                 </CardTitle>
//                 <card.icon className={`h-4 w-4 ${card.color}`} />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-card-foreground">{card.value}</div>
//                 <p className="text-xs text-muted-foreground">{card.description}</p>
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//         {/* Gráfico de Avarias por Categoria */}
//         <Card className="shadow-soft lg:col-span-3">
//           <CardHeader>
//             <CardTitle className="text-primary flex items-center gap-2">
//               <PieChart className="h-5 w-5" />
//               Avarias por Categoria (Últimos 7 dias)
//             </CardTitle>
//             <CardDescription>Distribuição das avarias registradas recentemente.</CardDescription>
//           </CardHeader>
//           <CardContent className="pl-2">
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={chartData}>
//                 <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
//                 <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
//                 <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Ações Rápidas e Atividade Recente */}
//         <div className="lg:col-span-2 space-y-6">
//             <Card className="shadow-soft">
//               <CardHeader>
//                 <CardTitle className="text-primary">Ações Rápidas</CardTitle>
//               </CardHeader>
//               <CardContent className="grid grid-cols-2 gap-4">
//                 {/* BOTÃO 'Nova Avaria' COM ESTILO CORRIGIDO */}
//                 <Link to="/registrar-avaria">
//                   <Button 
//                     size="lg"
//                     className="w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
//                   >
//                     <Plus className="w-6 h-6" />
//                     <span className="text-base font-medium">Nova Avaria</span>
//                   </Button>
//                 </Link>
//                 {/* BOTÃO 'Ver Relatórios' COM ESTILO CORRIGIDO */}
//                 <Link to="/relatorios">
//                   <Button 
//                     size="lg"
//                     variant="outline"
//                     className="w-full h-full flex flex-col items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5"
//                   >
//                     <BarChart3 className="w-6 h-6" />
//                     <span className="text-base font-medium">Ver Relatórios</span>
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             <Card className="shadow-soft">
//               <CardHeader>
//                 <CardTitle className="text-primary">Atividade Recente</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {/* Aqui seria ideal mapear um array de atividades */}
//                 <div className="flex items-center gap-3 p-2 rounded">
//                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                   <div>
//                     <div className="text-sm font-medium">Produto ABC123 registrado</div>
//                     <div className="text-xs text-muted-foreground">há 5 minutos</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

