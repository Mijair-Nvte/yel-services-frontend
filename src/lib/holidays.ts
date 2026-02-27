// src/lib/holidays.ts

export function getHolidays(year: number) {
    // Función helper para crear el formato exacto de tu DB
const createHoliday = (month: string, day: string, title: string, color: string) => ({
        id: `holiday-${title}-${year}`,
        uid: `holiday-${title}-${year}`,
        title: title,
        description: "Día feriado oficial",
        color: color, 
        is_all_day: false, // 🔥 Bien hecho, lo pasamos a falso
        // 🔥 Asignamos una hora específica (Ej: de 8:00 AM a 9:00 AM local)
        starts_at: `${year}-${month}-${day}T08:00:00`, 
        ends_at: `${year}-${month}-${day}T09:00:00`,   
        is_holiday: true, 
    });

    return [
        // 🇪🇨 ECUADOR (Amarillo/Azul/Rojo -> Usaremos 'yellow' para EC)
        createHoliday("01", "01", "🇪🇨 Año nuevo", "yellow"),
        createHoliday("02", "16", "🇪🇨 Carnaval", "yellow"),
        createHoliday("02", "17", "🇪🇨 Carnaval", "yellow"),
        createHoliday("04", "03", "🇪🇨 Viernes Santo", "yellow"),
        createHoliday("05", "01", "🇪🇨 Día de trabajo", "yellow"),
        createHoliday("05", "24", "🇪🇨 Batalla de Pichincha", "yellow"),
        createHoliday("08", "10", "🇪🇨 Grito de la Independencia", "yellow"),
        createHoliday("10", "09", "🇪🇨 Independencia de Guayaquil", "yellow"),
        createHoliday("11", "02", "🇪🇨 Día de los difuntos", "yellow"),
        createHoliday("11", "03", "🇪🇨 Día de los difuntos", "yellow"),
        createHoliday("11", "04", "🇪🇨 Independencia de Cuenca", "yellow"),
        createHoliday("12", "25", "🇪🇨 Navidad", "yellow"),

        // 🇺🇸 USA (Usaremos 'blue' para USA)
        createHoliday("01", "01", "🇺🇸 Año Nuevo", "blue"),
        createHoliday("01", "19", "🇺🇸 Martin Luther King Day", "blue"),
        createHoliday("02", "16", "🇺🇸 President Day", "blue"),
        createHoliday("05", "25", "🇺🇸 Memorial Day", "blue"),
        createHoliday("07", "04", "🇺🇸 Independence Day", "blue"),
        createHoliday("09", "07", "🇺🇸 Labor Day", "blue"),
        createHoliday("11", "11", "🇺🇸 Veterans Day", "blue"),
        createHoliday("11", "26", "🇺🇸 Thanksgiving", "blue"),
        createHoliday("12", "25", "🇺🇸 Navidad", "blue"),

        // 🇲🇽 MÉXICO (Usaremos 'green' para México)
        createHoliday("01", "01", "🇲🇽 Año Nuevo", "green"),
        createHoliday("02", "02", "🇲🇽 Día de la Candelaria", "green"),
        createHoliday("03", "16", "🇲🇽 Natalicio de Benito Juárez", "green"),
        createHoliday("04", "03", "🇲🇽 Viernes Santo", "green"),
        createHoliday("05", "01", "🇲🇽 Día del Trabajo", "green"),
        createHoliday("05", "05", "🇲🇽 Batalla de Puebla", "green"),
        createHoliday("09", "16", "🇲🇽 Día de la Independencia", "green"),
        createHoliday("11", "16", "🇲🇽 Día de la Revolución", "green"),
        createHoliday("12", "12", "🇲🇽 Día de la Virgen de Gpe", "green"),
        createHoliday("12", "25", "🇲🇽 Navidad", "green"),
    ];
}