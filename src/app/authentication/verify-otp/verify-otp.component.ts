import {Component, OnInit} from '@angular/core';
import {ShareDataService} from "../../service/share-data.service";
import {AuthenticationService} from "../../service/authentication.service";
import {FormControl, FormGroup} from "@angular/forms";
import {catchError, tap, throwError} from "rxjs";
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";
import {LoadingService} from "../../service/loading.service";

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {



  ngOnInit(): void {
  }

  constructor(private shareDataService: ShareDataService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private alertService: AlertService,
              private loadingService: LoadingService) {
  }
}
