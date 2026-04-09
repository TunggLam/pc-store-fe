import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../service/user.service";
import {catchError, finalize, tap, throwError} from "rxjs";
import {CallbackResponse} from "../../model/callback-response";

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.css']
})
export class ConfirmPaymentComponent implements OnInit {

  res: CallbackResponse = {};
  isSuccess = false;
  isLoading = false;

  constructor(private activeRouter: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.activeRouter.queryParams.subscribe(params => {
      const amount = params['vnp_Amount'];
      const bankCode = params['vnp_BankCode'];
      const bankTranNo = params['vnp_BankTranNo'];
      const cardType = params['vnp_CardType'];
      const orderInfo = params['vnp_OrderInfo'];
      const paymentDate = params['vnp_PayDate'];
      const responseCode = params['vnp_ResponseCode'];
      const tmnCode = params['vnp_TmnCode'];
      const transactionNo = params['vnp_TransactionNo'];
      const transactionStatus = params['vnp_TransactionStatus'];
      const txnRef = params['vnp_TxnRef'];
      const secureHash = params['vnp_SecureHash'];

      this.isLoading = true;
      const payload = {
        invoiceNo: txnRef
      }
      this.userService.callbackPayment(payload).pipe(
        tap(res => {
          this.res = res;
          if (this.res.responseCode === 'SUCCESS') {
            this.isSuccess = true;
          }
        }),
        catchError(err => {
          this.res.message = 'Thanh toán thất bại'
          return err;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe()
    });
  }


}
