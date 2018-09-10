import { IDocObject } from 'services/firebase/firestore';
import { DateService } from 'services/date';

export class Arrival {

  userId = '';
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
    return Object.assign(
      new Arrival(),
      obj
    );
  }

  toObject() {
    const obj = Object.assign({}, this);
    delete obj.date;
    delete obj.time;

    if (this.date && this.time) {
      obj.arrivedAt = new Date(this.date + ' ' + this.time);
    } else {
      console.log('setttt')
      obj.arrivedAt = new Date();
    }
    return obj;
  }

  get arrivedDate(): string {
    return DateService.toDateStr(this.arrivedAt);
  }

  set arrivedDate(val: string) {
    console.log('set date', val)
    this.date = val;
  }

  get arrivedTime(): string {
    return DateService.toTimeStr(this.arrivedAt);
  }

  set arrivedTime(val: string) {
    console.log('set time', val)
    this.time = val;
  }
}
