export type DateArray = [number, number, number];
export interface IInstanceDate {
    getAbbrDays(): string[];
    getDaysNames(): string[];
    getMonthNames(): string[];
    getMonthShortNames(): string[];
    daysInMonth(): number;
}

export class MbDate {
    /// Variables
    public gDate: Date | null = null;
    protected date: DateArray = [0, 0, 0];
    protected monthZeroBase = 0;

    constructor(private SelfClass) {}

    /**
     * Returns a formatted output of current date.
     *
     * @example
     * new MBDate(new Date).format('ddd DD MMMM YYY) => Friday 05 october 1990
     *
     * YYY or YYYY   |   Four digits year                  |   1990
     * YY            |   Two digits Year                   |   90
     * MMMM          |   Month long name                   |   October
     * MMM           |   Month short name                  |   Oct
     * MM            |   Month in number leading by zero   |   07
     * M             |   Month in number                   |   7
     * DD            |   Day in number leading by zero     |   05
     * D             |   Day in number                     |   5
     * ddd or dddd   |   Full day name                     |   Friday
     * d or dd       |   Abbreviation of day name          |   Fri
     * HH            |   24 hours leading by zero          |   03, 13, 24
     * H             |   24 hours                          |   3, 13, 24
     * hh            |   12 hours leading by zero          |   03, 01, 00
     * h             |   12 hours                          |   3, 1, 0
     * ss            |   Second leading by zero            |   05, 10
     * s             |   Second                            |   5, 10
     * mm            |   Minute leading by zero            |   05, 10
     * m             |   Minute                            |   5, 10
     * p             |   Time period                       |   AM, PM
     *
     * @param format {String}
     * @returns {string}
     */
    format(format: string): string {
        format = this.replaceYear(format, this);
        format = this.replaceMonth(format, this);
        format = this.replaceDay(format, this);

        format = this.replaceHours(format, this);
        format = this.replaceMinutes(format, this);
        format = this.replaceSeconds(format, this);
        format = this.replaceTimePeriod(format, this);
        return format;
    }

    /**
     * Returns the array of short name of days. This is overrides by instanced classes.
     *
     * @return {String[]} Days short names
     */
    getAbbrDays(): string[] {
        return [];
    }

    /**
     * Returns the array of long name of days. This is overrides by instanced classes.
     *
     * @return {String[]} Days long names
     */
    getDaysNames(): string[] {
        return [];
    }

    /**
     * Returns the array of long name of month. This is overrides by instanced classes.
     *
     * @return {String[]} Month long names
     */
    getMonthNames(): string[] {
        return [];
    }

    /**
     * Returns the array of short name of month. This is overrides by instanced classes.
     *
     * @return {String[]} Month short names
     */
    getMonthShortNames(): string[] {
        return [];
    }

    /**
     * Returns the first day of month's number. (e.g. 0 for sunday or 1 for monday)
     *
     * @param {number} year
     * @param {number} month
     * @returns {number}
     */
    firstDay(year = this.date[0], month = this.date[1]): number {
        return new this.SelfClass(year, month, 1).getDay();
    }
    private leadingZero(value) {
        return value.toString().padStart(2, "0");
    }
    private replaceYear(str, date) {
        const match = str.match(/[yY]+/);

        // If is not match returns itself
        if (!match) {
            return str;
        }

        let year;

        switch (match[0]) {
            case "YYYY":
            case "YYY":
                year = date.getFullYear();
                break;

            case "YY":
                year = String(date.getFullYear()).slice(2);
                break;
        }

        return this.replaceYear(str.replace(match, year), date);
    }
    private replaceDay(str, date) {
        if (this.isMonthName(str)) {
            return str;
        }

        const match = str.match(/\b[Dd]+\b/);

        // If is not match returns itself
        if (!match) {
            return str;
        }

        let day;

        switch (match[0]) {
            case "D":
                day = date.getDate();
                break;

            case "DD":
                day = this.leadingByZero(date.getDate());
                break;

            case "d":
            case "dd":
                day = this.getAbbrDays()[date.getDay()];
                break;

            case "ddd":
            case "dddd":
                day = this.getDaysNames()[date.getDay()];
                break;
        }

        return this.replaceDay(str.replace(match[0], day), date);
    }
    private replaceMonth(str, date) {
        if (this.isMonthName(str)) {
            return str;
        }

        const match = str.match(/\b[M]+\b/);

        // If is not match returns itself
        if (!match) {
            return str;
        }

        let month;

        switch (match[0]) {
            case "M":
                month = date.getMonth() + 1 - this.monthZeroBase;
                break;

            case "MM":
                month = this.leadingByZero(date.getMonth() + 1 - this.monthZeroBase);
                break;

            case 'MMM':
                month = this.getMonthShortNames()[date.getMonth() - this.monthZeroBase];
                break;

            case "MMMM":
                month = this.getMonthNames()[date.getMonth() - this.monthZeroBase];
                break;
        }

        return this.replaceMonth(str.replace(match[0], month), date);
    }

