export class TimeZoneService {
    public static getRelativeTime(date: Date, language: string) {
        const rtf = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const seconds = diff >= 0 ? Math.floor(diff / 1000) : Math.ceil(diff / 1000);
        const minutes = diff >= 0 ? Math.floor(seconds / 60) : Math.ceil(seconds / 60);
        const hours = diff >= 0 ? Math.floor(minutes / 60) : Math.ceil(minutes / 60);
        const days = diff >= 0 ? Math.floor(hours / 24) : Math.ceil(hours / 24);
        const weeks = diff >= 0 ? Math.floor(days / 7) : Math.ceil(days / 7);
        const months = diff >= 0 ? Math.floor(days / 30) : Math.ceil(days / 30);
        const years = diff >= 0 ? Math.floor(days / 365) : Math.ceil(days / 365);

        if (Math.abs(years) > 0) {
            return rtf.format(years, "year");
        }
        if (Math.abs(months) > 0) {
            return rtf.format(months, "month");
        }
        if (Math.abs(weeks) > 0) {
            return rtf.format(weeks, "week");
        }
        if (Math.abs(days) > 0) {
            return rtf.format(days, "day");
        }
        if (Math.abs(hours) > 0) {
            return rtf.format(hours, "hour");
        }
        if (Math.abs(minutes) > 0) {
            return rtf.format(minutes, "minute");
        }
        if (Math.abs(seconds) > 0) {
            return rtf.format(seconds, "second");
        }
        return rtf.format(0, "second");
    }
}