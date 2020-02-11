import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {UserService} from '../services/user.service';

@Directive({
  selector: '[appEnableAction]'
})
export class EnableActionDirective {

  constructor(private el: ElementRef, private renderer: Renderer2, private userService: UserService) {
  }

  @Input('appEnableAction') set enableAction(actionFor: string) {

    // Disable action by default
    this.renderer.addClass(this.el.nativeElement, 'disabled');

    if (this.userService.hasAccess(actionFor) === true) {
      console.debug(`Enabling action on ${actionFor}`);
      this.renderer.removeClass(this.el.nativeElement, 'disabled');
    } else {
      console.debug(`Current user can't act on ${actionFor}`);
    }
  }
}
