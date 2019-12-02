import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoggerService } from '../../../services/logger.service';
import { InvoiceInformation } from '../../../models/alertData';
import { Invoice } from '../../../models/lndModels';

@Component({
  selector: 'rtl-invoice-information',
  templateUrl: './invoice-information.component.html',
  styleUrls: ['./invoice-information.component.scss']
})
export class InvoiceInformationComponent implements OnInit {
  public faReceipt = faReceipt;
  public showAdvanced = false;
  public newlyAdded = false;
  public invoice: Invoice;

  constructor(public dialogRef: MatDialogRef<InvoiceInformationComponent>, @Inject(MAT_DIALOG_DATA) public data: InvoiceInformation, private logger: LoggerService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.invoice = this.data.invoice;
    this.newlyAdded = this.data.newlyAdded;
  }

  onClose() {
    this.dialogRef.close(false);
  }

  onShowAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }  

  onCopyPayment(payload: string) {
    this.snackBar.open('Payment request copied');
    this.logger.info('Copied Text: ' + payload);
  }
}
