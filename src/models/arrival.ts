import { IDocObject, FirestoreService } from 'services/firebase/firestore';
import { DateService } from 'services/date';

export class Arrival {

  id: string;
  uid = '';
  arrivedAt: Date;
  createdAt: Date;

  private date: string;
  private time: string;

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
