// src/lib/calendar-colors.ts

export type CalendarColorKey = "blue" | "red" | "green" | "yellow" | "purple" | "orange" | "pink";

export const EVENT_COLORS: Record<CalendarColorKey, {
    allDay: string;
    timedBg: string;
    timedBorder: string;
    timedTextTitle: string;
    timedTextTime: string;
    indicator: string;
    picker: string;
}> = {
    blue: {
        allDay: "bg-blue-500 text-white hover:bg-blue-600",
        timedBg: "bg-blue-100/90 border-blue-300 hover:shadow-blue-500/20",
        timedBorder: "bg-blue-600",
        timedTextTitle: "text-blue-900",
        timedTextTime: "text-blue-800/80",
        indicator: "bg-blue-500",
        picker: "bg-blue-500 ring-blue-500",
    },
    red: {
        allDay: "bg-red-500 text-white hover:bg-red-600",
        timedBg: "bg-red-100/90 border-red-300 hover:shadow-red-500/20",
        timedBorder: "bg-red-600",
        timedTextTitle: "text-red-900",
        timedTextTime: "text-red-800/80",
        indicator: "bg-red-500",
        picker: "bg-red-500 ring-red-500",
    },
    green: {
        allDay: "bg-emerald-500 text-white hover:bg-emerald-600",
        timedBg: "bg-emerald-100/90 border-emerald-300 hover:shadow-emerald-500/20",
        timedBorder: "bg-emerald-600",
        timedTextTitle: "text-emerald-900",
        timedTextTime: "text-emerald-800/80",
        indicator: "bg-emerald-500",
        picker: "bg-emerald-500 ring-emerald-500",
    },
    yellow: {
        allDay: "bg-amber-500 text-white hover:bg-amber-600",
        timedBg: "bg-amber-100/90 border-amber-300 hover:shadow-amber-500/20",
        timedBorder: "bg-amber-600",
        timedTextTitle: "text-amber-900",
        timedTextTime: "text-amber-800/80",
        indicator: "bg-amber-500",
        picker: "bg-amber-500 ring-amber-500",
    },
    purple: {
        allDay: "bg-purple-500 text-white hover:bg-purple-600",
        timedBg: "bg-purple-100/90 border-purple-300 hover:shadow-purple-500/20",
        timedBorder: "bg-purple-600",
        timedTextTitle: "text-purple-900",
        timedTextTime: "text-purple-800/80",
        indicator: "bg-purple-500",
        picker: "bg-purple-500 ring-purple-500",
    },
    orange: {
        allDay: "bg-orange-500 text-white hover:bg-orange-600",
        timedBg: "bg-orange-100/90 border-orange-300 hover:shadow-orange-500/20",
        timedBorder: "bg-orange-600",
        timedTextTitle: "text-orange-900",
        timedTextTime: "text-orange-800/80",
        indicator: "bg-orange-500",
        picker: "bg-orange-500 ring-orange-500",
    },
    pink: {
        allDay: "bg-pink-500 text-white hover:bg-pink-600",
        timedBg: "bg-pink-100/90 border-pink-300 hover:shadow-pink-500/20",
        timedBorder: "bg-pink-600",
        timedTextTitle: "text-pink-900",
        timedTextTime: "text-pink-800/80",
        indicator: "bg-pink-500",
        picker: "bg-pink-500 ring-pink-500",
    }
};

export const DEFAULT_EVENT_COLOR: CalendarColorKey = "blue";