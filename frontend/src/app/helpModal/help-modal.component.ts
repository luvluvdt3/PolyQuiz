import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
})
export class HelpModalComponent implements OnInit {
  constructor(public ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {}
}
