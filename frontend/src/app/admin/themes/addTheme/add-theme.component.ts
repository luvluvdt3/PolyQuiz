import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Theme } from 'src/models/quiz.model';
import { QuizService } from 'src/services/quiz.service';
import { ThemesService } from 'src/services/theme.service';

@Component({
  selector: 'app-add-theme',
  templateUrl: './add-theme.component.html',
})
export class AddThemeComponent implements OnInit {
  @Output() loadTheme = new EventEmitter<Theme>();

  public themeForm: FormGroup;
  themes: Theme[] = [];
  theme: Theme;

  constructor(
    private quizService: QuizService,
    private formBuilder: FormBuilder,
    private router: Router,
    private themeService: ThemesService
  ) {
    this.themeForm = this.formBuilder.group({
      themeImage: ['', Validators.required],
      themeName: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  public addTheme(): void {
    this.theme = {
      name: this.themeForm.value.themeName,
      image: this.themeForm.value.themeImage,
    };
    this.loadTheme.emit(this.theme);
  }
}
