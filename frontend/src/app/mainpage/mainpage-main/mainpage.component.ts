import { Component, ViewChild, ElementRef } from '@angular/core';
import { OptionsScreenComponent } from 'src/app/settings/options-screen.component';
import { MesResultatsComponent } from 'src/app/mesResultats/mes-resultat.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { User } from 'src/models/user.model';
import { QuizListComponent } from 'src/app/quiz/quizlist/quizlist.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HelpModalComponent } from 'src/app/helpModal/help-modal.component';
import { TemplateRef } from '@angular/core';
@Component({
  selector: 'app-main',
  templateUrl: './mainpage.component.html',
})
export class MainPage {
  user: User;
  currentTab = 'QUIZ';
  @ViewChild('resultBtn') resultBtn: ElementRef;
  @ViewChild(TemplateRef) tpl: TemplateRef<any>;

  ngAfterViewInit() {
    this.loadTabComponent('QUIZ');
  }

  components = {
    QUIZ: QuizListComponent,
    RESULTAT: MesResultatsComponent,
    PARAMETRES: OptionsScreenComponent,
  };

  constructor(
    public router: Router,
    private authService: AuthService,
    private ngxSmartModalService: NgxSmartModalService
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  get selectedComponent() {
    return this.components[this.currentTab] || QuizListComponent;
  }

  loadTabComponent(tab: string) {
    this.currentTab = tab;
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach((button: any) => {
      button.style.backgroundColor = '#BAD7E9';
      button.style.color = '#2B3467';
    });
    // set the background and text color of the selected button
    const selectedButton = document.querySelector(
      `[data-tab=${tab}]`
    ) as HTMLElement;
    if (selectedButton) {
      selectedButton.style.backgroundColor = '#2B3467';
    }
  }

  navigateProfile() {
    this.router.navigate(['/profile']);
  }

  // navigateHelp() {
  //   this.router.navigate(['/help']);
  // }

  helpPopup() {
    console.log('aaa');
    this.ngxSmartModalService.create('myModal2', HelpModalComponent).open();
  }
}
