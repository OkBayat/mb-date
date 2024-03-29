import {IInstanceDate, MbDate} from './abstract';

export class GDate extends MbDate implements IInstanceDate {
    /// Functions
    constructor(date: any = null, month: number | null = null, day: number | null = null) {
        super(GDate);

        if (month != null && day != null) {
            this.gDate = new Date(date, month, day);
        } else if (typeof date === "string") {
            date = date.substr(0, 10);
            const seperator = date.substr(4, 1);
            const arr = date.split(seperator);

            this.gDate = new Date(+arr[0], +arr[1]-1, +arr[2]);
        } else if (typeof date === "number") {
            this.gDate = new Date(date);
        } else {
            // date = date.getTime ? date : null;
            this.gDate = date || new Date();
        }

        this.setgDate();
    }

    /**
     * Returns the array of short name of days.
     *
     * @return {String[]} Days short names
     */
    getAbbrDays() {
        return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    }

    /**
     * Returns the array of long name of days.
     *
     * @return {String[]} Days long names
     */
    getDaysNames() {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    }

    /**
     * Returns the array of long name of month.
     *
     * @return {String[]} Month long names
     */
    getMonthNames() {
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }

    /**
     * Returns the array of short name of month.
     *
     * @return {String[]} Month short names
     */
    getMonthShortNames() {
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    /**
     * Returns the current/passed month length
     *
     * @params {Number} year
     * @params {Number} month
     * @return {Number}
     */
    daysInMonth(year = this.date[0], month = this.date[1]) {
        return new Date(year, month + 1, 0).getDate();
    }

    //G
    public getWeekDays(type: string = ""): string[] {
        switch (type) {
            case "long":
                return this.getDaysNames();
            default:
            case "short":
                return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        }
    }

    public getDay() {
        return this.gDate.getDay();
    }
    public getDate() {
        return this.date[2];
    }
    public getFullYear() {
        return this.date[0];
    }
    public getMonth() {
        return this.date[1];
    }
    public getTime() {
        return this.gDate.getTime();
    }
    //S
    public setDate(date) {
        this.gDate.setDate(+date);
        this.setgDate();

        return this;
    }
    public setFullYear(year) {
        this.gDate.setFullYear(+year);
        this.setgDate();

        return this;
    }
    public setMonth(month) {
        this.gDate.setMonth(+month);
        this.setgDate();

        return this;
    }
    setHours(hours: number, minutes: number = null, seconds: number = null, milliseconds: number = null) {
        this.gDate.setHours(hours, minutes, seconds, milliseconds);
        return this;
    }

    /* Private */
    private setgDate() {
        this.date[0] = this.gDate.getFullYear();
        this.date[1] = this.gDate.getMonth();
        this.date[2] = this.gDate.getDate();
    }
    //D
    private div(a, b) {
        return ~~(a / b);
    }
    private d2j(jdn) {
        /*
          Converts the Julian Day number to a date in the Jalaali calendar.

          @param jdn Julian Day number
          @return
            jy: Jalaali year (1 to 3100)
            jm: Jalaali month (1 to 12)
            jd: Jalaali day (1 to 29/31)
        */
        let gy = this.d2g(jdn).gy, // Calculate Gregorian year (gy).
            jy = gy - 621,
            r = this.jalCal(jy),
            jdn1f = this.g2d(gy, 3, r.march),
            jd,
            jm,
            k;

        // Find number of days that passed since 1 Farvardin.
        k = jdn - jdn1f;
        if (k >= 0) {
            if (k <= 185) {
                // The first 6 months.
                jm = 1 + this.div(k, 31);
                jd = this.mod(k, 31) + 1;
                return {
                    jy: jy,
                    jm: jm,
                    jd: jd
                };
            } else {
                // The remaining months.
                k -= 186;
            }
        } else {
            // Previous Jalaali year.
            jy -= 1;
            k += 179;
            if (r.leap === 1) {
                k += 1;
            }
        }
        jm = 7 + this.div(k, 30);
        jd = this.mod(k, 30) + 1;
        return {
            jy: jy,
            jm: jm,
            jd: jd
        };
    }
    private d2g(jdn) {
        /*
          Calculates Gregorian and Julian calendar dates from the Julian Day number
          (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
          calendars) to some millions years ahead of the present.

          @param jdn Julian Day number
          @return
            gy: Calendar year (years BC numbered 0, -1, -2, ...)
            gm: Calendar month (1 to 12)
            gd: Calendar day of the month M (1 to 28/29/30/31)
        */
        let j, i, gd, gm, gy;

        j = 4 * jdn + 139361631;
        j = j + this.div(this.div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
        i = this.div(this.mod(j, 1461), 4) * 5 + 308;
        gd = this.div(this.mod(i, 153), 5) + 1;
        gm = this.mod(this.div(i, 153), 12) + 1;
        gy = this.div(j, 1461) - 100100 + this.div(8 - gm, 6);
        return {
            gy: gy,
            gm: gm,
            gd: gd
        };
    }
    //F
    private fixMonth(year, month) {
        if (month > 12 || month <= 0) {
            const yearDiff = Math.floor((month - 1) / 12);
            year += yearDiff;
            month = month - yearDiff * 12;
        }
        return [year, month];
    }
    //G
    private g2d(gy, gm, gd) {
        /*
          Calculates the Julian Day number from Gregorian or Julian
          calendar dates. This integer number corresponds to the noon of
          the date (i.e. 12 hours of Universal Time).
          The procedure was tested to be good since 1 March, -100100 (of both
          calendars) up to a few million years into the future.

          @param gy Calendar year (years BC numbered 0, -1, -2, ...)
          @param gm Calendar month (1 to 12)
          @param gd Calendar day of the month (1 to 28/29/30/31)
          @return Julian Day number
        */

        let d = this.div((gy + this.div(gm - 8, 6) + 100100) * 1461, 4) + this.div(153 * this.mod(gm + 9, 12) + 2, 5) + gd - 34840408;
        d = d - this.div(this.div(gy + 100100 + this.div(gm - 8, 6), 100) * 3, 4) + 752;
        return d;
    }
    getMinutes(): number {
        return this.gDate.getMinutes();
    }
    getHours(): number {
        return this.gDate.getHours();
    }
    getSeconds(): number {
        return this.gDate.getSeconds();
    }
    //I
    private isLeapYear(year) {
        /*
         * Checks if a given year is a leap year or not
         *
         * @params {Number} year
         * @return {Boolean}
         */
        return this.jalCal(year).leap === 0;
    }
    //J
    private jalCal(jy) {
        /*
         This function determines if the Jalaali (Persian) year is
         leap (366-day long) or is the common year (365 days), and
         finds the day in March (Gregorian calendar) of the first
         day of the Jalaali year (jy).

         @param jy Jalaali calendar year (-61 to 3177)
         @return
         leap: number of years since the last leap year (0 to 4)
         gy: Gregorian year of the beginning of Jalaali year
         march: the March day of Farvardin the 1st (1st day of jy)
         @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
         @see: http://www.fourmilab.ch/documents/calendar/
         */

        // Jalaali years starting the 33-year rule.
        let breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178],
            bl = breaks.length,
            gy = jy + 621,
            leapJ = -14,
            jp = breaks[0],
            jm,
            jump,
            leap,
            leapG,
            march,
            n,
            i;

        if (jy < jp || jy >= breaks[bl - 1]) {
            throw new Error("Invalid Jalaali year " + jy);
        }

        // Find the limiting years for the Jalaali year jy.
        for (i = 1; i < bl; i += 1) {
            jm = breaks[i];
            jump = jm - jp;
            if (jy < jm) {
                break;
            }
            leapJ = leapJ + this.div(jump, 33) * 8 + this.div(this.mod(jump, 33), 4);
            jp = jm;
        }
        n = jy - jp;

        // Find the number of leap years from AD 621 to the beginning
        // of the current Jalaali year in the Persian calendar.
        leapJ = leapJ + this.div(n, 33) * 8 + this.div(this.mod(n, 33) + 3, 4);
        if (this.mod(jump, 33) === 4 && jump - n === 4) {
            leapJ += 1;
        }

        // And the same in the Gregorian calendar (until the year gy).
        leapG = this.div(gy, 4) - this.div((this.div(gy, 100) + 1) * 3, 4) - 150;

        // Determine the Gregorian date of Farvardin the 1st.
        march = 20 + leapJ - leapG;

        // Find how many years have passed since the last leap year.
        if (jump - n < 6) {
            n = n - jump + this.div(jump + 4, 33) * 33;
        }
        leap = this.mod(this.mod(n + 1, 33) - 1, 4);
        if (leap === -1) {
            leap = 4;
        }

        return {
            leap: leap,
            gy: gy,
            march: march
        };
    }
    private j2d(jy, jm, jd) {
        /*
          Converts a date of the Jalaali calendar to the Julian Day number.

          @param jy Jalaali year (1 to 3100)
          @param jm Jalaali month (1 to 12)
          @param jd Jalaali day (1 to 29/31)
          @return Julian Day number
        */

        const r = this.jalCal(jy);
        return this.g2d(r.gy, 3, r.march) + (jm - 1) * 31 - this.div(jm, 7) * (jm - 7) + jd - 1;
    }
    private toGregorian() {
        /*
         * converts a Jalali date to Gregorian
         *
         * @params {Number} year
         * @params {Number} month
         * @params {Number} day
         * @return {Date}
         */

        const gdate = this.d2g(this.j2d(this.date[0], this.date[1], this.date[2]));
        return new Date(gdate.gy, gdate.gm - 1, gdate.gd);
    }
    //L

    //M
    private mod(a, b) {
        return a - ~~(a / b) * b;
    }
    //R

    //T
    private toJalali(date) {
        /*
         * Coverts a Gregorian date to Jalali date
         *
         * @params {Date} date
         * @return {Array}
         */

        const jdate = this.d2j(this.g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));
        return [jdate.jy, jdate.jm, jdate.jd];
    }
}
