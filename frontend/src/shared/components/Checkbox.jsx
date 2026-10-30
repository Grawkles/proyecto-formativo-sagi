import FieldHelp from "./FieldHelp";
import FieldRequirement from "./FieldRequirement";

export default function Checkbox({
    id,                         // Identificador unico (Necesario para accesibilidad)
    name,                       // Nombre del campo (Util para formularios)
    label,                      // Texto visible asociado al checkbox
    title,                      // Texto completo para tooltip (util cuando label esta truncado)
    helpText,
    checked = false,            // Estado del checkbox (true o false)
    onChange,                   // Función que maneja el cambio de estado
    disable = false,            // Indica si el checkbox esta habilitado
    className = "",             // Clases adicionales para personalización
    showRequirement = true,
    required
}) {

    return (
        <div
            className={`
                flex
                items-center
                gap-2
                min-w-0
                text-small
                ${disable ? "opacity-50 cursor-not-allowed" : ""}
                ${className}
            `}
        >
            <input
                type="checkbox"
                required={required}
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disable}
                className="w-5 h-5 accent-text-primary shrink-0"
            />
            <label htmlFor={id} title={title} className="flex min-w-0 flex-1 cursor-pointer items-center gap-1">
                <span className="min-w-0 flex-1">{label}</span>
                {showRequirement && (
                    <FieldRequirement required={required} optional={!required && !disable} />
                )}
            </label>
            <FieldHelp
                label={title ?? label}
                helpText={helpText}
                defaultText={`Activa «${title ?? label}» solo si la situación descrita aplica a este registro.`}
            />
        </div>
    )
}
