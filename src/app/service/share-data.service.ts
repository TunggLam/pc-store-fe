import {Injectable} from '@angular/core';
import {RegisterRequest} from "../model/register-request";

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private email: string = '';
  private registerRequest: RegisterRequest = {};

  constructor() {
  }

  setEmail(email: string) {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  setRegisterRequest(request: RegisterRequest) {
    this.registerRequest = request;
  }

  getRegisterRequest(): RegisterRequest {
    return this.registerRequest;
  }


}
