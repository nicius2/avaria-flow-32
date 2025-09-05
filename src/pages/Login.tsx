import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

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
      navigate("/dashboard");
    } else {
      alert("Credenciais inválidas. Tente: admin/admin123 ou administrador/123456");
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;