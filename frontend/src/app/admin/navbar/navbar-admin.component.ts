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
    console.log('aaa');
    Swal.fire({
      html: `
        <div>
          <h1 class="text-4xl text-[#2B3467] font-bold mb-4">Aide</h1>
          <hr class="h-px mb-6 bg-gray-200 border-0 dark:bg-gray-700" />

          <div class="mb-8">
            <h2 class="text-3xl text-[#2B3467] font-semibold mb-2">Comment modifier les paramètres ?</h2>
            <p class="text-[#2B3467] text-xl">
              Accédez à la page des paramètres en cliquant sur l'icône d'engrenage dans la barre de navigation. Vous pouvez personnaliser les options de clic de la souris, l'action du microphone, la confirmation avant de valider, et les clics avec la barre d'espace.
            </p>
          </div>

          <div class="mb-8">
            <h2 class="text-3xl text-[#2B3467] font-semibold mb-2">Comment suivre mes progrès ?</h2>
            <p class="text-[#2B3467] text-xl">
              Votre profil affiche votre score et votre taux de réussite aux quiz. Vous pouvez accéder à votre profil en cliquant sur votre nom d'utilisateur dans la barre de navigation.
            </p>
          </div>

          <div class="mb-8">
            <h2 class="text-3xl text-[#2B3467] font-semibold mb-2">Les différents paramètres</h2>
            <h3 class="text-2xl text-[#2B3467] font-semibold mb-1">Options de clics de souris :</h3>
            <ul class="list-disc pl-6 text-[#2B3467] text-xl">
              <li>Double clique = Toute action impliquant un clic en nécessitera deux pour être prise en compte</li>
              <li>Pression longue = Toute action impliquant un clic nécessitera une pression de 0,8 secondes pour être prise en compte</li>
              <li>Aucun = Les clics se comportent normalement comme sur n'importe quel autre site web</li>
            </ul>

            <h3 class="text-2xl text-[#2B3467] font-semibold mb-1 mt-4">Action au microphone :</h3>
            <p class="text-[#2B3467] text-xl">
              Vous pouvez répondre aux questions des quiz à l'aide de votre voix (en n'oubliant pas d'activer le micro !). Pour cela, deux manières possibles : soit en prononçant le nom de la réponse, soit en répondant par 1, 2, 3 ou 4 selon le nombre de réponses proposées.
            </p>

            <h3 class="text-2xl text-[#2B3467] font-semibold mb-1 mt-4">Confirmation avant de valider :</h3>
            <p class="text-[#2B3467] text-xl">
              Chaque action sera précédée par une boîte de confirmation afin d'éviter toute réponse non voulue. Vous n'aurez qu'à cliquer sur "oui" pour effectuer l'action ou "non" pour ne rien faire.
            </p>

            <h3 class="text-2xl text-[#2B3467] font-semibold mb-1 mt-4">Clics avec barre espace :</h3>
            <p class="text-[#2B3467] text-xl">
              Les clics de souris se retrouvent désactivés au profit de la barre espace avec laquelle vous serez en mesure de cliquer à la manière du clic gauche de votre souris.
            </p>
          </div>
        </div>
      `,
      showCancelButton: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      cancelButtonText:
        '<span style="font-size: 60px; padding: 56px 54px;">Fermer</span>',
      width: 1700, // add this line to set the width of the SweetAlert
      customClass: { container: 'z-50', popup: 'z-50' }, // add z-index to the popup class
    });
  }
}