import * as React from 'react';
import "./styles.css";
import {
    ShieldCheckIcon,
    ArrowPathRoundedSquareIcon,
    LinkIcon,
    ChartBarIcon,
    FingerPrintIcon,
} from '@heroicons/react/24/outline';

import LocalStorageWatcher from '../../store/localStorageWatcher';
import { AuthStore } from '../../store/index';

// Slides renovados y con textos embellecidos para Enlaza
const iconSlides = [
    {
        icon: LinkIcon,
        caption: "Acorta enlaces extensos en URLs sencillas y listas para compartir. Haz tus links inolvidables.",
    },
    {
        icon: ArrowPathRoundedSquareIcon,
        caption: "Administra y personaliza tus enlaces en cualquier momento. Tú tienes el control total.",
    },
    {
        icon: ChartBarIcon,
        caption: "Descubre el impacto de tus enlaces: visualiza clics, ubicaciones y dispositivos con estadísticas en tiempo real.",
    },
    {
        icon: FingerPrintIcon,
        caption: "Genera URLs únicas y seguras al instante. Cada enlace es irrepetible y solo tuyo.",
    },
    {
        icon: ShieldCheckIcon,
        caption: "Tu seguridad es primero: Enlaza protege la privacidad y la integridad de cada acceso.",
    }
];

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentSlide: 0 };
        this.detectChangesStorage = this.detectChangesStorage.bind(this);
        this.goToHome = this.goToHome.bind(this);
    }

    componentDidMount() {
        this.localStorageWatcher = new LocalStorageWatcher(this.detectChangesStorage);
        this.goToHome();
    }

    componentWillUnmount() {
        this.localStorageWatcher.stopPolling();
    }

    goToHome() {
        if (AuthStore.getState().isAuthenticated) {
            window.location.replace('/dashboard');
        }
    }

    detectChangesStorage(event) {
        this.goToHome();
    }

    handlePrev = () => {
        this.setState({
            currentSlide: (this.state.currentSlide === 0 ? iconSlides.length - 1 : this.state.currentSlide - 1)
        });
    };

    handleNext = () => {
        this.setState({
            currentSlide: (this.state.currentSlide === iconSlides.length - 1 ? 0 : this.state.currentSlide + 1)
        });
    };

    setCurrentSlide(index) {
        this.setState({ currentSlide: index });
    }

    render() {
        const { children } = this.props;
        const { currentSlide } = this.state;
        const CurrentIcon = iconSlides[currentSlide].icon;

        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="relative flex max-w-5xl w-full rounded-2xl shadow-md overflow-hidden bg-surface">
                    {/* Izquierda: íconos e info */}
                    <div className="hidden sm:flex w-1/2 bg-surface text-text flex-col items-center justify-center p-8 relative">

                        <h2 className="text-2xl font-bold mb-4 text-center text-text tracking-tight drop-shadow">
                            Enlaza — Acorta, comparte y analiza tus enlaces
                        </h2>

                        <div className="w-full h-96 rounded-xl overflow-hidden border border-muted shadow-sm flex items-center justify-center bg-background">
                            <CurrentIcon className="w-32 h-32 text-primary drop-shadow" />
                        </div>

                        <p className="mt-6 text-center text-muted italic text-lg">
                            {iconSlides[currentSlide].caption}
                        </p>

                        <div className="flex space-x-2 mt-7">
                            {iconSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => this.setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${currentSlide === index
                                        ? "bg-primary"
                                        : "bg-muted hover:bg-primary"
                                        }`}
                                    aria-label={`Slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>

                        <div className="absolute inset-y-0 left-4 flex items-center gap-2">
                            <button
                                onClick={this.handlePrev}
                                className="bg-background hover:bg-primary text-text hover:text-background rounded-full p-2 transition"
                                aria-label="Anterior"
                            >
                                ‹
                            </button>
                            <button
                                onClick={this.handleNext}
                                className="bg-background hover:bg-primary text-text hover:text-background rounded-full p-2 transition"
                                aria-label="Siguiente"
                            >
                                ›
                            </button>
                        </div>
                    </div>

                    {/* Derecha: formulario */}
                    <div className="w-full sm:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-surface">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Layout;