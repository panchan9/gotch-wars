import { IDocObject } from 'services/firebase/firestore';
import { User } from './user';
import { Arrival } from './arrival';
import { UserHistory } from './user-history';
import { Container } from 'aurelia-framework';
import { DateService } from 'services/date';
import { getLogger } from 'aurelia-logging';
import { addDays, startOfDay, isEqual } from 'date-fns';

export class GotchResult {

  calendarDates: Date[] = [];
  userHistories: UserHistory[];

  // static fromObject(obj: IDocObject): GotchResult {
  //   return Object.assign(
  //     new GotchResult(),
  //   );
  // }

  static fromArrivals(histories: UserHistory[]) {
    const allDates = histories
      .map(h => h.arrivals.map(a => startOfDay(a.arrivedAt)))
      // concat each array of Arrivals
      .reduce((d1, d2) => d1.concat(d2));

    const result = new GotchResult();
    result.userHistories = histories;

    const uniqueDates: Date[] = [];
    for (const d of allDates) {
      if (!uniqueDates.find(ud => isEqual(ud, d))) {
        uniqueDates.push(d);
      }
    }
    result.calendarDates = DateService.sortDates(uniqueDates);

    return result;
  }


}
