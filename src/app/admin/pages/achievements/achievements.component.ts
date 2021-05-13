import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AchievementEditComponent } from '../../components';
import { AchievementsService } from '@admin-services';
import { Subject } from 'rxjs';
import { Achievement } from '@models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
})
export class AchievementsComponent implements OnInit, OnDestroy {
  public achievements: Achievement[];
  private destroy$ = new Subject();

  constructor(
    public modalService: BsModalService,
    private achievementsService: AchievementsService
  ) { }

  ngOnInit() {
    this.achievementsService.getAchievements()
      .pipe(takeUntil(this.destroy$))
      .subscribe((achievements: Achievement[]) => this.achievements = achievements);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addAchievement(): void {
    const initialState = { achievement: new Achievement(), type: 'add' };
    const modal = this.modalService.show(AchievementEditComponent, { initialState });

    modal.content.onAchievementUpdate.subscribe((achievement) => {
      this.achievements.unshift(achievement);
      modal.hide();
    });
  }

  public editAchievement(achievement: Achievement): void {
    const initialState = { achievement, type: 'edit' };
    const modal = this.modalService.show(AchievementEditComponent, { initialState });

    modal.content.onAchievementUpdate.subscribe((data) => {
      this.achievements.splice(this.achievements.indexOf(achievement), 1, data);
      modal.hide();
    });
  }

  public deleteAchievement(achievement: Achievement): void {
    if (confirm(`Do you really want to delete the achievement (${achievement.title})?`)) {
      this.achievementsService.deleteAchievement(achievement)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.achievements.splice(this.achievements.findIndex((t) => t === achievement), 1);
        });
    }
  }

}
