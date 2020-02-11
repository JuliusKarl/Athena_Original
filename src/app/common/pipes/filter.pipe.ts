import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform<T>(items: T[], searchField: string , searchText: string): T[] {
        if (!items) {return []; }
        if (!searchText) {return items; }
        return items.filter( it => {

          // If multiple fields check each field
          if ( searchField.indexOf(',') > -1) {
            // check if any of the fields contains the search text
            const test = searchField.split(',').find( field => {
              return it[field] && it[field].toLowerCase().includes(searchText.toLowerCase());
            });
            // return true if a match was found
            return test !== undefined;
          }

          // If field is passed check inside that field
          if (searchField) {
            return it[searchField].toLowerCase().includes(searchText.toLowerCase());
          }

          // If NO field is passed do a string compare
          return it.toString().toLowerCase().includes(searchText.toLowerCase());
        });
    }


}
