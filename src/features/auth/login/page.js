import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import { signIn } from './api';
import { buildPayloadFromForm, resetFormValues, stopPropagation } from '../../../utils/utils';
import TextInputField from '../../../components/form-builder/fields/text-input-field';
import PasswordInputField from '../../../components/form-builder/fields/password-input-field';
import Button from '../../../components/button';
import { validateFieldFromProps } from '../../../utils/validators';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isValidForm: false,
            errorMessage: null,
            successMessage: null,
            data: {
                username: { value: '', error: '' },
                password: { value: '', error: '' }
            }
        };
    }

    updateState = (payload) => {
        this.setState(prevState => ({ ...prevState, ...payload }), this.propagateState);
    };

    propagateState = () => { };

    handleInputChange = (event) => {
        stopPropagation(event);
        const { name, value } = event.target;
        const error = validateFieldFromProps(value, event.target);
        const updatedField = { value, error };
        const updatedData = { ...this.state.data, [name]: updatedField };
        const isValidForm = Object.values(updatedData).every(f => f.error.length === 0 && f.value.length > 0);
        this.updateState({ data: updatedData, isValidForm });
    };

    handleSubmit = (event) => {
        stopPropagation(event);
        event.preventDefault();
        const { data } = this.state;
        const isValidForm = Object.values(data).every(f => f.error.length === 0 && f.value.length > 0);

        if (!isValidForm) {
            this.updateState({
                errorMessage: "Por favor, completa todos los campos correctamente.",
                successMessage: null
            });
            return;
        }
        this.updateState({ loading: true, errorMessage: null, successMessage: null });

        signIn(buildPayloadFromForm(data))
            .then(response => {
                this.updateState({
                    successMessage: response.message || "¡Bienvenido a Enlaza! Inicio de sesión realizado con éxito.",
                    errorMessage: null,
                    data: resetFormValues(data)
                });
            })
            .catch(err => {
                this.updateState({
                    errorMessage: err.message || "¡Ups! Ocurrió un error al iniciar sesión. Intenta nuevamente.",
                    successMessage: null
                });
            })
            .finally(() => {
                this.updateState({ loading: false });
            });
    };

    render() {
        const { data, loading, errorMessage, successMessage, isValidForm } = this.state;

        return (
            <div className="w-full max-w-md mt-14 p-10 rounded-3xl shadow-xl bg-surface backdrop-blur border border-muted">
                <h2 className="text-left text-4xl font-extrabold mb-2 text-text drop-shadow-sm tracking-tight">
                    ¡Bienvenido a Enlaza!
                </h2>
                <p className="text-left text-lg mb-7 text-muted">
                    Inicia sesión para acortar, compartir y analizar tus enlaces inteligentes.
                </p>
                <p className="text-left text-sm mb-7 text-muted">
                    ¿No tienes cuenta?{' '}
                    <Link to="/auth/register" className="text-primary hover:underline font-semibold transition">
                        Regístrate gratis en segundos.
                    </Link>
                </p>

                {errorMessage && (
                    <div className="bg-error/10 border border-error text-error p-3 rounded-xl mb-4 text-center animate-shake">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-xl mb-4 text-center animate-fade-in">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={this.handleSubmit} noValidate>
                    <TextInputField
                        label="Usuario"
                        id="username"
                        name="username"
                        value={data.username.value}
                        onChange={this.handleInputChange}
                        error={data.username.error}
                        autoComplete="username"
                        disabled={loading}
                        required
                        placeholder="Tu nombre de usuario"
                        className="mb-2"
                        maxLength={10}
                    />

                    <PasswordInputField
                        label="Contraseña"
                        id="password"
                        name="password"
                        value={data.password.value}
                        error={data.password.error}
                        onChange={this.handleInputChange}
                        autoComplete="current-password"
                        disabled={loading}
                        required
                        placeholder="••••••••"
                        className="mb-2"
                    />

                    {/* Enlace de recuperación de contraseña alineado a la derecha */}
                    <div className="flex justify-end mt-1 mb-5">
                        <Link
                            to="/auth/request-recover-password"
                            className="text-sm text-primary hover:underline font-medium transition"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button
                        variant="primary"
                        type="submit"
                        loading={loading}
                        disabled={!isValidForm || loading}
                        fullWidth
                        className="rounded-lg py-3 text-lg font-bold shadow-sm"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
            </div>
        );
    }
}
export default Page;