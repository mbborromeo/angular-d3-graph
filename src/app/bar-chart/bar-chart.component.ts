import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from 'src/app/data/data.model';

@Component({
  selector: 'app-bar-chart',  
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  // Angular 8 ViewChild takes 2 parameters: https://stackoverflow.com/questions/56704164/angular-viewchild-error-expected-2-arguments-but-got-1
  @ViewChild('chart', {static: false})
  private chartContainer: ElementRef;

  @Input()
  data: DataModel[]; //array of DataModel objects

  margin = {top: 20, right: 20, bottom: 30, left: 40};

  constructor() {
    console.log('constructor BarChart')
  }

  ngOnChanges(): void {
    console.log('BarChart ngOnChanges!!!!')
    if (!this.data) { 
      console.log('this.data is empty', this.data)
      return; //exit
    } 
    
    console.log('this.data has content', this.data)
    this.createChart();    
  }

  onResize() {
    console.log('onResize')
    this.createChart();
  }

  private reformatDateYMD( dmy ): string {
    let newdate = dmy.split("-").reverse().join("-");
    return newdate;
  }

  private formatDateDMY( ymd ): string {
    let day = ymd.getDate();
    if( day < 10 ){
      day = '0' + day;
    }

    let month = ymd.getMonth() + 1;
    if( month < 10 ){
      month = '0' + month;
    }

    const year = ymd.getFullYear();

    const newdate = day + '-' + month + '-' + year;

    return newdate;
  }

  private filterDataAsWeekly( inputData ): Array<any> {
    // filter out dates so only every 7th
    const dateValuesOnly = inputData.map( d => this.reformatDateYMD(d.date) );

    const dateMin = dateValuesOnly.reduce( function (a, b) { return a<b ? a:b; } ); // Math.min.apply(null, dateValuesOnly)
    
    const dateMax = dateValuesOnly.reduce( function (a, b) { return a>b ? a:b; } ); // Math.max.apply(null, dateValuesOnly)
    
    const datesEvery7Days = d3.timeDay.every(7).range( new Date(dateMin), new Date(dateMax) );

    const datesEvery7DaysDMYarray = datesEvery7Days.map( i => this.formatDateDMY(i) );
    
    // works but for es7 only
    // const dataOnlyWithWeeklyDates = data.filter( function(item) {
    //   return datesEvery7DaysDMYarray.includes(item.date); 
    // });
    const dataOnlyWithWeeklyDates = inputData.filter( 
      d => datesEvery7DaysDMYarray.indexOf( d.date ) > 0  // indexOf: if no match return -1, if match return index > 0
    );

    return dataOnlyWithWeeklyDates;
  }

  private createChart(): void {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;

    const data = this.data;
    console.log('createChart data is ', data);

    const dataWeekly = this.filterDataAsWeekly( data );

    console.log('orig data', data)
    console.log('dataWeekly', dataWeekly)
    
    // find max number of confirmed cases to set corresponding max height of graph
    const numconfMax = dataWeekly.map( d => d.numconf )
      .reduce( function (a, b){
          return Math.max(a, b);
      }); 

    const svg = d3.select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', numconfMax); // element.offsetHeight

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom; // numconfMax - 

    const x = d3.scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain( dataWeekly.map(d => d.date) ); // d => d.prname

    const y = d3.scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain( [0, numconfMax] ); // [0, d3.max(data, d => d.numconf)]

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g').attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g').attr('class', 'axis axis--y')
      .call(d3.axisLeft(y)) // d3.axisLeft(y).ticks(10, '%')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Confirmed Cases');

    g.selectAll('.bar').data(dataWeekly)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.date)) // x(d.prname)
      .attr('y', d => y(d.numconf))
      .attr('width', x.bandwidth())
      .attr('height', d => contentHeight - y(d.numconf));
  }
}
