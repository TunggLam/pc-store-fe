import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AbstractControl, FormControl} from "@angular/forms";

@Component({
  selector: 'app-show-validate-error',
  templateUrl: './show-validate-error.component.html',
  styleUrls: ['./show-validate-error.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ShowValidateErrorComponent {
  @Input() control: AbstractControl = new FormControl();
  @Input() controlName = '';
  @Input() maxLength = '';
  @Input() minLength = '';
  @Input() valueNumber = '';
  @Input() remnantControlName = '';

  constructor() { }
  get keyError() {
    return (this.control && this.control.errors) ? Object.keys(this.control.errors)[0] : '';
  }

}
