import {
  Component,
  ElementRef,
  Input,
  OnChanges,
} from '@angular/core';

import { BaseType, select, Selection } from 'd3-selection';
import { timeMonths, timeWeek, timeDays } from 'd3-time';
import { timeFormat } from 'd3-time-format';

import { TimeActivity } from '../../models';

interface DayData {
  date: Date;
  time: number;
}

interface ColorData {
  color: string;
  range: {
    from: number;
    to: number;
  };
}

@Component({
  selector: 'app-time-activity',
  template: ``,
  styleUrls: ['./time-activity.component.scss']
})
export class TimeActivityComponent implements OnChanges {
  @Input() private activityData: TimeActivity[];
  private activityDataCopy: TimeActivity[];
  private dateFrom: Date;
  private dateTo: Date;
  private width = '100%';
  private params = {
    cellSize: 12,
    cellSizeForCircle: 6,
    textWeeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dateFrom: null,
    dateTo: null,
    text: {
      emptyTime: 'No worklogs',
      datePrefix: 'on',
    },
    colors: [
      { color: '#ECEFF1', range: { to: 9 } },
      { color: '#BED3FF', range: { from: 10, to: 179 } },
      { color: '#94B7FF', range: { from: 180, to: 299 } },
      { color: '#6A9CFF', range: { from: 300, to: 419 } },
      { color: '#4180FF', range: { from: 420, to: 719 } },
      { color: '#165FF3', range: { from: 720 } },
    ]
  };
  private d3Elements: {
    parent?: Selection<HTMLElement, any, null, undefined>,
    wrapper?: Selection<HTMLElement, any, null, undefined>,
    tooltip?: Selection<BaseType, any, null, undefined>,
    tooltipTime?: Selection<BaseType, any, null, undefined>,
    tooltipDate?: Selection<BaseType, any, null, undefined>,
    svg?: Selection<SVGSVGElement, any, null, undefined>,
    canvas?: Selection<SVGSVGElement, any, null, undefined>,
    gWeeks?: Selection<SVGSVGElement, any, null, undefined>,
    weeks?: Selection<BaseType, any, BaseType, undefined>,
    gMonths?: Selection<SVGSVGElement, any, null, undefined>,
    months?: Selection<BaseType, any, BaseType, undefined>,
    gDays?: Selection<SVGSVGElement, any, null, undefined>,
    days?: Selection<BaseType, any, BaseType, undefined>,
  } = {};
  private dataCount = false;
  private updateWithTimer = false;

  constructor(
    element: ElementRef,
  ) {
    this.d3Elements.parent = select(element.nativeElement)
      .append('div');
  }

  ngOnChanges(changes) {
    if (changes.activityData && changes.activityData.firstChange) {
      this.init();
    }
    if (changes.activityData && changes.activityData.currentValue) {
      this.changeData();
    }
  }

  private init() {
    this.d3Elements.parent
      .attr('class', 'time-activity-wrapper')
      .attr('style', `width: ${this.width}`);
    this.setParamsDate();
  }

  private changeData() {
    if (this.dataCount) {
      this.d3Elements.wrapper.remove();
    }
    this.updateWithTimer = !!this.activityData.find(x => x.time > 0);
    this.dataCount = true;
    this.activityDataCopy = [...this.activityData];
    this.initD3Logic();
  }

  private setParamsDate() {
    let dateFrom: Date = null;
    if (this.dateFrom) {
      dateFrom = this.dateFrom;
    } else {
      dateFrom = new Date();
      dateFrom.setFullYear(dateFrom.getFullYear() - 1);
    }

    if (dateFrom.getDay() !== 0) {
      dateFrom.setDate(dateFrom.getDate() - dateFrom.getDay() - 1);
    } else {
      dateFrom.setDate(dateFrom.getDate() - 1);
    }

    this.params.dateFrom = dateFrom;
    this.params.dateTo = this.dateTo ?  this.dateTo : new Date();
  }

  private initD3Logic() {
    this.defineWrapper();
    this.defineTooltip();
    this.defineSvg();
    this.defineCanvas();
    this.defineWeeks();
    this.defineMonths();
    this.defineDays();
  }

  private defineWrapper() {
    this.d3Elements.wrapper = this.d3Elements.parent
      .append('div');

    this.d3Elements.wrapper
      .attr('class', 'calendar');
  }

  private defineTooltip() {
    this.d3Elements.tooltip = this.d3Elements.wrapper
      .append('div')
      .attr('class', 'tooltip');

    this.d3Elements.tooltipTime = this.d3Elements.tooltip
      .append('p')
      .attr('class', 'time');


    this.d3Elements.tooltipDate = this.d3Elements.tooltip
      .append('p')
      .attr('class', 'date');
  }

  private defineSvg() {
    this.d3Elements.svg = this.d3Elements.wrapper
      .append('svg');
  }

  private defineCanvas() {
    this.d3Elements.canvas = this.d3Elements.svg
      .append('g');

    this.d3Elements.canvas
      .attr('class', 'canvas')
      .attr('transform', `translate(20, 15)`);
  }

  private defineWeeks() {
    const calcTranslate = (d: any, i: number): string => (
      `translate(-15, ${++i * this.params.cellSize - 3})`
    );
    const filterWeeks = (week: string): string => (
      (week === 'Mon' || week === 'Wed' || week === 'Fri' ) ? week : ''
    );

    this.d3Elements.gWeeks = this.d3Elements.canvas
      .append('g');

    this.d3Elements.weeks = this.d3Elements.gWeeks
      .attr('class', 'weeks')
      .selectAll('.week')
        .data(this.params.textWeeks)
        .enter()
        .append('text')
          .attr('class', 'week')
          .attr('transform', calcTranslate)
          .text(filterWeeks);
  }

