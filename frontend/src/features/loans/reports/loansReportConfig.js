export const loansReportConfig = {
    reportTitle: "Reporte de Préstamos",
    fileNamePrefix: "reporte-prestamos",
    exportPermission: "export_loans",
    fields: [
        { key: "batch_id",                    label: "Lote",                  default: false },
        { key: "loan_count",                  label: "Préstamos del lote",    default: true  },
        { key: "usuario_responsable",         label: "Usuario Responsable",   default: true  },
        { key: "usuario_receptor", label: "Usuario Receptor", default: true },
        { key: "apprentice_group",            label: "Grupo de aprendices", default: true  },
        { key: "loan_date",       label: "Fecha de salida",      default: true  },
        { key: "return_date",     label: "Fecha de devolución",  default: true  },
        { key: "state",           label: "Estado",                default: true  },
    ],
};
