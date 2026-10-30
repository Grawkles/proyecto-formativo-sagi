import { useState } from "react";
import { FileText, TableProperties } from "lucide-react";
import { buildReportDataset, getFieldValue } from "@/shared/reports/buildReportDataset";
import { generateExcelReport } from "@/shared/reports/generateExcelReport";
import { generatePdfReport } from "@/shared/reports/generatePdfReport";
import { apiFetch, getStoredUser, throwApiError } from "@/shared/services/api";
import Button from "./Button";
import Checkbox from "./Checkbox";
import Input from "./Input";
import Modal from "./Modal";
import Select from "./Select";

const FORMAT_OPTIONS = [
    { value: "pdf",   label: "PDF",   Icon: FileText },
    { value: "excel", label: "Excel", Icon: TableProperties },
];

const SCOPE_OPTIONS = [
    { value: "all",    label: "Todos" },
    { value: "filter", label: "Filtrar" },
];

export default function ReportModal({
    isOpen,
    onClose,
    data = [],
    fields = [],
    filters = [],
    reportTitle = "Reporte",
    fileNamePrefix = "reporte",
    exportPermission,
}) {
    const [format, setFormat] = useState("pdf");
    const [selectedFields, setSelectedFields] = useState([]);
    const [scope, setScope] = useState("all");
    const [filterValue, setFilterValue] = useState("");
    const [columnFilters, setColumnFilters] = useState({});
    const [generating, setGenerating] = useState(false);

    // Reinicia el estado al pasar de cerrado a abierto, ajustando el estado
    // durante el render (patrón recomendado por React, sin efecto en cascada).
    const [wasOpen, setWasOpen] = useState(false);
    if (isOpen && !wasOpen) {
        setWasOpen(true);
        setFormat("pdf");
        setSelectedFields(fields.filter((f) => f.default));
        setScope("all");
        setFilterValue("");
        setColumnFilters({});
    } else if (!isOpen && wasOpen) {
        setWasOpen(false);
    }

    // Opciones de cada filtro por columna, derivadas de los datos cargados.
    const filterOptions = (filter) => {
        const values = new Set();
        for (const item of data) {
            const v = getFieldValue(item, filter.field);
            if (v != null && String(v).trim() !== "" && String(v) !== "-") values.add(String(v));
        }
        return [...values].sort((a, b) => a.localeCompare(b, "es")).map((v) => ({ id: v, label: v }));
    };

    const handleToggleField = (field) => {
        const exists = selectedFields.find((f) => f.key === field.key);
        setSelectedFields(
            exists
                ? selectedFields.filter((f) => f.key !== field.key)
                : [...selectedFields, field]
        );
    };

    const handleGenerate = async () => {
        if (selectedFields.length === 0 || generating) return;

        setGenerating(true);
        try {
        if (exportPermission) {
            const authorization = await apiFetch("/api/permissions/permissions/authorize_export/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permission_codename: exportPermission }),
            });
            if (!authorization.ok) await throwApiError(authorization);
        }

        const { headers, rows } = buildReportDataset({
            data,
            fields,
            selectedFields,
            scope,
            filterValue,
            columnFilters: filters
                .filter((f) => columnFilters[f.key])
                .map((f) => ({ field: f.field, value: columnFilters[f.key] })),
        });

        if (rows.length === 0) throw new Error("No hay registros que coincidan con el filtro aplicado.");

        const date = new Date().toISOString().slice(0, 10);
        const generatedAt = new Date();
        const user = getStoredUser();
        const generatedBy = [user?.first_name, user?.last_name]
            .filter(Boolean)
            .join(" ") || user?.email || "Usuario no disponible";
        const ext = format === "excel" ? "xlsx" : "pdf";
        const fileName = `${fileNamePrefix}-${date}.${ext}`;

        if (format === "excel") {
            generateExcelReport({
                headers,
                rows,
                reportTitle,
                generatedBy,
                generatedAt,
                fileName,
            });
        } else {
            await generatePdfReport({
                headers,
                rows,
                reportTitle,
                generatedBy,
                generatedAt,
                fileName,
            });
        }

        onClose();
        } catch (error) {
            alert(error.message || "No se pudo generar el reporte.");
        } finally {
            setGenerating(false);
        }
    };

    const footer = (
        <>
            <Button variant="secondary" onClick={onClose} className="sm:flex-1">
                Cancelar
            </Button>
            <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={selectedFields.length === 0 || generating}
                className="sm:flex-1"
            >
                {generating ? "Validando y generando…" : "Generar reporte"}
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Generar Reporte"
            variant="solid"
            size="lg"
            footer={footer}
        >
            <p className="text-small text-text-secondary -mt-3">{reportTitle}</p>

            {/* Format selector */}
            <div>
                <p className="text-small font-heading text-text-primary mb-3">
                    Formato de exportación
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {FORMAT_OPTIONS.map(({ value, label, Icon }) => (
                        <Button
                            key={value}
                            variant={format === value ? "primary" : "secondary"}
                            icon={Icon}
                            onClick={() => setFormat(value)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Field selection */}
            <div>
                <p className="text-small font-heading text-text-primary mb-3">
                    Campos a incluir{" "}
                    <span className="font-body text-text-secondary">
                        ({selectedFields.length} de {fields.length})
                    </span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4">
                    {fields.map((field) => (
                        <Checkbox
                            key={field.key}
                            id={`report-field-${field.key}`}
                            name={field.key}
                            label={field.label}
                            checked={selectedFields.some((f) => f.key === field.key)}
                            onChange={() => handleToggleField(field)}
                        />
                    ))}
                </div>
            </div>

            {/* Scope filter */}
            <div>
                <p className="text-small font-heading text-text-primary mb-3">Registros</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    {SCOPE_OPTIONS.map(({ value, label }) => (
                        <Button
                            key={value}
                            variant={scope === value ? "primary" : "secondary"}
                            onClick={() => setScope(value)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                {scope === "filter" && (
                    <Input
                        name="reportFilter"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        placeholder="Texto a buscar en los registros…"
                    />
                )}

                {filters.map((filter) => (
                    <Select
                        key={filter.key}
                        label={filter.label}
                        name={`report-filter-${filter.key}`}
                        options={filterOptions(filter)}
                        value={columnFilters[filter.key] ?? ""}
                        onChange={(e) => setColumnFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                    />
                ))}
            </div>
        </Modal>
    );
}
