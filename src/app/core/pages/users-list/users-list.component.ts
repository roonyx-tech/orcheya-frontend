import {
  AfterViewInit, Component, ElementRef,
  OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User, Role, UserFilter } from '@models';
import { UsersListService, RolesService } from '../../services';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('input', { static: true }) private inputField: ElementRef;
  @ViewChild('form') private form: NgForm;

  public usersList: User[];
  public filter = new UserFilter();
  public roles: Role[];
  public showAchievements: any;
  public canLoadNext = false;
  public environment = environment.environment;

  private subscriptions = new Subscription();

  constructor(private usersListService: UsersListService,
              private rolesService: RolesService,
              private router: Router) {}

  ngOnInit() {
    this.showAchievements = localStorage.getItem('showAchievement');
    this.rolesService
      .getList()
      .subscribe(x => this.roles = x);

    this.usersListService
      .getUsersList(this.filter)
      .subscribe(data => {
        this.usersList = data.users;
        this.canLoadNext = true;
      });
  }

  ngAfterViewInit() {
    fromEvent(this.inputField.nativeElement, 'keyup')
      .pipe (
        debounceTime(1000), // only search after 250 ms
        distinctUntilChanged(),
        switchMap(() => this.usersListService.getUsersList(this.filter)),
      )
      .subscribe(data => this.usersList = data.users);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public onRoleChanged(): void {
    this.filter.page = 1;
    this.filter.roleIs = this.form.controls.role.value;

    this.usersListService
      .getUsersList(this.filter)
      .subscribe(data => this.usersList = data.users);
  }

  public onButtonClick() {
    this.filter.page = 1;

    this.usersListService
      .getUsersList(this.filter)
      .subscribe(data => this.usersList = data.users);
  }

  public onSearchDelay() {
    this.filter.page = 1;
  }

  public onIntersection({ visible }) {
    if (visible) {
      this.filter.page += 1;
      this.usersListService
        .getUsersList(this.filter)
        .subscribe(
          data => {
            if (this.usersList) {
              this.usersList = [...this.usersList, ...data.users];
            } else {
              this.usersList = data.users;
            }
          }
        );
    }
  }

  public showProfile(id: number): void {
    this.router.navigate(['/user-profile', id]);
  }
}
