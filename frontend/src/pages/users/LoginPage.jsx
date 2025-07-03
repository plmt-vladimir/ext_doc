import { useState } from "react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import logo from "../../../resource/images/logo.png";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password); 
    } catch (err) {
      setError(err.message || "Ошибка авторизации");
    }
  };

  return (
    <div className="min-h-screen bg-[--color-background] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="PALMETTO" className="w-32 mb-2" />
          <h2 className="text-xl text-center font-bold text-[--color-primary]">
            Ведение исполнительной документации
          </h2>
          <h2 className="text-xl font-bold text-[--color-primary]">Вход в систему</h2>
        </div>
        <div className="grid gap-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <Button onClick={handleLogin}>Войти</Button>
        </div>
      </div>
    </div>
  );
}





