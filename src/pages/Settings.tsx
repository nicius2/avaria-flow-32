import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <User className="w-5 h-5" />
              Configurações de Usuário
            </CardTitle>
            <CardDescription>
              Altere suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nome do Usuário</Label>
              <Input id="userName" defaultValue="Administrador" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userEmail">E-mail</Label>
              <Input id="userEmail" type="email" defaultValue="admin@empresa.com" />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input id="newPassword" type="password" placeholder="Digite a nova senha" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirme a nova senha" />
            </div>

            <Button className="bg-primary hover:bg-primary-hover">
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure suas preferências de notificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Notificações por E-mail</div>
                <div className="text-sm text-muted-foreground">
                  Receber notificações sobre novas avarias
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Relatórios Automáticos</div>
                <div className="text-sm text-muted-foreground">
                  Envio automático de relatórios semanais
                </div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Alertas de Sistema</div>
                <div className="text-sm text-muted-foreground">
                  Notificações sobre problemas no sistema
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Configurações do Sistema
            </CardTitle>
            <CardDescription>
              Configurações avançadas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Desconto Máximo Permitido (%)</Label>
              <Input id="maxDiscount" type="number" defaultValue="50" min="0" max="100" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoApproval">Valor para Auto-Aprovação (R$)</Label>
              <Input id="autoApproval" type="number" defaultValue="100" min="0" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Aprovação Automática</div>
                <div className="text-sm text-muted-foreground">
                  Aprovar automaticamente avarias abaixo do valor limite
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Button variant="outline" className="w-full">
              Restaurar Configurações Padrão
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança e backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Autenticação em Dois Fatores</div>
                <div className="text-sm text-muted-foreground">
                  Adicionar camada extra de segurança
                </div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Log de Atividades</div>
                <div className="text-sm text-muted-foreground">
                  Registrar todas as ações do sistema
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="text-sm font-medium">Backup dos Dados</div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Database className="w-4 h-4 mr-2" />
                  Fazer Backup
                </Button>
                <Button variant="outline" size="sm">
                  Restaurar Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;