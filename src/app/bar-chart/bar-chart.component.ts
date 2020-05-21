import { Component, OnChanges, OnInit, AfterViewInit, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from 'src/app/data/data.model';
import { transition } from 'd3';

@Component({
  selector: 'app-bar-chart',  
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges, OnInit { // AfterViewInit
  // Angular 8 ViewChild takes 2 parameters: https://stackoverflow.com/questions/56704164/angular-viewchild-error-expected-2-arguments-but-got-1
  // If the element needs to be available during ngOnInit, then static needs to be true, 
  // but if it can wait until after the init it can be false, which means it won't be available until ngAfterViewInit/ngAfterContentInit.
  // 
  // static - True to resolve query results before change detection runs, false to resolve after change detection.
  @ViewChild('chart', {static: true}) 
  private chartContainer: ElementRef;

  @Input()
  data: DataModel[];

  @Input()
  dataType: string;

  @Input()
  provinceTag: string;

  margin = {top: 20, right: 20, bottom: 30, left: 60};

  dataOfProvinceWeekly: Array<any>;

  constructor() {
    
  }  

  reformatDateYMD( dmy ): string {
    let newdate = dmy.split("-").reverse().join("-");
    return newdate;
  }

  formatDateDMY( ymd ): string {
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

  // filter out dates so only every 7th day
  filterDataAsWeekly( inputData ): Array<any> {    
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

  // move this into BarChart component so filtering happens there.
  // show data of selected province and by week      
  getFilteredData(): void {
    const dataOfProvince = this.data.filter( d => d.pruid == this.provinceTag ); // parseInt(d.pruid)   
    this.dataOfProvinceWeekly = this.filterDataAsWeekly( dataOfProvince );
  }

  private createChart(): void {
    // filter out data type and province selection
    this.getFilteredData();

    // Remove previous SVG graph
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    
    // Find max number of confirmed cases to set corresponding max height of graph
    // element of interest = dataType
    const valueMax = this.dataOfProvinceWeekly.map( d => d[this.dataType] ) // d => d.numconf
      .reduce( function (a, b){
          return Math.max(a, b);
      });
  
    // Append SVG to DOM
    //console.log('Append SVG to DOM')
    const svg = d3.select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // Determine overall graph dimensions
    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    // X axis range function
    const x = d3.scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain( this.dataOfProvinceWeekly.map(d => d.date) );

    // Y axis range function
    const y = d3.scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain( [0, valueMax] ); // [0, d3.max(data, d => d.numconf)]

    // Append Graph
    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // X axis
    g.append('g').attr('class', 'axis axis--x')
      .attr('class', 'domain')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // Y axis
    g.append('g').attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).tickSizeOuter(0)) // d3.axisLeft(y).ticks(10, '%')
      .append('text')      
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Confirmed Cases');

    // Bar chart columns
    g.selectAll('.bar').data(this.dataOfProvinceWeekly)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.date))
      .attr('y', d => y( d[this.dataType] ))  // y(d.numconf)
      .attr('width', x.bandwidth())      
         .transition().duration(600)
      .attr('height', d => contentHeight - y( d[this.dataType] )); // y(d.numconf)
  }

  ngOnChanges(): void {
    if (!this.data || !this.dataType || !this.provinceTag) { 
      return; //exit
    } 

    this.createChart(); 
  }

  ngOnInit(): void {
    if (!this.data || !this.dataType || !this.provinceTag) { 
      return; //exit
    } 

    this.createChart(); 
  }

  /*  
  ngAfterViewInit(): void {
    if (!this.data) { 
      return; //exit
    } 

    this.createChart(); 
  }
  */

  onResize() {
    if (!this.data || !this.dataType || !this.provinceTag) { 
      return;
    } 

    this.createChart();
  }
}
