
export class DateService {

  static toDateStr(dt: Date, sep = '-'): string {
    const [ YY, MM, DD ] = [
      dt.getFullYear(),
      this.padZero(dt.getMonth() + 1),
      this.padZero(dt.getDate()),
    ];
    return `${YY}${sep}${MM}${sep}${DD}`;
  }

  static toDatetimeStr(dt: Date): string {
    return this.toDateStr(dt) + ' ' + this.toTimeStr(dt);
  }

  static toTimeStr(dt: Date): string {
    return [ dt.getHours(), dt.getMinutes(), dt.getSeconds() ]
      .map(this.padZero)
      .join(':');
  }

  /**
   *
   * @param date
   * @param time
   */
  static combineDateAndTime(date: string, time: string) {
    return new Date(date + ' ' + time);
  }


  /**
   * Date Calculation
   */

  static getStartOfDay(d: Date): Date {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  }

  static addDays(d: Date, offset: number): Date {
    const dt = new Date(d);
    dt.setDate(dt.getDate() + offset);
    return dt;
  }


  /**
   * Date Comparison
   */

  /**
   * Are the given dates quals?
   * @param d1 - the first date to compare
   * @param d2 - the second date to compare
   */
  static isEqual(d1: Date, d2: Date): boolean {
    return d1.getTime() === d2.getTime();
  }

  static sortDates(dates: Date[]): Date[] {
    return dates.sort((d1, d2) => d1.getTime() - d2.getTime());
  }

  static padZero(value: number): string {
    return ('0' + value).slice(-2);
  }

}
