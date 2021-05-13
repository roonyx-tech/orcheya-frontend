import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { UsersListService } from '../../services';

@Component({
  selector: 'app-skill-comments',
  templateUrl: './skill-comments.component.html',
  styleUrls: ['./skill-comments.component.scss']
})
export class SkillCommentsComponent implements OnInit {
  @Input() public comment: string;
  @Input() public approver: number;
  @Output() public closeComment: EventEmitter<void> = new EventEmitter();

  public author: string;

  constructor(private usersListService: UsersListService) { }

  ngOnInit() {
    this.usersListService.getUserById(this.approver)
      .subscribe(user => this.author = user.fullName);
  }

  public handleCloseComment() {
    this.closeComment.emit();
  }
}
