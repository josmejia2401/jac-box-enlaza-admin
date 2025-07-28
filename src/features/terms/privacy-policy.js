import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-primary mb-6">Política de Privacidad de QuestionAsk</h1>

            <div className="space-y-6 text-text text-sm sm:text-base">
                <div>
                    <h2 className="font-semibold text-primary">1. Datos que recopilamos</h2>
                    <ul className="list-disc ml-5">
                        <li>Direcciones de correo electrónico utilizadas para autenticación.</li>
                        <li>Contenido de los formularios creados por los usuarios.</li>
                        <li>Respuestas recopiladas a través de dichos formularios.</li>
                        <li>Datos técnicos anónimos como dirección IP, navegador y tipo de dispositivo (para mejorar la experiencia del usuario).</li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">2. Uso de la información</h2>
                    <ul className="list-disc ml-5">
                        <li>Los datos se utilizan únicamente para operar y mejorar la plataforma.</li>
                        <li>No compartimos ni vendemos información personal a terceros.</li>
                        <li>Las respuestas a formularios son propiedad del creador y solo él tiene acceso a ellas.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">3. Seguridad</h2>
                    <ul className="list-disc ml-5">
                        <li>Almacenamos los datos en servidores seguros y hacemos todo lo posible por protegerlos.</li>
                        <li>No nos responsabilizamos por pérdida de información (fallos en servidores gratuitos, ataques, etc.).</li>
                        <li>Recomendamos no compartir información confidencial a través de los formularios.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">4. Cookies</h2>
                    <ul className="list-disc ml-5">
                        <li>Usamos cookies únicamente para fines técnicos como el mantenimiento de la sesión de usuario.</li>
                        <li>No realizamos seguimiento de actividad fuera de la plataforma.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">5. Derechos del usuario</h2>
                    <ul className="list-disc ml-5">
                        <li>Puedes solicitar la eliminación de tu cuenta y datos asociados en cualquier momento escribiéndonos al correo:</li>
                        <li>
                            <a
                                href="mailto:soporte.questionask@gmail.com"
                                className="text-primary font-medium underline"
                            >
                                soporte.questionask@gmail.com
                            </a>
                        </li>
                        <li>Respetamos tu privacidad y actuaremos conforme a tu solicitud en el menor tiempo posible.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-primary">6. Cambios en esta política</h2>
                    <ul className="list-disc ml-5">
                        <li>Podemos actualizar esta política ocasionalmente sin previo aviso.</li>
                        <li>Te recomendamos revisarla periódicamente.</li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-sm text-muted italic">
                Última actualización: {new Date().toLocaleDateString()}
            </div>
        </div>
    );
};

export default PrivacyPolicy;