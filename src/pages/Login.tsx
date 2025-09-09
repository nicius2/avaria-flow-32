import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import logo from "../assets/banner-login.svg"; // Adjust the path to your logo file

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();

    // Check for the specific credentials: admin / admin
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso. Redirecionando...",
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Tente: admin / admin",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      {/* Container principal para centralizar e dar bordas arredondadas */}
      <div className="flex w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden">
        {/* Left side: Login form */}
        <div className="flex-1 flex items-center justify-center p-12 bg-white">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-left">
              <h1 className="text-2xl font-semibold text-gray-800">Bem-vindo</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite o usuário"
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-2 border-[0.75px] border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ff0100]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a Senha"
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-2 border-[0.75px] border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ff0100]"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#ff0000d0] text-white font-bold py-2 rounded-md hover:bg-[#FF0100] transition ease-linear duration-300"
              >
                Entrar
              </Button>
            </form>
          </div>
        </div>

        {/* Right side: Red banner with logo */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          <img
            src={logo}
            alt="Eletro Mateus Logo"
            className="w-full object-contain p-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;