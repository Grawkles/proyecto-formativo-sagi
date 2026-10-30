const HELP_MESSAGES = {
    "primer nombre": "Escribe tu primer nombre tal como aparece en tu documento de identidad. Ejemplo: María.",
    "primer apellido": "Escribe tu primer apellido tal como aparece en tu documento de identidad. Ejemplo: Pérez.",
    nombres: "Ingresa tus nombres completos tal como aparecen en tu documento. Ejemplo: María Fernanda.",
    apellidos: "Ingresa tus apellidos completos tal como aparecen en tu documento. Ejemplo: Pérez Gómez.",
    "tipo de documento": "Selecciona el documento que usarás para identificarte, por ejemplo, cédula de ciudadanía o tarjeta de identidad.",
    "numero de documento": "Escribe el número de tu documento sin puntos ni espacios. Ejemplo: 1023456789.",
    "direccion de domicilio": "Escribe la dirección donde resides para que puedan contactarte. Ejemplo: Calle 10 # 20-30, Bogotá.",
    direccion: "Indica una dirección donde puedan ubicarte o contactar a la persona. Ejemplo: Calle 10 # 20-30, Bogotá.",
    "correo electronico": "Usa un correo que consultes con frecuencia; allí recibirás avisos y enlaces. Ejemplo: maria@email.com.",
    "confirmar correo electronico": "Vuelve a escribir el mismo correo para comprobar que no tenga errores de digitación.",
    "correo institucional": "Ingresa tu correo institucional del SENA. Ejemplo: usuario@soy.sena.edu.co.",
    "correo del receptor": "Escribe el correo del receptor; se usará para enviarle la invitación y el enlace de firma del préstamo.",
    "telefono adicional": "Agrega otro número de contacto por si no logran comunicarse contigo al teléfono principal.",
    telefono: "Escribe un número donde puedan contactarte. Ejemplo: 3001234567.",
    "foto de perfil": "Sube una imagen JPG o PNG de hasta 2 MB para identificar la cuenta.",
    "tipo de usuario": "Elige el rol de la persona. Este determina qué módulos y acciones tendrá disponibles en SAGI.",
    "instructor de planta": "Activa esta opción si la persona es instructor de planta del SENA; se usa para identificar su tipo de vinculación.",
    cuentadante: "Selecciona a la persona responsable de custodiar este material y responder por su uso.",
    cuentadantes: "Selecciona las personas responsables de custodiar el material. Puedes elegir más de una.",
    estado: "Selecciona el estado actual. Esto permite saber si el registro está activo o si el material puede utilizarse.",
    "fecha de inicio": "Selecciona la fecha desde la que comienza la vigencia o asignación.",
    "fecha inicio": "Selecciona el día en que comienza la asignación de la tarea.",
    "fecha de finalizacion": "Selecciona el último día de vigencia de la cuenta. Ejemplo: 31/12/2026.",
    "fecha fin": "Selecciona la fecha límite para terminar la tarea.",
    "fecha de compra": "Indica cuándo se compró el material; usa la fecha que aparece en la factura o soporte de compra.",
    "fecha de ingreso": "Indica cuándo recibió el almacén el material y lo incorporó al inventario.",
    nombre: "Escribe el nombre con el que identificarás el registro. Ejemplo: Taladro percutor.",
    modelo: "Ingresa la referencia o modelo indicado por el fabricante. Ejemplo: GSB 13 RE.",
    tipo: "Selecciona si el material se devuelve después de usarlo o si se consume durante la actividad.",
    "placa sena": "Ingresa el código de inventario asignado por el SENA. Ejemplo: 123456.",
    "s n": "Escribe el número de serie impreso en el material o en su etiqueta. Si no tiene, deja el campo vacío.",
    "numero de serial": "Escribe el número de serie impreso en el material o en su etiqueta. Si no tiene, deja el campo vacío.",
    serial: "Escribe el número de serie impreso en el material o en su etiqueta. Si no tiene, deja el campo vacío.",
    categoria: "Elige la categoría que mejor describa el material para facilitar su búsqueda y clasificación.",
    marca: "Selecciona la marca indicada en el material. Si no aparece, usa el botón + para registrarla.",
    "nombre de la marca": "Escribe la marca tal como aparece en el producto. Ejemplo: Bosch.",
    "nombre de inventario": "Selecciona el inventario o almacén al que pertenecerá este material. Ejemplo: Almacén principal.",
    "descripcion": "Describe las características que permiten reconocer el material o diferenciarlo de otros. Ejemplo: taladro inalámbrico de 12 V con maletín.",
    ancho: "Registra el ancho indicado en la ficha técnica y conserva la misma unidad usada para largo y profundidad.",
    largo: "Registra el largo indicado en la ficha técnica y conserva la misma unidad usada para ancho y profundidad.",
    profundidad: "Registra la profundidad indicada en la ficha técnica y conserva la misma unidad usada para ancho y largo.",
    cantidad: "Escribe el número de unidades disponibles en el inventario. Usa un número entero, por ejemplo: 12.",
    "cantidad disponible": "Indica cuántas unidades quedan disponibles para prestar o utilizar.",
    "cantidad del prestamo": "Ingresa cuántas unidades necesitas para este préstamo. Ejemplo: 2.",
    "cantidad sobrante": "Registra las unidades consumibles que quedaron sin usar y se devuelven al inventario.",
    "cantidad devuelta": "Indica cuántas unidades devolvió el receptor en esta entrega.",
    ubicacion: "Indica dónde se guarda el material para que otras personas puedan encontrarlo. Ejemplo: Bodega, estante 2.",
    "valor unitario": "Ingresa el costo de una unidad, según la factura o soporte de compra, sin separadores de miles.",
    "valor total": "Este valor se calcula automáticamente multiplicando el valor unitario por la cantidad registrada.",
    "ficha tecnica": "Adjunta el documento del fabricante con especificaciones, instrucciones o características del material.",
    "fichas tecnicas": "Adjunta las fichas técnicas relacionadas con el material para consultar sus especificaciones.",
    "archivo pdf": "Adjunta el PDF de la cotización. Verifica que el archivo sea legible antes de guardarlo.",
    "solo disponibles": "Activa esta opción para mostrar únicamente las cotizaciones que todavía no están asociadas a un material.",
    "nombre del grupo": "Escribe un nombre fácil de reconocer para este grupo. Ejemplo: Instructores de electricidad.",
    "nombre de la categoria": "Escribe un nombre breve que describa los materiales que pertenecerán a esta categoría. Ejemplo: Herramientas eléctricas.",
    "nombre del inventario": "Escribe el nombre del almacén o inventario. Ejemplo: Almacén principal.",
    "titulo de la tarea": "Escribe un título breve que indique qué debe hacer la persona. Ejemplo: Revisar herramientas del ambiente.",
    titulo: "Escribe el título que aparecerá en la biblioteca de cotizaciones. Ejemplo: Cotización de taladro.",
    tarea: "Selecciona la tarea que se asignará a la persona o grupo.",
    "usuario asignado": "Selecciona la persona que debe realizar la tarea.",
    "grupo asignado": "Selecciona el grupo cuyos integrantes deben realizar la tarea.",
    "asignar a": "Elige si la tarea se asignará a una persona específica o a un grupo de usuarios.",
    "exigir evidencias al finalizar archivos o fotos": "Activa esta opción si la persona debe adjuntar fotos o archivos antes de marcar la tarea como terminada.",
    evidencias: "Adjunta fotos o archivos que demuestren el trabajo realizado. Verifica que se puedan abrir y leer.",
    "buscar usuario receptor": "Busca a la persona por nombre, correo o número de documento y selecciónala en la lista.",
    "el receptor esta registrado en el sistema": "Deja marcada esta opción si el receptor ya tiene una cuenta en SAGI. Desmárcala para registrar a una persona externa.",
    "nombre completo del receptor": "Escribe los nombres y apellidos de la persona que recibirá el material, tal como aparecen en su documento.",
    "tipo de prestamo": "Selecciona el motivo o modalidad que corresponde a este préstamo.",
    "numero de grupo o ficha": "Escribe el número de ficha o grupo de formación relacionado con el préstamo. Ejemplo: 2876543.",
    "fecha de salida": "Fecha en que se entrega el material al receptor. Se registra automáticamente al crear el préstamo.",
    "fecha devolucion": "Selecciona la fecha acordada para devolver el material.",
    "justificacion de uso": "Explica para qué actividad necesitas el material y cómo lo utilizarás. Ejemplo: práctica de instalación eléctrica del grupo 2876543.",
    observaciones: "Describe daños, faltantes o novedades que deban quedar registradas al devolver el material.",
    "condicion del material": "Indica el estado físico del material al devolverlo. Si requiere mantenimiento o está inutilizable, actualizaremos su estado en el inventario.",
    "condicion": "Elige el estado físico observado al devolver el material. Esta selección puede cambiar su disponibilidad en el inventario.",
    "motivo de inactivacion": "Explica por qué se desactiva la cuenta. Este motivo quedará registrado para consulta administrativa.",
    "contraseña actual": "Escribe la contraseña que usas actualmente para confirmar tu identidad.",
    "tu contraseña actual": "Escribe tu contraseña vigente para confirmar que eres tú quien realiza este cambio.",
    "contraseña actual temporal": "Ingresa la contraseña temporal que recibiste al crear tu cuenta.",
    "nueva contraseña": "Crea una contraseña que no hayas usado antes y que cumpla los requisitos indicados en pantalla.",
    "confirmar nueva contraseña": "Vuelve a escribir la nueva contraseña exactamente igual para confirmar que la ingresaste correctamente.",
    "codigo de verificacion": "Escribe el código de 6 dígitos que aparece en tu aplicación de autenticación o que recibiste por correo.",
    "codigo de recuperacion": "Ingresa uno de los códigos de recuperación que guardaste al configurar la verificación en dos pasos.",
    "permisos de la solicitud": "Desmarca los permisos que no se otorgarán. Puedes retirar permisos de la solicitud, pero no agregar otros nuevos.",
    "motivo de aprobacion opcional": "Resume el motivo de la aprobación. Es opcional y quedará visible en el historial de la solicitud.",
    "motivo del rechazo": "Explica qué debe corregirse o por qué no se aprueba la solicitud. La persona solicitante verá este motivo.",
    "o codigo de tu app en vez de contraseña": "Escribe el código temporal de 6 dígitos de tu aplicación. Úsalo en lugar de la contraseña.",
    "tu contraseña step up": "Escribe tu contraseña para confirmar esta acción sensible antes de aprobar o rechazar la solicitud.",
};