    private leadingByZero(value): string {
        return value.toString().padStart(2, '0');
    }

    /**
     * Matches the passed string with "h and H" and replaced them with passed date
     *
     * HH   |   24 hours leading by zero   |   03, 13, 24
     * H    |   24 hours                   |   3, 13, 24
     * hh   |   12 hours leading by zero   |   03, 01, 00
     * h    |   12 hours                   |   3, 1, 0
     *
     * @param {string} str
     * @param date
     * @returns {string}
     */
    private replaceHours(str: string, date): string {
        if (this.isMonthName(str)) {
            return str;
        }

        const match = str.match(/\b[Hh]+\b/);

        // If is not match returns itself
        if (!match) {
            return str;
        }

        const H = date.getHours(),
            h = H >= 12 ? H - 12 : H;

        let hours;

        switch (match[0]) {
            case "h":
                hours = h;
                break;

            case "hh":
                hours = this.leadingZero(h);
                if (hours === '00') {
                    hours = '12';
                }
                break;

            case "H":
                hours = H;
                break;

            case "HH":
                hours = this.leadingZero(H);
                break;
        }

        return this.replaceHours(str.replace(match[0], hours), date);
    }

    /**
     * Matches the passed string with "s" and replaced them with passed date
     *
     * ss   |   Second leading by zero   |   05, 10
     * s    |   Second                   |   5, 10
     *
     * @param {string} str
     * @param date
     * @returns {string}
     */
    private replaceSeconds(str: string, date): string {
        if (this.isMonthName(str)) {
            return str;
        }

        const match = str.match(/(s(?!day))+([s]*)/);

        // If is not match returns itself
        if (!match) {
            return str;
        }

        const s = date.getSeconds();
        let seconds;

        switch (match[0]) {
            case "s":
                seconds = s;
                break;

            case "ss":
                seconds = this.leadingZero(s);
                break;
        }

        return this.replaceSeconds(str.replace(match[0], seconds), date);
    }

    private replaceTimePeriod(str: string, date): string {
        const match = str.match(/p/);

        // If is not match returns itself
        if (!match) {
            return str;
        }

        const h = date.getHours();
        const period = h >= 12 ? 'PM' : 'AM';
        return str.replace(match[0], period);
    }

    /**
     * Matches the passed string with "m" and replaced them with passed date
     *
     * mm   |   Minute leading by zero   |   05, 10
     * m    |   Minute                   |   5, 10
     *
     * @param {string} str
     * @param date
     * @returns {string}
     */
    private replaceMinutes(str: string, date): string {
        if (this.isMonthName(str)) {
            return str;
        }

        const match = str.match(/[m]+/);

        // If is not match returns itself
        if (!match) {
            return str;
        }

        const m = date.getMinutes();
        let minutes;

        switch (match[0]) {
            case "m":
                minutes = m;
                break;

            case "mm":
                minutes = this.leadingZero(m);
                break;
        }

        return this.replaceMinutes(str.replace(match[0], minutes), date);
    };

    /**
     * This method checks if the given value the month name.
     *
     * @param {string} val
     * @returns {string}
     */
    private isMonthName(val: string): string {
        return (this.getMonthNames() as any).find(item => val == item)
    }
}
