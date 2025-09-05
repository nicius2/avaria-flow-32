import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, AlertTriangle, TrendingUp, Plus } from "lucide-react";

const Dashboard = () => {
  const statsCards = [
    {
      title: "Produtos Avariados Hoje",
      value: "15",
      description: "3 novos desde ontem",
      icon: Package,
      color: "text-accent"
    },
    {
      title: "Vendas Avariadas no Mês",
      value: "R$ 2.500",
      description: "12% do total de vendas",
      icon: TrendingUp,
      color: "text-secondary"
    },
    {
      title: "Avisos Pendentes",
      value: "3",
      description: "Necessitam atenção",
      icon: AlertTriangle,
      color: "text-warning"
    },
    {
      title: "Relatórios Gerados",
      value: "28",
      description: "Este mês",
      icon: BarChart3,
      color: "text-primary"
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
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
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-primary">Ações Rápidas</CardTitle>
            <CardDescription>Acesse as funcionalidades mais usadas</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors">
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Nova Avaria</div>
            </button>
            <button className="p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors">
              <BarChart3 className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Ver Relatórios</div>
            </button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-primary">Atividade Recente</CardTitle>
            <CardDescription>Últimas movimentações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded bg-muted/50">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Produto ABC123 registrado</div>
                <div className="text-xs text-muted-foreground">há 5 minutos</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-muted/50">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Relatório mensal gerado</div>
                <div className="text-xs text-muted-foreground">há 1 hora</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-muted/50">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Avaria crítica detectada</div>
                <div className="text-xs text-muted-foreground">há 2 horas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;