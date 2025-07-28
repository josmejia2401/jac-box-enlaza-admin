import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-primary mb-6">Términos y Condiciones de QuestionAsk</h1>

            <div className="space-y-6 text-text">
                <div>
                    <h2 className="font-semibold text-primary">1. Naturaleza del Servicio</h2>
                    <ul className="list-disc ml-5">
                        <li>QuestionAsk es una plataforma gratuita para la creación y publicación de formularios.</li>
                        <li>Está alojada en infraestructura gratuita (Netlify y Render.com), por lo cual puede experimentar intermitencias, caídas o tiempos de respuesta variables.</li>
                        <li>No se garantiza disponibilidad, continuidad ni rendimiento del servicio.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">2. Uso del Servicio</h2>
                    <ul className="list-disc ml-5">
                        <li>El uso es totalmente gratuito y no implica relación contractual.</li>
                        <li>
                            <strong className="text-error">
                                Se prohíbe expresamente el uso para publicar, almacenar o distribuir contenido ilegal, difamatorio, violento, ofensivo, discriminatorio, sexual, engañoso o que infrinja derechos de terceros.
                            </strong>
                        </li>
                        <li>
                            <strong>El usuario es el único y total responsable por el contenido que crea, publica o comparte a través de la plataforma.</strong>
                        </li>
                        <li>
                            QuestionAsk no ejerce control editorial sobre los formularios creados, por lo que no se hace responsable de su contenido ni de las consecuencias derivadas de su uso.
                        </li>
                        <li>
                            Toda consecuencia legal derivada del contenido publicado recae exclusivamente sobre el usuario creador.
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">3. Donaciones</h2>
                    <ul className="list-disc ml-5">
                        <li>El servicio es gratuito y se sostiene gracias a donaciones voluntarias de los usuarios.</li>
                        <li>No existe obligación ni contraprestación alguna por donar.</li>
                        <li>
                            Las donaciones ayudan a mejorar el servicio, garantizar su continuidad, incorporar nuevas funcionalidades, ampliar la infraestructura y ofrecer una mejor experiencia a todos los usuarios.
                        </li>
                        <li>
                            Cada aporte, por pequeño que sea, marca una gran diferencia para la evolución del proyecto.
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">4. Límite de Responsabilidad</h2>
                    <ul className="list-disc ml-5">
                        <li>No garantizamos la permanencia ni la seguridad de los datos.</li>
                        <li>QuestionAsk no será responsable por la pérdida de información, fallas técnicas o mal funcionamiento.</li>
                        <li>No existe respaldo ni obligación de restaurar datos perdidos.</li>
                        <li>
                            QuestionAsk declina cualquier tipo de responsabilidad legal por el uso indebido de la plataforma, incluyendo pero no limitado a: difusión de información falsa, uso fraudulento, violación de derechos de autor, calumnia, difamación u otros actos ilegales.
                        </li>
                        <li>
                            El usuario asume toda responsabilidad legal frente a terceros o autoridades por el contenido publicado en la plataforma.
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">5. Cambios en los Términos</h2>
                    <ul className="list-disc ml-5">
                        <li>Estos términos pueden ser modificados sin previo aviso.</li>
                        <li>El uso continuo del servicio implica la aceptación de los cambios.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">6. Contacto y Soporte</h2>
                    <ul className="list-disc ml-5">
                        <li>
                            Para reportar errores, solicitar soporte técnico o enviar sugerencias, puedes escribirnos al correo electrónico:
                            <a
                                href="mailto:soporte.questionask@gmail.com"
                                className="text-primary font-medium ml-1 underline"
                            >
                                soporte.questionask@gmail.com
                            </a>.
                        </li>
                        <li>
                            También puedes contactarnos para realizar donaciones o expresar tu interés en contribuir con el desarrollo de QuestionAsk.
                        </li>
                        <li>
                            Intentaremos responder en el menor tiempo posible, aunque no se garantiza soporte inmediato.
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-sm text-muted italic">
                Última actualización: {new Date().toLocaleDateString()}
            </div>
        </div>
    );
};

export default TermsAndConditions;