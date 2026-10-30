import { useId } from "react";
import { CircleHelp } from "lucide-react";

export default function FieldHelp({ label, helpText, defaultText }) {
    const tooltipId = useId();
    const helpLabel = typeof label === "string" || typeof label === "number"
        ? label
        : "esta opción";

    return (
        <span className="group relative inline-flex shrink-0 items-center">
            <button
                type="button"
                aria-label={`Ayuda sobre ${helpLabel}`}
                aria-describedby={tooltipId}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-text-muted transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
                <CircleHelp size={15} aria-hidden="true" />
            </button>
            <span
                id={tooltipId}
                role="tooltip"
                className="invisible absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-[var(--radius-md)] bg-background-inverse px-3 py-2 text-left text-small font-normal leading-relaxed text-text-inverse opacity-0 shadow-elevation-2 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
            >
                <span className="mb-0.5 block font-semibold">{helpLabel}</span>
                {helpText || defaultText}
            </span>
        </span>
    );
}
