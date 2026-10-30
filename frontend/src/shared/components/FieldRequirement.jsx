export default function FieldRequirement({ required = false, optional = false }) {
    if (required) {
        return (
            <span aria-label="Obligatorio" className="ml-1 font-semibold text-error">
                *
            </span>
        );
    }

    if (!optional) return null;

    return (
        <span className="ml-1 whitespace-nowrap text-small font-normal text-text-muted">
            (Opcional)
        </span>
    );
}
