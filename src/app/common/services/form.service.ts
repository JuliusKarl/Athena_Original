import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }


  getValue(ctrl: string, formGroup: FormGroup): string {
    return formGroup.get(ctrl).value;
  }

  hasDataFor(ctrl: string, formGroup: FormGroup): boolean {
    return formGroup.get(ctrl).value &&
      (formGroup.get(ctrl).value.length > 0 || typeof formGroup.get(ctrl).value === 'object');
  }

  valueIs(ctrl: string, val: string, formGroup: FormGroup): boolean {
    return formGroup.get(ctrl).value.toLowerCase() === val.toLowerCase();
  }

  valueIsNot(ctrl: string, val: string, formGroup: FormGroup): boolean {
    return formGroup.get(ctrl).value !== val;
  }
}
