import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable, forkJoin } from 'rxjs';
import { User } from '../models/user.model';
import { Resident } from '../models/resident.model';
import { serverUrl, httpOptionsBase } from '../configs/server.config';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = serverUrl + '/users';
  private residentUrl = serverUrl + '/residents';
  private httpOptions = httpOptionsBase;
  private users: User[] = [];
  private residents: Resident[] = [];
  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public residents$: BehaviorSubject<Resident[]> = new BehaviorSubject<
    Resident[]
  >([]);

  constructor(private http: HttpClient, private router: Router) {
    this.retrieveUsers();
    this.retrieveResidents();
  }

  retrieveUsers(): void {
    this.http.get<User[]>(this.userUrl).subscribe({
      next: (userList) => {
        this.users = userList;
        this.users$.next(this.users);
      },
      error: (error) => {
        console.error('Failed to retrieve users', error);
      },
      complete: () => {
        console.log('User retrieval completed');
      },
    });
  }

  retrieveResidents(): void {
    this.http.get<Resident[]>(this.residentUrl).subscribe({
      next: (residentList) => {
        this.residents = residentList;
        this.residents$.next(this.residents);
      },
      error: (error) => {
        console.error('Failed to retrieve residents', error);
      },
      complete: () => {
        console.log('Resident retrieval completed');
      },
    });
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.userUrl, user, this.httpOptions);
  }

  addResident(resident: Resident): Observable<Resident> {
    return this.http.post<Resident>(
      this.residentUrl,
      resident,
      this.httpOptions
    );
  }

  createResident(resident: Resident, user: User): void {
    forkJoin([
      //create both resident and user or none
      this.addUser(user),
      this.addResident(resident),
    ]).subscribe({
      next: ([addedUser, addedResident]) => {
        console.log('Both user and resident were added successfully');
        this.users.push(addedUser);
        this.users$.next(this.users);
        this.residents.push(addedResident);
        this.residents$.next(this.residents);
      },
      error: (error) => {
        console.error('Failed to create resident', error);
      },
      complete: () => {
        console.log('Resident creation completed');
      },
    });
  }

  getPhotoUrl(user: User) {
    if (user.avatar == undefined) {
      return 'assets/user.png'; //TODO: path works?
    } else return user.avatar;
  }
}