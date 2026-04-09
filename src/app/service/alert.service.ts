import {Injectable, OnInit} from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AlertService implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  alertSuccess(message: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      timerProgressBar: true,
      showConfirmButton: false,
      timer: 2000
    });
  }

  alertError(message: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 3000
    });
  }
}
