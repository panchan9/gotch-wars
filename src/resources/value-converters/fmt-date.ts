import { getLogger } from 'aurelia-logging';
import { DateService } from 'services/date';

export class FmtDateValueConverter {

  private readonly logger = getLogger(FmtDateValueConverter.name);

  toView(value: Date, format?: string): string {
    if (!(value instanceof Date)) {
      this.logger.warn('Passed value is not Date instance:', value);
      return value;
    }
    this.logger.debug('fmtDate', value);
    switch (format) {
      case 'ymd':
        return DateService.toDateStr(value);
      case 'iso':
        return value.toISOString();
      default:
        return DateService.toDatetimeStr(value);
    }
  }
}

