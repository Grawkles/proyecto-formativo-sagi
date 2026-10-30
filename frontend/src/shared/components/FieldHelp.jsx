import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CircleHelp } from "lucide-react";
import getFieldHelpMessage from "./fieldHelpMessages";

const TOOLTIP_GAP = 10;
const VIEWPORT_PADDING = 12;

export default function FieldHelp({ label, helpText, defaultText }) {
    const tooltipId = useId();
    const buttonRef = useRef(null);
    const tooltipRef = useRef(null);
    const closeTimerRef = useRef(null);
    const isHoveredRef = useRef(false);
    const isFocusedRef = useRef(false);
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState(null);
    const helpLabel = typeof label === "string" || typeof label === "number"
        ? label
        : "esta opción";
    const message = helpText || getFieldHelpMessage(helpLabel, defaultText);

    const clearCloseTimer = () => {
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };

    const showTooltip = () => {
        clearCloseTimer();
        setIsOpen(true);
    };

    const closeWhenIdle = () => {
        clearCloseTimer();
        closeTimerRef.current = window.setTimeout(() => {
            if (!isHoveredRef.current && !isFocusedRef.current) {
                setIsOpen(false);
            }
        }, 120);
    };

    const updatePosition = useCallback(() => {
        if (!buttonRef.current || !tooltipRef.current) return;

        const anchor = buttonRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current.getBoundingClientRect();
        const maxLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - tooltip.width - VIEWPORT_PADDING);
        const left = Math.min(
            maxLeft,
            Math.max(VIEWPORT_PADDING, anchor.left + anchor.width / 2 - tooltip.width / 2),
        );
        const fitsAbove = anchor.top >= tooltip.height + TOOLTIP_GAP + VIEWPORT_PADDING;
        const preferredTop = fitsAbove
            ? anchor.top - tooltip.height - TOOLTIP_GAP
            : anchor.bottom + TOOLTIP_GAP;
        const top = Math.min(
            Math.max(VIEWPORT_PADDING, preferredTop),
            Math.max(VIEWPORT_PADDING, window.innerHeight - tooltip.height - VIEWPORT_PADDING),
        );

        setPosition((current) => (
            current?.top === top && current?.left === left ? current : { top, left }
        ));
    }, []);

    useLayoutEffect(() => {
        if (isOpen) updatePosition();
    }, [isOpen, updatePosition, message]);

    useEffect(() => {
        if (!isOpen) return undefined;

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen, updatePosition]);

    useEffect(() => () => clearCloseTimer(), []);

    const tooltip = isOpen && typeof document !== "undefined"
        ? createPortal(
            <span
                ref={tooltipRef}
                id={tooltipId}
                role="tooltip"
                onMouseEnter={() => {
                    isHoveredRef.current = true;
                    clearCloseTimer();
                }}
                onMouseLeave={() => {
                    isHoveredRef.current = false;
                    closeWhenIdle();
                }}
                style={{
                    top: position?.top ?? 0,
                    left: position?.left ?? 0,
                    visibility: position ? "visible" : "hidden",
                }}
                className="fixed z-[2147483647] w-72 max-w-[calc(100vw-1.5rem)] rounded-[var(--radius-md)] border border-border bg-surface px-3.5 py-2.5 text-left text-small font-normal leading-relaxed text-text-primary shadow-[var(--shadow-elevation-4)]"
            >
                <span className="mb-0.5 block font-semibold text-text-primary">{helpLabel}</span>
                {message}
            </span>,
            document.body,
        )
        : null;

    return (
        <>
            <span
                className="inline-flex shrink-0 items-center"
                onMouseEnter={() => {
                    isHoveredRef.current = true;
                    showTooltip();
                }}
                onMouseLeave={() => {
                    isHoveredRef.current = false;
                    closeWhenIdle();
                }}
            >
                <button
                    ref={buttonRef}
                    type="button"
                    aria-label={`Ayuda sobre ${helpLabel}`}
                    aria-describedby={isOpen ? tooltipId : undefined}
                    onClick={showTooltip}
                    onFocus={() => {
                        isFocusedRef.current = true;
                        showTooltip();
                    }}
                    onBlur={() => {
                        isFocusedRef.current = false;
                        closeWhenIdle();
                    }}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-text-muted transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                    <CircleHelp size={15} aria-hidden="true" />
                </button>
            </span>
            {tooltip}
        </>
    );
}
