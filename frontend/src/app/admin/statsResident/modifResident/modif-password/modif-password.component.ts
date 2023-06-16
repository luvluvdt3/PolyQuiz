import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { User } from 'src/models/user.model';
import Swal from 'sweetalert2';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-modif-password',
  templateUrl: './modif-password.component.html',
})
export class AdminModifPasswordComponent {
  @Input() user: User;

  public passwordForm: FormGroup;
  public submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.passwordForm = this.formBuilder.group(
      {
        newPassword: [
          '',
          [Validators.minLength(5), this.validatePasswordLength],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  public validatePasswordLength(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.value;
    if (password && password.length < 5) {
      return { passwordLength: true };
    }
    return null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword.value !== confirmPassword.value) {
      return { passwordMatch: true };
    }

    return null;
  }

  updateProfile() {
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return;
    }
    this.user.password = this.passwordForm.value.newPassword;
    this.userService.updateUser(this.user).subscribe((user) => {
      Swal.fire({
        title: 'Profil modifié',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      let dialog = document.getElementsByTagName('dialog');
      if (dialog) {
        for (let i = 0; i < dialog.length; i++) {
          dialog[i].close();
        }
      }
    });
  }
}
