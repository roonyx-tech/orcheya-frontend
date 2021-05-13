import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Dash, ProjectsTableRow, UsersTableRow } from '../../models';
import { ServiceLoadResponse } from '../../services';

const colors = ['#fff3f3', '#f3fff3', '#f3f3ff'];

interface PlotBand {
  from: number;
  to: number;
  color: string;
}

@Component({
  selector: 'app-chart-service',
  templateUrl: './chart-service.component.html',
  styleUrls: ['./chart-service.component.scss']
})
export class ChartServiceComponent  {
  @Input() public chartPie = false;
  public Highcharts = Highcharts;
  public chart;
  public projectByHours;
  public projectByPeople;
  public chartOptions;
  public isLoading = false;
  public dash: Dash;

  constructor() { }

  protected initGraph(dataChart: ServiceLoadResponse): void {
    this.dash = dataChart.dash;
    if (this.chartPie) {
      this.projectByHours = this.getChartLoad('Projects by hours', dataChart.projectsTable);
      this.projectByPeople = this.getChartLoad('People by paid projects', dataChart.usersTable);
    }
    const max = Math.max(
      ...dataChart.loadTable.map(
        x => Math.round((x.plan / 3600) * 100) / 100
      )
    );
    this._removePlotBand();
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text : 'Service load'
      },
      legend: {
        enabled: true
      },
      tooltip: {
        useHTML: true,
        shared: true
      },
      yAxis: [{
        visible: false,
        title: {
          text: 'Percent'
        },
        labels: {
          formatter() {
            return this.value + '%';
          }
        },
        min: 0,
        max: 100
      }, {
        visible: false,
        title: {
          text: 'Hours'
        },
        labels: {
          formatter() {
            return this.value + 'h';
          }
        },
        min: 0,
        max,
        endOnTick: false,
        opposite: true
      }],
      xAxis: {
        categories: dataChart.datesData,
        plotBands: this._getPlotBands(dataChart.datesData, dataChart.step)
      },
      plotOptions: {
        column: {
          grouping: false,
          shadow: false,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Load real, %',
        data: dataChart.loadTable.map(x => x.percent),
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}'
        },
        color: 'rgb(124, 181, 236)',
        pointPadding: 0.3,
        pointPlacement: -0.2
      }, {
        name: 'Time plan, h',
        data: dataChart.loadTable.map(x => Math.round((x.plan / 3600) * 100) / 100),
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}'
        },
        color: 'rgba(67, 67, 72, .3)',
        pointPadding: 0.3,
        pointPlacement: 0.2,
        yAxis: 1
      }, {
        name: 'Time real, h',
        data: dataChart.loadTable.map(x => Math.round((x.real / 3600) * 100) / 100),
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}'
        },
        color: 'rgb(67, 67, 72)',
        pointPadding: 0.3,
        pointPlacement: 0.2,
        yAxis: 1
      }]
    };
  }

  private setChartData(data: Array<any>, nameChart: string): Array<any> {
    const other = data.splice( 5, data.length);
    if (nameChart === 'Projects by hours') {
      data.push({ name: 'Other', time: other.map(item => item.time).reduce((prev, curr) => prev + curr, 0)});
      return data.map(project => {
        return { name: project.name, y: Math.round((project.time / 3600) * 100) / 100 };
      });
    } else {
      data.push({ name: 'Other', surname: '', paid: other.map(item => item.paid).reduce((prev, curr) => prev + curr, 0)});
      return data.map(user => {
        return { name: `${user.name} ${user.surname}`, y: user.paid };
      });
    }
  }

  private getChartLoad(nameChart: string, projects: Array<ProjectsTableRow | UsersTableRow>): object {
    return  {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: { text: nameChart },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
          showInLegend: true
        }
      },
      series: [{ colorByPoint: true, data: this.setChartData(projects, nameChart)}]
    };
  }

  private _getPlotBandsForMonth(datesData): Array<PlotBand> {
    const array: Array<PlotBand> = [];
    let i = 0;

    datesData.forEach((_, index) => {
      if (index === 0 || index % 3 === 0) {
        array.push({
          from: index - 0.5,
          to: index + 3.5,
          color: colors[i % 3]
        });
        i++;
      }
    });

    return array;
  }

  private _removePlotBand(): void {
    if (this.chart && this.chart.xAxis && this.chart.xAxis[0]) {
      this.chart.xAxis[0].removePlotBand();
    }
  }

  private _getPlotBands(datesData, step): Array<PlotBand> {
    let array: Array<PlotBand>;

    if (datesData.length > 4) {
      if (step === 'month') {
        array = this._getPlotBandsForMonth(datesData);
      }
      if (step === 'week') {
        array = this._getPlotBandsForWeek(datesData);
      }
    }

    return array;
  }

  private _getPlotBandsForWeek(datesData): Array<PlotBand> {
    const array: Array<PlotBand> = [];
    let i = 0;
    let start = -0.5;
    let stop: number;
    let prevMonth: string;

    datesData.forEach((d, index) => {
      const splitMonth = d.split(' - ');
      const fMonth = this._getMonthName(splitMonth[0]);
      const lMonth =  this._getMonthName(splitMonth[1]);
      const similarMonth = fMonth === lMonth;
      const month = similarMonth ? fMonth : lMonth;

      if (index === 0) {
        prevMonth = month;
      }
      if (month !== prevMonth) {
        stop = similarMonth ? index - 0.5 : index;
      }
      if (index === datesData.length - 1) {
        stop = index + 0.5;
      }

      prevMonth = month;

      if (stop) {
        array.push({
          from: start,
          to: stop,
          color: colors[i % 3]
        });
        i++;
        start = stop;
        stop = undefined;
      }
    });

    return array;
  }

  private _getMonthName(str: string): string {
    return str.match(/[A-z]+/)[0];
  }
}
