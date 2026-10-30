// Convierte cualquier payload de una fila (incluidos objetos anidados y listas)
// en texto para el buscador global de tablas.
export function searchableText(value) {
    if (value == null) return "";
    if (Array.isArray(value)) return value.map(searchableText).filter(Boolean).join(" ");
    if (typeof value === "object") {
        return Object.values(value).map(searchableText).filter(Boolean).join(" ");
    }
    return String(value);
}
