import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

    transform<T>(items: T[], sortField: string, direction: string = 'desc'): T[] {
        if (!items) {
          return [];
        }

        const multiplier = direction === 'desc' ? -1 : 1;

        return items.sort((a: T , b:  T) => {
          const aStr = SortByPipe.toStr(a, sortField).toLowerCase();
          const bStr = SortByPipe.toStr(b, sortField).toLowerCase();

          // Number comparison
          if(SortByPipe.isNumber(aStr) && SortByPipe.isNumber(bStr)) {
            if (+aStr > +bStr) {
              return 1 * multiplier;
            } else if (+aStr < +bStr) {
              return -1 * multiplier;
            } else {
              return 0;
            }
          }
          // String comparison
          else {
            return aStr.localeCompare(bStr) * multiplier;
          }
        });
    }

    static isNumber(val: string): boolean {
      return !isNaN(+val);
    }

    static toStr<T>(item: T, sortField: string): string {
      if(sortField && sortField != '') {

        if(item[sortField]) {
          return item[sortField] + '';
        }
        // If sort field is defined but it's not found as a property of 'item'
        else {
          return '';
        }
      }
      // If sort field is not defined, treat the item itself as a string
      else {
        return item + '';
      }
    }
}
