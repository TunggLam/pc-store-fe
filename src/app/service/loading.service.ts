import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() {
  }

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loadingState$ = this.loadingSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }

  hideWithCallback(callback: () => void, timeout?: number) {
    setTimeout(() => {
      this.hide();
      callback();
    }, timeout || 0);
  }

}
