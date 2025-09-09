import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Package, AlertTriangle, TrendingUp, Plus, PieChart } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Dados para o novo gráfico (exemplo estático)
const chartData = [
  { category: 'Eletrônicos', total: 8 },
  { category: 'Móveis', total: 5 },
  { category: 'Eletrodom.', total: 2 },
];

const Dashboard = () => {
  const statsCards = [
    {
      title: "Produtos Avariados Hoje",
      value: "15",
      description: "3 novos desde ontem",
      icon: Package,
      color: "text-red-500",
      link: "/relatorios?periodo=hoje"
    },
    {
      title: "Vendas Avariadas no Mês",
      value: "R$ 2.500",
      description: "12% do total de vendas",
      icon: TrendingUp,
      color: "text-blue-500",
      link: "/relatorios?tipo=vendas"
    },
    {
      title: "Avisos Pendentes",
      value: "3",
      description: "Necessitam atenção",
      icon: AlertTriangle,
      color: "text-yellow-500",
      link: "/avisos"
    },
    {
      title: "Relatórios Gerados",
      value: "28",
      description: "Este mês",
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
          Visão geral do sistema de controle de avarias
        </p>
      </div>

      {/* Statistics Cards - Agora são clicáveis */}
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
        {/* Gráfico de Avarias por Categoria */}
        <Card className="shadow-soft lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Avarias por Categoria (Últimos 7 dias)
            </CardTitle>
            <CardDescription>Distribuição das avarias registradas recentemente.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ações Rápidas e Atividade Recente */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-primary">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {/* BOTÃO 'Nova Avaria' COM ESTILO CORRIGIDO */}
                <Link to="/registrar-avaria">
                  <Button 
                    size="lg"
                    className="w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-base font-medium">Nova Avaria</span>
                  </Button>
                </Link>
                {/* BOTÃO 'Ver Relatórios' COM ESTILO CORRIGIDO */}
                <Link to="/relatorios">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full h-full flex flex-col items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5"
                  >
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
                {/* Aqui seria ideal mapear um array de atividades */}
                <div className="flex items-center gap-3 p-2 rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-sm font-medium">Produto ABC123 registrado</div>
                    <div className="text-xs text-muted-foreground">há 5 minutos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

