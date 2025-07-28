import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-secondary-light to-info-light px-6 py-24 sm:py-32 lg:px-8">
            <div className="bg-white border border-primary-light rounded-3xl shadow-xl px-8 py-14 flex flex-col items-center max-w-lg w-full text-center">
                <p className="text-base font-bold text-primary-dark tracking-wider">404</p>
                <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-balance text-primary-dark sm:text-7xl">
                    Página no encontrada
                </h1>
                <p className="mt-6 text-lg font-medium text-pretty text-muted-light sm:text-xl/8">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                    <Link
                        to="/"
                        className="rounded-lg bg-primary-light py-3 px-6 text-sm font-bold text-white shadow-md hover:bg-primary-dark transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark text-center"
                    >
                        Ir a inicio
                    </Link>
                    <Link
                        to="/soporte"
                        className="text-sm font-semibold text-primary-dark hover:underline transition text-center"
                    >
                        Contactar a soporte <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}