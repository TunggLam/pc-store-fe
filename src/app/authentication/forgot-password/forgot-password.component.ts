import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  submitted = false;
  formForgotPassword!: FormGroup;
  isLoading = false;

  constructor(private formBuilder: FormBuilder) {

  }

  forgotPassword() {
    this.submitted = true;
    if (this.formForgotPassword.valid) {
      return
    }
  }

  ngOnInit(): void {
    this.formForgotPassword = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formForgotPassword.controls;
  }

}
