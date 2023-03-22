import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizDetailsComponent } from './quizlist/quiz-details/quiz-details.component';
import { QuizListComponent} from './quizlist/quizlist.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './temporaryRegister/register.component';
import { GamePageComponent } from './gameComponents/game-page/game-page.component';
import { MainPage } from './mainpage/mainpage.component';

const routes: Routes = [
  {path: 'quizlist', component: QuizListComponent},
  {path: 'game/:quizId', component: GamePageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'tempo-register', component: RegisterComponent}, //only do this for the moment, to be implement only in admin's interface later
  {path: '', component: MainPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
