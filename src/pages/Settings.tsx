import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Settings as SettingsIcon, Loader2, AlertTriangle, FileText, Activity, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


// --- Subcomponente para a aba de Perfil ---
const UserProfileSettings = () => {
  // (Componente de Perfil, sem alterações)
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2"><User className="w-5 h-5" /> Perfil do Usuário</CardTitle>
        <CardDescription>Altere suas informações pessoais e de acesso.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ... conteúdo do formulário de perfil ... */}
        <div className="space-y-2">
          <Label htmlFor="userName">Nome do Usuário</Label>
          <Input id="userName" defaultValue="Administrador" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userEmail">E-mail</Label>
          <Input id="userEmail" type="email" defaultValue="admin@empresa.com" readOnly disabled />
          <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
        </div>
        <Separator />
        <p className="font-semibold">Alterar Senha</p>
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Senha Atual</Label>
          <Input id="currentPassword" type="password" placeholder="••••••••" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nova Senha</Label>
          <Input id="newPassword" type="password" placeholder="Digite a nova senha" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
          <Input id="confirmPassword" type="password" placeholder="Confirme a nova senha" />
        </div>
        <Button className="mt-4">Salvar Alterações</Button>
      </CardContent>
    </Card>
  );
};

// --- Subcomponente para a aba de Notificações ---
const NotificationSettings = () => {
  // (Componente de Notificações, sem alterações)
  const { toast } = useToast();
  const handleToggle = (notificationType: string, enabled: boolean) => { toast({ title: "Preferência salva!", description: `${notificationType} ${enabled ? 'ativadas' : 'desativadas'}.` }); };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2"><Bell className="w-5 h-5" /> Notificações</CardTitle>
        <CardDescription>Escolha como você deseja ser notificado sobre as atividades no sistema.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ... conteúdo do formulário de notificações ... */}
        <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><User className="w-4 h-4"/> Avisos Gerais</h3>
            <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                    <Label htmlFor="email-notifications" className="font-semibold">Notificações por E-mail</Label>
                    <p className="text-sm text-muted-foreground">Receba um e-mail quando novas avarias forem registradas.</p>
                </div>
                <Switch id="email-notifications" defaultChecked onCheckedChange={(checked) => handleToggle('Notificações por E-mail', checked)} />
            </div>
        </div>
        <Separator />
        <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><FileText className="w-4 h-4"/> Relatórios</h3>
            <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                    <Label htmlFor="auto-reports" className="font-semibold">Relatórios Automáticos</Label>
                    <p className="text-sm text-muted-foreground">Receba um resumo semanal de relatórios no seu e-mail.</p>
                </div>
                <Switch id="auto-reports" onCheckedChange={(checked) => handleToggle('Relatórios Automáticos', checked)} />
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Subcomponente APRIMORADO para a aba de Sistema ---
const SystemSettings = () => {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    
    // Simula as configurações que viriam da API
    const initialSettings = { maxDiscount: 50, autoApprovalValue: 100, isAutoApprovalEnabled: true };
    const [settings, setSettings] = useState(initialSettings);

    const isDirty = JSON.stringify(settings) !== JSON.stringify(initialSettings);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast({ title: "Sucesso!", description: "Configurações do sistema salvas." });
            // Aqui você atualizaria o 'initialSettings' com os novos 'settings'
        }, 1500);
    };

    return (
        <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2"><SettingsIcon className="w-5 h-5" /> Configurações do Sistema</CardTitle>
                <CardDescription>Defina regras e parâmetros globais que afetam todos os usuários.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Seção de Regras de Desconto */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Regras de Desconto</h3>
                    <div className="space-y-2 p-4 border rounded-lg">
                        <Label htmlFor="maxDiscount">Desconto Máximo Permitido (%)</Label>
                        <Input id="maxDiscount" type="number" value={settings.maxDiscount} onChange={e => setSettings({...settings, maxDiscount: Number(e.target.value)})} min="0" max="100" />
                        <p className="text-sm text-muted-foreground flex items-start gap-2 pt-1">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                            Este é o maior percentual de desconto que um vendedor pode aplicar ao registrar uma avaria.
                        </p>
                    </div>
                </div>

                {/* Seção de Fluxo de Aprovação */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Fluxo de Aprovação</h3>
                    <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="auto-approval-switch" className="text-base font-semibold">Aprovação Automática</Label>
                                <p className="text-sm text-muted-foreground">Agilize o processo para avarias de baixo valor.</p>
                            </div>
                            <Switch id="auto-approval-switch" checked={settings.isAutoApprovalEnabled} onCheckedChange={checked => setSettings({...settings, isAutoApprovalEnabled: checked})} />
                        </div>
                        <div className={`space-y-2 transition-opacity duration-300 ${settings.isAutoApprovalEnabled ? 'opacity-100' : 'opacity-50'}`}>
                            <Label htmlFor="autoApprovalValue">Aprovar avarias com valor final abaixo de (R$)</Label>
                            <Input id="autoApprovalValue" type="number" value={settings.autoApprovalValue} onChange={e => setSettings({...settings, autoApprovalValue: Number(e.target.value)})} min="0" disabled={!settings.isAutoApprovalEnabled} />
                            <p className="text-sm text-muted-foreground flex items-start gap-2 pt-1">
                                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                Registros de avaria cujo preço final seja menor que este valor não precisarão de aprovação gerencial.
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />
                
                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                    <Button onClick={handleSave} disabled={!isDirty || isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Salvar Alterações
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Restaurar Padrões</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle/>Tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação restaurará todas as configurações do sistema para os valores padrão. Isso não pode ser desfeito.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => toast({ title: "Sistema Restaurado", variant: "default" })}>
                                    Sim, restaurar padrões
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Componente Principal da Página de Configurações ---
type Tab = 'profile' | 'notifications' | 'system' | 'security';

const Settings = () => {
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <UserProfileSettings />;
            case 'notifications': return <NotificationSettings />;
            case 'system': return <SystemSettings />;
            // Adicione o case para 'security' quando o componente estiver pronto
            default: return <UserProfileSettings />;
        }
    };

    const getTabClassName = (tabName: Tab) => `cursor-pointer p-3 text-sm font-medium rounded-md transition-colors text-left ${activeTab === tabName ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-primary">Configurações</h1>
                <p className="text-muted-foreground">Gerencie as configurações de usuário e do sistema.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <nav className="md:col-span-1 lg:col-span-1 flex flex-col space-y-2">
                    <button onClick={() => setActiveTab('profile')} className={getTabClassName('profile')}>Perfil</button>
                    <button onClick={() => setActiveTab('notifications')} className={getTabClassName('notifications')}>Notificações</button>

                   
                </nav>
                <div className="md:col-span-3 lg:col-span-4">
                    <Card className="shadow-soft">
                        {renderContent()}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
