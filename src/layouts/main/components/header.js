import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 p-2 rounded-full hover:bg-gray-100"
                    aria-label="Volver">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
            </div>
        </header>
    );
};

export default Header;
