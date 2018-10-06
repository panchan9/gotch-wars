import { IDocObject } from 'services/firebase/firestore';
import { User } from './user';
import { Arrival } from './arrival';
import { UserHistory } from './user-history';
import { Container } from 'aurelia-framework';
import { DateService } from 'services/date';
import { getLogger } from 'aurelia-logging';

export class GotchResult {

  calendarDates: Date[] = [];
  userHistories: UserHistory[];

  // static fromObject(obj: IDocObject): GotchResult {
  //   return Object.assign(
  //     new GotchResult(),
  //   );
  // }

  static fromArrivals(hist: UserHistory[]) {
    const logger = getLogger(GotchResult.name);

    const allDates = hist
      .map(h => h.arrivals.map(a => a.arrivedAt))
      .reduce((d1, d2) => d1.concat(d2));

    const sortedDates = DateService.sortDates(allDates);
    const result = new GotchResult();
    result.userHistories = hist;

    for (let i = 0, len = sortedDates.length; i < len; i++) {
      result.calendarDates.push(DateService.addDays(sortedDates[0], i));
    }

    return result;
  }


}
