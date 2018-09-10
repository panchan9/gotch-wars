
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

  static combineDateAndTime(date: string, time: string) {
    return new Date(date + ' ' + time);
  }

  static padZero(value: number): string {
    return ('0' + value).slice(-2);
  }

}
