import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SkillsService } from '../../services';
import { Skill, DifficultyLevel } from '../../models';

@Component({
  selector: 'app-skill-offer',
  templateUrl: './skill-offer.component.html',
  styleUrls: ['./skill-offer.component.scss']
})
export class SkillOfferComponent implements OnInit {
  @Input() public difficultyLevels: DifficultyLevel[];

  public form: FormGroup;
  private resErrors = {};
  public offeredSkill: string;

  constructor(private skillsService: SkillsService) { }

  ngOnInit() {
    this.initForm();
  }

  public initForm(): void {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      difficultyLevelId: new FormControl('', [Validators.required]),
      variants: new FormControl()
    });
  }

  public onSubmit(): void {
    const offer: Skill = new Skill();
    Object.assign(offer, this.form.value);
    this.offerSkill(offer);
    this.form.reset();
  }

  public offerSkill(offer: Skill): void {
    this.skillsService.createOfferToAddSkill(offer)
      .subscribe(res => this.offeredSkill = offer.title);
  }

  public textError(controlName: string): string {
    if (!this.hasError(controlName)) {
      return '';
    }
    if (this.resErrors[controlName]) {
      return this.resErrors[controlName];
    }
    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors.required) {
        return `is required`;
      }
    }
  }

  public hasError(controlName: string): boolean {
    return (
      (
        this.form.get(controlName).dirty && this.form.get(controlName).invalid
      ) || this.resErrors[controlName]
    );
  }
}
