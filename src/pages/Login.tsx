import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credenciais de admin predefinidas
    const validCredentials = [
      { username: "admin", password: "admin123" },
      { username: "administrador", password: "123456" },
      { username: "usuario", password: "senha123" }
    ];
    
    // Verifica se as credenciais são válidas
    const isValidLogin = validCredentials.some(
      cred => cred.username === credentials.username && cred.password === credentials.password
    );
    
    if (isValidLogin) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Tente: admin/admin123 ou administrador/123456",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={logo} alt="Sistema de Controle" className="w-20 h-20" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Controle de Produtos
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sistema de Avarias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent-hover">
              Entrar
            </Button>
          </form>
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Credenciais para teste:</strong><br />
              admin / admin123<br />
              administrador / 123456
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;