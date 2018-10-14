import { User } from './user';
import { Arrival } from './arrival';
import { DateService } from 'services/date';

export class UserHistory {

  user: User;
  arrivals: Arrival[] = [];

  constructor() {

  }

  static fromArrivals(arrivals: Arrival[], user: User): UserHistory {
    const hist = new UserHistory();
    hist.arrivals = arrivals;
    hist.user = user;

    return hist;
  }

  sumGotchPoint() {
    return this.arrivals
      .map(arrival => arrival.gotchPoint)
      .reduce((sum, point) => sum + point);
  }

  getArrival(date: Date): Arrival {
    const arrivals = this.arrivals
      .filter(a => a.arrivedAt.getDate() === date.getDate());

    if (arrivals.length > 1) {
      console.warn('Duplicated arrival times are registered:', arrivals);
    }
    console.debug(arrivals);
    return arrivals[0];
  }

  getArrivalTime(date: Date): string {
    const times = this.arrivals
      .filter(a => a.arrivedAt.getDate() === date.getDate())
      .map(a => a.arrivedTime);

    if (times.length > 1) {
      console.warn('Duplicated arrival times are registered:', times);
    }
    return times[0].slice(0, 5);
  }

  getStartAndEndDate() {
    const sortedDates = DateService.sortDates(this.arrivals.map(a => a.arrivedAt));
    return {
      start: sortedDates[0],
      end: sortedDates[sortedDates.length - 1],
    };
  }
}
