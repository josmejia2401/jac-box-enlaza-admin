import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { resetPassword } from "./api";
import Button from '../../../components/button';
import logo from '../../../assets/img/logo.png';

const ResetPasswordPage = () => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token.trim() || !password.trim() || !repeatPassword.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({
        token,
        newPassword: repeatPassword,
      });

      setSuccess(response.message || "¡Contraseña restablecida con éxito!");
      setToken("");
      setPassword("");
      setRepeatPassword("");

      setTimeout(() => {
        navigate('/auth/login');
      }, 2500);
    } catch (err) {
      setError("Ocurrió un error inesperado. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-secondary-light to-info-light">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-primary-light">
        <img src={logo} alt="Logo" className="w-16 h-16 mb-6" />
        <h2 className="text-3xl font-extrabold text-primary-dark mb-2 text-center tracking-tight">
          Restablecer contraseña
        </h2>
        <p className="text-base text-muted-light mb-6 text-center">
          Ingresa el código que recibiste y tu nueva contraseña.
        </p>

        {error && (
          <div className="w-full bg-error-light border border-error-dark text-error-dark px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="w-full bg-success-light border border-success-dark text-success-dark px-4 py-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-text-light mb-1">
              Código / Token
            </label>
            <input
              type="text"
              id="token"
              name="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 border border-muted-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light transition text-base bg-background-light"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-light mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-muted-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light transition text-base bg-background-light"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label htmlFor="repeatPassword" className="block text-sm font-medium text-text-light mb-1">
              Repetir nueva contraseña
            </label>
            <input
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full px-4 py-2 border border-muted-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light transition text-base bg-background-light"
              disabled={loading}
              required
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            loading={loading}
            disabled={loading}
            fullWidth
            className="rounded-lg py-3 text-lg font-bold shadow-sm"
          >
            {loading ? "Restableciendo..." : "Restablecer contraseña"}
          </Button>
        </form>
        <div className="mt-6 w-full flex justify-center">
          <a
            href="/auth/login"
            className="text-primary-dark text-sm hover:underline"
          >
            Volver a iniciar sesión
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;