import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, Package, AlertTriangle, TrendingUp, Plus, PieChart, Activity, X, Tag, Fingerprint } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { getDashboardStats, getCategoryChartData, getDamageReports, DamageReport } from "@/services/storageService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


// --- Componente do Modal de Relatórios ---
const ReportsModal = ({ reports, onClose }: { reports: DamageReport[], onClose: () => void }) => {
    const navigate = useNavigate();

    const goToReports = () => {
        // CORREÇÃO APLICADA AQUI
        navigate('/dashboard/reports');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <Card className="w-full max-w-4xl bg-card shadow-xl relative animate-in fade-in-0 zoom-in-95 max-h-[90vh] flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between border-b">
                    <div>
                        <CardTitle className="text-2xl text-primary">Todos os Registos do Sistema</CardTitle>
                        <CardDescription>{reports.length} registos de avaria encontrados.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 right-3">
                        <X className="h-6 w-6" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead>Vendedor</TableHead>
                                <TableHead>Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.length > 0 ? (
                                reports.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.productName}
                                            <div className="text-xs text-muted-foreground flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1.5"><Tag className="w-3 h-3"/> {item.code}</span>
                                                <span className="flex items-center gap-1.5"><Fingerprint className="w-3 h-3"/> {item.serialNumber}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.seller}</TableCell>
                                        <TableCell>{new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">Nenhum registo encontrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <div className="p-4 border-t mt-auto">
                    <Button onClick={goToReports}>Ver Relatório Detalhado</Button>
                </div>
            </Card>
        </div>
    );
};


// --- Componente Principal do Dashboard ---
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
    const [allReports, setAllReports] = useState<DamageReport[]>([]);
    const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const statsData = getDashboardStats();
        const chartData = getCategoryChartData();
        const allReportsData = getDamageReports();

        setStats(statsData);
        setChartData(chartData);
        setAllReports(allReportsData);
        setRecentActivity(allReportsData.slice(0, 2));
    }, []);

    const handleCardClick = (title: string, link: string) => {
        if (title === "Total de Registos") {
            setIsReportsModalOpen(true);
        } else {
            navigate(link);
        }
    };

    // CORREÇÃO APLICADA AQUI EM TODAS AS ROTAS
    const statsCards = [
    {
      title: "Produtos Avariados Hoje", value: stats?.damagedToday ?? "...", description: "Novos registos hoje", icon: Package, color: "text-red-500", link: "/dashboard/reports?filtro=hoje"
    },
    {
      title: "Valor Avariado no Mês", value: stats?.monthlyValue ?? "...", description: "Soma dos preços com desconto", icon: TrendingUp, color: "text-blue-500", link: "/dashboard/reports?filtro=mes"
    },
    {
      title: "Avisos Pendentes", value: stats?.pendingWarnings ?? "...", description: "Exemplo de dados estáticos", icon: AlertTriangle, color: "text-yellow-500", link: "/dashboard/reports"
    },
    {
      title: "Total de Registos", value: stats?.totalReports ?? "...", description: "Total no sistema", icon: BarChart3, color: "text-indigo-500", link: "/dashboard/reports"
    }
  ];

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de controlo de avarias
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, index) => (
            <div key={index} onClick={() => handleCardClick(card.title, card.link)} className="cursor-pointer h-full">
              <Card className="shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full">
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
            </div>
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
                  <Link to="/dashboard/register-damage">
                    <Button size="lg" className="w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      <Plus className="w-6 h-6" />
                      <span className="text-base font-medium">Nova Avaria</span>
                    </Button>
                  </Link>
                  <Link to="/dashboard/reports">
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

      {isReportsModalOpen && <ReportsModal reports={allReports} onClose={() => setIsReportsModalOpen(false)} />}
    </>
  );
};

export default Dashboard;

