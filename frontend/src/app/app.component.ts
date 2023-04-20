import { Component, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SpeechService } from '../services/speech.service';
import { SettingService } from '../services/settings.service';
import { Subscription } from 'rxjs';
import { Settings } from 'src/models/settings.model';
import writtenNumber from 'written-number';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private settingsSubscription: Subscription;
  private speechSubscription: Subscription;
  private userSettings: Settings;
  private mouseX: number;
  private mouseY: number;
  private spaceKeyPressed: boolean = false;
  private isDoubleClickEnabled = false;
  private longClickTimeout: any;
  private isPressionLongueEnabled = false;
  private boundOnDoubleClick: any;
  private boundOnMouseDown: any;
  constructor(
    public router: Router,
    private speechService: SpeechService,
    private settingsService: SettingService
  ) {
    this.boundOnDoubleClick = this.onDoubleClick.bind(this);
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.settingsService.setCurrentUserSettings().then(() => {
      this.settingsSubscription = this.settingsService.settings$.subscribe(
        (settings) => {
          this.userSettings = settings;
          this.handleSpeechRecognition();
          this.handleClickOption();
          this.handleDoubleClick();
          this.handlePressionLongue();
        }
      );
    });
    this.speechSubscription = this.speechService.speech.subscribe(
      (transcript) => {
        this.handleClickBySpeech(transcript);
      }
    );
  }

  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
    this.speechSubscription.unsubscribe();
  }

  /* Gestion reconnaissance vocale */

  private handleSpeechRecognition() {
    if (this.userSettings && this.userSettings.microphone) {
      try {
        this.speechService.startRecognition();
      } catch (error) {
        console.warn('Speech recognition already active');
      }
    } else {
      this.speechService.stopRecognition();
    }
  }

  /* Parsing du texte dit par l'utilisateur NE PAS TOUCHER SVP */
  private normalizeText(text: string): string {
    const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ';
    const noAccents = 'AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuyNn';
    const newText = text
      .trim()
      .replace(/\d+/g, (match) =>
        writtenNumber(parseInt(match), { lang: 'fr' })
      )
      .split('')
      .map((char) => {
        const index = accents.indexOf(char);
        return index !== -1 ? noAccents[index] : char;
      })
      .join('')
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '_');
    return newText;
  }

  private handleClickBySpeech(transcript: string) {
    const wordsToRemove = ['le', 'la', 'les', 'de', 'des'];
    const normalizedTranscript = this.normalizeText(transcript);
    const words = normalizedTranscript
      .split('_')
      .filter((word) => !wordsToRemove.includes(word));
    const combinations = this.generateCombinations(words);

    for (const combination of combinations) {
      if (this.findAndClickButton([combination])) {
        return;
      }
    }

    for (const combination of combinations.filter(
      (c) => c.split('_').length === 1
    )) {
      if (this.findAndClickButton([combination], true)) {
        return;
      }
    }

    console.warn('Aucun bouton trouvé pour les mots du transcript');
  }

  private generateCombinations(
    words: string[],
    prefix: string[] = [],
    index: number = 0
  ): string[] {
    if (index === words.length) {
      return prefix.length === 0 ? [] : [prefix.join('_')];
    }

    const withWord = this.generateCombinations(
      words,
      [...prefix, words[index]],
      index + 1
    );
    const withoutWord = this.generateCombinations(words, prefix, index + 1);

    return withWord.concat(withoutWord);
  }

  private findAndClickButton(
    words: string[],
    data_number: boolean = false
  ): boolean {
    for (const word of words) {
      if (word && word.length > 0 && word[0] !== '#') {
        const buttonElement = document.querySelector(`#${word}`);

        if (buttonElement) {
          buttonElement.dispatchEvent(new MouseEvent('click'));
          return true;
        }
      }
    }

    if (data_number) {
      for (const word of words) {
        if (word && word.length > 0 && word[0] !== '#') {
          const buttonElement = document.querySelector(
            `[data-number="${word}"]`
          );

          if (buttonElement) {
            buttonElement.dispatchEvent(new MouseEvent('click'));
            return true;
          }
        }
      }
    }

    return false;
  }

  /* Gestion barre espace clavier */

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (
      this.userSettings &&
      this.userSettings.keyboard_control &&
      event.code === 'Space'
    ) {
      this.spaceKeyPressed = true;
      this.clickElementUnderCursor();
      event.preventDefault();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      this.spaceKeyPressed = false;
    }
  }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (
      this.userSettings &&
      (this.userSettings.keyboard_control ||
        this.userSettings.mouse_option === 'doubleClique' ||
        this.userSettings.mouse_option === 'pressionLongue')
    ) {
      if (
        (this.userSettings.keyboard_control && !this.spaceKeyPressed) ||
        (this.userSettings.mouse_option === 'doubleClique' &&
          !this.isDoubleClickEnabled) ||
        (this.userSettings.mouse_option === 'pressionLongue' &&
          !this.isPressionLongueEnabled)
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private clickElementUnderCursor(): void {
    const element = document.elementFromPoint(this.mouseX, this.mouseY);
    if (element) {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: this.mouseX,
        clientY: this.mouseY,
      });
      if (this.userSettings.mouse_option === 'doubleClique') {
        this.isDoubleClickEnabled = true;
        element.dispatchEvent(clickEvent);
        this.isDoubleClickEnabled = false;
      } else if (this.userSettings.mouse_option === 'pressionLongue') {
        this.isPressionLongueEnabled = true;
        element.dispatchEvent(clickEvent);
        this.isPressionLongueEnabled = false;
      } else {
        element.dispatchEvent(clickEvent);
      }
      console.log('Clic sur', element);
    }
  }

  private handleClickOption() {
    if (
      (this.userSettings && this.userSettings.keyboard_control) ||
      this.userSettings.mouse_option === 'doubleClique' ||
      this.userSettings.mouse_option === 'pressionLongue'
    ) {
      document.addEventListener('click', this.onClick.bind(this), true);
    }
  }

  private handleDoubleClick() {
    if (
      this.userSettings &&
      this.userSettings.mouse_option === 'doubleClique'
    ) {
      document.addEventListener('dblclick', this.boundOnDoubleClick, true);
    } else {
      document.removeEventListener('dblclick', this.boundOnDoubleClick, true);
    }
  }

  private onDoubleClick(event: MouseEvent): void {
    if (
      this.userSettings &&
      this.userSettings.mouse_option === 'doubleClique'
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.clickElementUnderCursor();
    }
  }

  private handlePressionLongue() {
    if (
      this.userSettings &&
      this.userSettings.mouse_option === 'pressionLongue'
    ) {
      document.addEventListener('mousedown', this.boundOnMouseDown, true);
    } else {
      document.removeEventListener('mousedown', this.boundOnMouseDown, true);
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (
      this.userSettings &&
      this.userSettings.mouse_option === 'pressionLongue'
    ) {
      clearTimeout(this.longClickTimeout);
    }
  }

  private onMouseDown(event: MouseEvent): void {
    if (
      this.userSettings &&
      this.userSettings.mouse_option === 'pressionLongue'
    ) {
      clearTimeout(this.longClickTimeout);

      this.longClickTimeout = setTimeout(() => {
        this.isPressionLongueEnabled = true;
        this.clickElementUnderCursor();
      }, 800);

      if (event.button === 2) {
        event.preventDefault();
      }
    }
  }
}