  private getMonths(): Date[] {
    const months = timeMonths(this.params.dateFrom, this.params.dateTo);
    if (new Date().getDate() > 15) {
      return months;
    }

    const lastMonth = months.pop();
    lastMonth.setFullYear(lastMonth.getFullYear() - 1);
    months.unshift(lastMonth);
    return months;
  }

  private defineMonths() {
    const months = this.getMonths();
    const formatDate = (date: Date): string => timeFormat('%b')(date);
    const calcX = (date: Date): number => {
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const totalWeeks = timeWeek.count(this.params.dateFrom, nextMonth);
      const countWeeksInMonth = timeWeek.count(date, nextMonth);
      const offset = countWeeksInMonth === 4
        ? this.params.cellSize * 2
        : this.params.cellSize * 2.5;

      return totalWeeks * this.params.cellSize - offset;
    };

    this.d3Elements.gMonths = this.d3Elements.canvas
      .append('g');

    this.d3Elements.weeks = this.d3Elements.gMonths
      .attr('class', 'months')
      .selectAll('.month')
        .data(months)
        .enter()
        .append('text')
          .attr('class', 'month')
          .attr('x', calcX)
          .attr('y', '-5')
          .text(formatDate);
  }

  private defineDays() {
    let weekCounter = 0;
    const that = this;
    const getTime = (strDate: string): number => {
      const i = this.activityDataCopy.findIndex(d => (
        d.date === strDate
      ));

      if (i !== -1) {
        const time = this.activityDataCopy[i].time;
        this.activityDataCopy.splice(i, 1);
        return time;
      }
    };
    const data = ((): DayData[] => {
      const allDays = timeDays(this.params.dateFrom, this.params.dateTo);

      return allDays.map((day: Date): DayData => {
        const strDate = timeFormat('%Y-%m-%d')(day);
        return { date: day, time: getTime(strDate) };
      });
    })();
    const calcX = (d: DayData): number => {
      const week = d.date.getDay();
      if (weekCounter === 0 && week !== 0) {
        weekCounter = 1;
      } else if (week === 0) {
        ++weekCounter;
      }

      return weekCounter * this.params.cellSize;
    };
    const calcY = (d: DayData): number => (
      d.date.getDay() * this.params.cellSize
    );
    const getColor = (d: DayData): string => {
      const time = d.time ? d.time : 0;
      return (this.params.colors
        .find((color: ColorData) => (
          (!color.range.from || color.range.from <= time) &&
          (!color.range.to || color.range.to >= time)
        )))
        .color;
    };
    const mouseOverHandler = function(d: DayData): void {
      let x = +(this as HTMLElement).getAttribute('x');
      if (!x) {
        x = +(this as HTMLElement).getAttribute('cx') - that.params.cellSizeForCircle;
      }
      let y = +(this as HTMLElement).getAttribute('y');
      if (!y) {
        y = +(this as HTMLElement).getAttribute('cy') - that.params.cellSizeForCircle;
      }
      // 15 - 45% height of tooltip; 22 - height of tooltip bot arrow + padding
      const top = y - 15 - 22;
      // 25 - calendar padding + width of weeks; 75 - 45% width of tooltip
      const left = x + 25 - 75;
      const strDate = timeFormat('%b %d, %Y')(d.date);
      const getTooltipTime = (time: number): string => {
        if (!time) {
          return that.params.text.emptyTime;
        }

        const hours = Math.floor(time / 60);
        const minutes = time % 60;

        return `${hours}h ${minutes}m`;
      };

      that.d3Elements.tooltip
        .attr('style', `top: ${top}px; left: ${left}px`)
        .attr('class', 'tooltip show');

      that.d3Elements.tooltipTime
        .text(getTooltipTime(d.time));

      that.d3Elements.tooltipDate
        .text(`${that.params.text.datePrefix} ${strDate}`);
    };

    this.d3Elements.gDays = this.d3Elements.canvas
      .append('g');

    this.d3Elements.days = this.d3Elements.gDays
      .attr('class', 'days')
      .selectAll('.day')
        .data(data)
        .enter()
        .append('rect');

    this.d3Elements.days
      .attr('class', 'day')
      .attr('width', this.params.cellSize)
      .attr('height', this.params.cellSize)
      .attr('x', calcX)
      .attr('y', calcY)
      .attr('fill', getColor)
      .on('mouseover', mouseOverHandler)
      .on('mouseout', () => this.d3Elements.tooltip.attr('class', 'tooltip'));

    const dotes = this.d3Elements.gDays
      .attr('class', 'days')
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle');

    weekCounter = 0;

    const isExist = (d: DayData) => {
      let str;
      const date = timeFormat('%Y-%m-%d')(d.date);
      const find = this.activityData.find(x => x.date === date);
      if (find && find.update) {
        str = '#000';
      } else {
        str = 'transparent';
      }
      return str;
    };

    dotes
      .attr('class', 'dot')
      .attr('width', this.params.cellSize)
      .attr('height', this.params.cellSize)
      .attr('cx', (d) => calcX(d) + this.params.cellSizeForCircle)
      .attr('cy', (d) => calcY(d) + this.params.cellSizeForCircle)
      .attr('r', 2)
      .attr('fill', isExist)
      .on('mouseover', mouseOverHandler)
      .on('mouseout', () => this.d3Elements.tooltip.attr('class', 'tooltip'));
  }
}
