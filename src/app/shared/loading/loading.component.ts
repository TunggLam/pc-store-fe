import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../service/loading.service";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  public status: boolean = false;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loadingState$.subscribe((state: boolean) => {
      this.status = state;
    });
  }

  ngOnInit(): void {
  }

}
