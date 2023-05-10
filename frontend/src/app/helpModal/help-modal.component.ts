import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
})
export class HelpModalComponent implements OnInit {
  description: string;
  constructor(
    private dialogRef: MatDialogRef<HelpModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.description = data.description;
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }
}
