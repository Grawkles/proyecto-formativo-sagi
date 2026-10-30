import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import bgLogin from "@/assets/images/auth/bg-login.png";
import senaLogoVerde from "@/assets/images/sena/logo-sena-verde.svg";
import senaLogoBlanco from "@/assets/images/sena/logo-sena-blanco.svg";

// Estructura visual para las vistas de autenticacion (sin navegacion principal).
// Centraliza el fondo, la tarjeta glassmorphism, el logo SENA y la ilustracion;
// el formulario concreto (login, recuperar contraseña, etc.) llega como children.
export default function AuthLayout({ children }) {
    // Modo compacto: los pasos altos del MFA (QR, códigos) ocultan el
    // encabezado SAGI para no desbordar la tarjeta; LoginForm lo pide
    // con el evento "sagi:auth-compact" y se restaura al salir del paso.
    // Modo ancho: solo códigos de respaldo; ensancha la tarjeta para que
    // el contenido respire sin tocar los bordes.
    const [compact, setCompact] = useState(false);
    const [wide, setWide] = useState(false);

    useEffect(() => {
        const sync = (event) => {
            setCompact(Boolean(event.detail?.compact));
            setWide(Boolean(event.detail?.wide));
        };
        window.addEventListener("sagi:auth-compact", sync);
        return () => window.removeEventListener("sagi:auth-compact", sync);
    }, []);
    return (
        <div className="relative flex min-h-svh w-full items-center justify-center overflow-x-hidden overflow-y-auto p-3 sm:p-4">

            {/* Fondo */}
            <img
                src={bgLogin}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition dark:brightness-[0.38] dark:saturate-[0.8]"
            />

            {/* Tarjeta glassmorphism — contiene TODO. Altura flexible: se
                estira junto con el contenido (ej. mensajes de error largos)
                sin recortarlo; con mínimo para presencia y tope al viewport.
                En oscuro el fondo se atenúa (ver img) y la tarjeta se vuelve
                más sólida para mantener contraste AA. */}
            <div className={`
                relative z-10
                ${wide ? "w-[min(36rem,100%)]" : "w-[min(28rem,100%)]"} h-auto min-h-[min(35rem,calc(100svh-1.5rem))] sm:min-h-[min(35rem,calc(100svh-2rem))]
                rounded-[var(--radius-3xl)]
                flex flex-col
                backdrop-blur-md
                bg-surface-hover/55 dark:bg-surface-hover/85
                border border-surface-hover/40 dark:border-border
                shadow-[var(--shadow-elevation-5)]
                overflow-visible
            `}>
                    {/* En los pasos compactos del MFA, el formulario ocupa esta
                        esquina; ocultar el logo evita que se superponga al panel. */}
                    {!compact && (
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-none">
                            <img
                                src={senaLogoVerde}
                                alt="Logo SENA"
                                className="h-12 sm:h-16 w-auto object-contain dark:hidden"
                            />
                            <img
                                src={senaLogoBlanco}
                                alt=""
                                aria-hidden="true"
                                className="h-12 sm:h-16 w-auto object-contain hidden dark:block"
                            />
                        </div>
                    )}

                {/* ── Formulario centrado; el layout puede crecer en viewports bajos ── */}
                <div className="relative grid w-full flex-1 items-center justify-center px-3 py-4 sm:p-6">
                    <div className={`m-auto w-full min-w-0 px-2 py-3 sm:px-8 sm:py-10 ${wide ? "max-w-2xl" : "max-w-md"}`}>
                        {!compact && (
                        <div className="text-center mb-4 sm:mb-8">
                            <h1 className="text-h1 font-heading font-bold text-text-primary select-none pb-2 sm:pb-4">
                                SAGI
                            </h1>
                            <p className="mt-2 text-medium text-text-secondary select-none">
                                Sistema Administrativo de Gestión de Inventarios — SENA
                            </p>
                        </div>
                        )}
                        {children ?? <Outlet />}
                    </div>
                </div>
            </div>
        </div>
    );
}
