export interface AdminOrderPaymentResponse {
  paymentId: string;
  invoiceNo: string;
  cardType: string;
  amount: number;
  transactionNo: string;
  transactionStatus: string;
  transactionCreateDate: string;
  status: string;
}
