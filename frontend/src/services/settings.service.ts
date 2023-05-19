import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable, forkJoin } from 'rxjs';
import { Settings } from '../models/settings.model';
import { serverUrl, httpOptionsBase } from '../configs/server.config';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { Notification } from 'src/models/notification.model';
@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private settingsUrl = serverUrl + '/settings';
  private httpOptions = httpOptionsBase;
  public settings: Settings = null;
  public settings$: BehaviorSubject<Settings> = new BehaviorSubject(
    this.settings
  );
  public settingsSelected$: Subject<Settings> = new Subject();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  setCurrentUserSettings() {
    return new Promise((resolve, reject) => {
      if (this.settings !== undefined) {
        return resolve(true);
      }

      if (this.authService.user != null) {
        const uid = this.authService.user.id;

        const urlWithId = this.settingsUrl + '/' + uid;

        this.http.get<Settings>(urlWithId).subscribe((settings) => {
          this.settings = settings;
          this.settings$.next(this.settings);
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  }

  getSettingsOfUser(uid: number): Observable<Settings> {
    const urlWithId = this.settingsUrl + '/' + uid;
    return this.http.get<Settings>(urlWithId);
  }

  updateSettings(settings: Settings): Observable<Settings> {
    console.log('settings', settings);
    const urlWithId = this.settingsUrl + '/' + settings.user_id;

    if (settings.user_id != 1682318674112) {
      //admin's id. To be changed later if we have multiple admins
      const residentName =
        this.authService.user.firstName + ' ' + this.authService.user.lastName;
      const Notification: Notification = {
        sender_id: settings.user_id,
        user_id: 1682318674112, //admin's id. To be changed later if we have multiple admins
        message: residentName + ' a modifié ses paramètres',
        type: 'settings',
        date: new Date(),
        seen: false,
      };
      this.notificationService.addNotification(Notification).subscribe();
    }

    //TODO: make sure that the notification was added before updating the settings
    return this.http.put<Settings>(urlWithId, settings, this.httpOptions);
  }

  setSettings(settings: Settings) {
    this.settings = settings;
    this.settings$.next(this.settings);
  }
}
