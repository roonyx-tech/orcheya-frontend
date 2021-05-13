import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-worklog-progressbar',
  templateUrl: './worklog-progressbar.component.html',
  styleUrls: ['./worklog-progressbar.component.scss']
})
export class WorklogProgressbarComponent implements OnInit, OnChanges {

  @Input() worked: number;
  @Input() plan: number;
  public stacked: Array<{ value: number, type?: string }>;
  public maximum = 100;

  constructor() {
  }

  ngOnInit() {
    this.calcStacked();
  }

  ngOnChanges(): void {
    this.calcStacked();
  }

  getClass(): string {
    return this.worked < this.plan ? 'danger' : 'success';
  }

  private calcStacked(): void {
    this.maximum = Math.max(this.worked, this.plan);
    this.stacked = [];
    if (this.worked < this.plan) {
      this.stacked.push({ value: this.worked, type: 'danger' });
    } else {
      this.stacked.push({ value: this.plan, type: 'info' });
      this.stacked.push({ value: this.worked - this.plan, type: 'success' });
    }
  }
}