function normalizeLabel(label) {
    return String(label ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

export default function getFieldHelpMessage(label, fallbackText) {
    const normalized = normalizeLabel(label);
    const exactMatch = HELP_MESSAGES[normalized];
    if (exactMatch) return exactMatch;

    if (/^fecha\b/.test(normalized)) {
        return `Selecciona la fecha de «${normalized.replace(/^fecha\s*/, "") || "este registro"}» usando el calendario.`;
    }
    if (/correo|email/.test(normalized)) {
        return `Escribe un correo electrónico válido en «${label}». Ejemplo: nombre@email.com.`;
    }
    if (/cantidad/.test(normalized)) {
        return `Ingresa el número de unidades para «${label}». Usa un número entero, por ejemplo: 2.`;
    }
    if (/nombre/.test(normalized)) {
        return `Escribe el nombre que identifica «${label}». Usa el mismo nombre que aparece en el documento o material.`;
    }
    if (/codigo|code/.test(normalized)) {
        return `Ingresa el código asociado a «${label}» tal como aparece en el sistema o documento de soporte.`;
    }
    if (/archivo|foto|imagen|evidencia|ficha tecnica/.test(normalized)) {
        return `Adjunta en «${label}» un archivo claro y legible relacionado con este registro.`;
    }
    if (/usuario|responsable|receptor/.test(normalized)) {
        return `Selecciona en «${label}» a la persona relacionada con este registro.`;
    }

    return fallbackText || `Completa «${label}» con el dato que se solicita y revisa que sea correcto antes de guardar.`;
}
