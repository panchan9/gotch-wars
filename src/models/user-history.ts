import { User } from './user';
import { Arrival } from './arrival';
import { AuthService } from 'services/firebase/auth';
import { DateService } from 'services/date';

export class UserHistory {

  user: User;
  // uid: string
  arrivals: Arrival[] = [];

  constructor() {

  }

  static fromArrivals(arrivals: Arrival[], user: User): UserHistory {
    const hist = new UserHistory();
    hist.arrivals = arrivals;
    hist.user = user;

    return hist;
  }

  getArrivalTime(date: Date): string {
    const times = this.arrivals
      .filter(a => a.arrivedAt.getDate() === date.getDate())
      .map(a => a.arrivedTime);

    if (times.length > 1) {
      console.warn('Duplicated arrival times are registered:', times);
    }
    return times[0];
  }

  getStartAndEndDate() {
    const sortedDates = DateService.sortDates(this.arrivals.map(a => a.arrivedAt));
    return {
      start: sortedDates[0],
      end: sortedDates[sortedDates.length - 1],
    };
  }
}
