import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestResetPassword } from "./api";
import Button from '../../../components/button';
import logo from '../../../assets/img/logo.png';


const RecoverPasswordPage = () => {
    const [identifier, setIdentifier] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setIdentifier(e.target.value);
        setError("");
        setSuccess("");
    }; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!identifier.trim()) {
            setError("Por favor, ingresa tu correo electrónico o nombre de usuario.");
            return;
        }

        setLoading(true);
        try {
            const response = await requestResetPassword({
                usernameOrEmail: identifier,
            });

            setSuccess(response.message || "Código enviado con éxito.");

            setTimeout(() => {
                navigate("/auth/reset-password", {
                    state: { emailOrUsername: identifier },
                });
            }, 1500);
        } catch (err) {
            setError("Ha ocurrido un error. Intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const hideError = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-secondary-light to-info-light">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-primary-light">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-16 h-16 mb-6"
                />
                <h2 className="text-3xl font-extrabold text-primary-dark mb-2 text-center tracking-tight">
                    ¿Olvidaste tu contraseña?
                </h2>
                <p className="text-base text-muted-light mb-6 text-center">
                    Ingresa tu correo electrónico o nombre de usuario y te enviaremos instrucciones para restablecer tu contraseña.
                </p>

                {error && (
                    <div className="w-full bg-error-light border border-error-dark text-error-dark px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={hideError} className="ml-3 text-xs underline">Ocultar</button>
                    </div>
                )}

                {success && (
                    <div className="w-full bg-success-light border border-success-dark text-success-dark px-4 py-3 rounded-lg mb-4 text-center">
                        {success}
                    </div>
                )}
                {success && (
                    <div className="w-full bg-warning-light border border-warning-dark text-warning-dark px-4 py-3 rounded-lg mb-4 text-center">
                        Si no recibes el correo en unos minutos, revisa también tu bandeja de <span className="font-semibold">spam</span> o <span className="font-semibold">correo no deseado</span>.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-text-light mb-1">
                            Correo electrónico o usuario
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            value={identifier}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-muted-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light transition text-base bg-background-light"
                            autoComplete="username"
                            disabled={loading}
                            required
                        />
                    </div>


                    <Button
                        variant="primary"
                        type="submit"
                        loading={loading}
                        disabled={loading || !identifier.trim()}
                        fullWidth
                        className="rounded-lg py-3 text-lg font-bold shadow-sm"
                    >
                        {loading ? "Enviando..." : "Enviar instrucciones"}
                    </Button>
                </form>
                <div className="mt-6 w-full flex justify-center">
                    <a
                        href="/auth/login"
                        className="text-primary-dark text-sm hover:underline"
                    >
                        ¿Ya tienes cuenta? Inicia sesión
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RecoverPasswordPage;