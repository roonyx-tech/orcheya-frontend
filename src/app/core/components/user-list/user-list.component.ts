import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';
import { AchievementUser } from '@models';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  @Input() public showAchievements: string;
  @Input() public userList: Array<User>;
  @Output() public userClicked = new EventEmitter<User>();

  constructor() { }

  public onClick(user): void {
    this.userClicked.emit(user);
  }

  public generationGradient(achievement: AchievementUser): string {
    return `radial-gradient(100% 100% at 0% 0%, ${achievement.color} 0%, ${achievement.secondColor} 40%, ${achievement.thirdColor} 100%)`;
  }
}
