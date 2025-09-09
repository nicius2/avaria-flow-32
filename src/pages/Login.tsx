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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Container principal para centralizar e dar bordas arredondadas */}
      <div className="flex flex-col lg:flex-row w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden bg-white">
        {/* Left side: Login form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white order-2 lg:order-1">
          <div className="w-full max-w-sm space-y-6 sm:space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Bem-vindo</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite o usuário"
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border-[0.75px] border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ff0100] text-sm sm:text-base"
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
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border-[0.75px] border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ff0100] text-sm sm:text-base"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#ff0000d0] text-white font-bold py-2 sm:py-2 rounded-md hover:bg-[#FF0100] transition ease-linear duration-300 text-sm sm:text-base"
              >
                Entrar
              </Button>
            </form>
          </div>
        </div>

        {/* Right side: Red banner with logo */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative min-h-[200px] sm:min-h-[250px] lg:min-h-auto order-1 lg:order-2">
          <img
            src={logo}
            alt="Eletro Mateus Logo"
            className="w-full max-w-[200px] sm:max-w-[250px] lg:max-w-none object-contain p-2 sm:p-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;