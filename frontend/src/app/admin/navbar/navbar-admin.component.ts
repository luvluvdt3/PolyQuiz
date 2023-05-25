import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { User } from 'src/models/user.model';
import Swal from 'sweetalert2';
import { ResidentComponent } from '../mesResidents/resident.component';
import { Notification } from 'src/models/notification.model';
import { NotificationService } from 'src/services/notification.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
})
export class AdminNavbarComponent implements OnInit {
  user: User;
  notifications: Map<User, Notification> = new Map<User, Notification>();
  showNotifications = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    this.notificationService
      .getNotificationsOfUser(this.user.id)
      .subscribe((notifications) => {
        const notif = notifications;
        for (const element of notif) {
          let notification = element;
          let user = this.userService.getUserById(notification.sender_id);

          //only get one notif per resident, with the lastest time
          let existingUser = Array.from(this.notifications.keys()).find(
            (key) => key.id === user.id
          );

          if (existingUser) {
            let existingNotification = this.notifications.get(existingUser);
            existingNotification.message = notification.message;
            existingNotification.date = notification.date;
          } else {
            this.notifications.set(user, notification);
          }
        }
        console.log(this.notifications);
      });
  }

  ngOnInit() {}

  navigateMain() {
    if (this.user.userType == 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }

  navigateProfile() {
    this.router.navigate(['/profile']);
  }

  navigateSettings() {
    this.router.navigate(['/settings']);
  }

  switchNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  // navigateHelp() {
  //   this.router.navigate(['/help']);
  // }

  helpPopup() {
    let dialog = document.getElementsByTagName('dialog')[0];
    dialog.showModal();
  }
}
