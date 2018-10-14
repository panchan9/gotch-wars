import { IDocObject, FirestoreService } from 'services/firebase/firestore';
import { DateService } from 'services/date';
import { endOfMinute, isAfter, differenceInMinutes } from 'date-fns';

export class Arrival {

  id: string;
  uid = '';
  arrivedAt: Date;
  createdAt: Date;

  private date: string;
  private time: string;
  gotchPoint: number;

  constructor() {
    this.arrivedAt = new Date();
    this.date = this.arrivedDate;
    this.time = this.arrivedTime;
  }

  static fromObject(obj: IDocObject): Arrival {
    const arrival = Object.assign(
      new Arrival(),
      FirestoreService.castTimestampToDate(obj, ['arrivedAt']),
    );
    arrival.date = arrival.arrivedDate;
    arrival.time = arrival.arrivedTime;

    arrival.gotchPoint = Arrival.calculateGotch(arrival.arrivedAt);
    return arrival;
  }

  toObject() {
    const obj = Object.assign({}, this);
    delete obj.date;
    delete obj.time;

    if (this.date && this.time) {
      obj.arrivedAt = new Date(this.date + ' ' + this.time);
    } else {
      obj.arrivedAt = new Date();
    }
    return obj;
  }

  static calculateGotch(arrivedAt: Date): number {
    const [hh, mm] = [ 7, 0 ];
    const interval = 30;

    const limit = endOfMinute(new Date(
      arrivedAt.getFullYear(),
      arrivedAt.getMonth(),
      arrivedAt.getDate(),
      hh,
      mm,
    ));

    if (isAfter(arrivedAt, limit)) {
      const diff = differenceInMinutes(arrivedAt, limit);
      return 1 + Math.floor(diff / interval);
    }
    return 0;
  }

  get arrivedDate(): string {
    return DateService.toDateStr(this.arrivedAt);
  }

  set arrivedDate(val: string) {
    this.date = val;
  }

  get arrivedTime(): string {
    return DateService.toTimeStr(this.arrivedAt);
  }

  set arrivedTime(val: string) {
    this.time = val;
  }

}
