import { Component, OnInit, OnChanges, AfterViewInit, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from 'src/app/data/data.model';
import { transition } from 'd3';

@Component({
  selector: 'app-bar-chart',  
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges { // AfterViewInit
  // Angular 8 ViewChild takes 2 parameters: https://stackoverflow.com/questions/56704164/angular-viewchild-error-expected-2-arguments-but-got-1
  // If the element needs to be available during ngOnInit, then static needs to be true, 
  // but if it can wait until after the init it can be false, which means it won't be available until ngAfterViewInit/ngAfterContentInit.
  // 
  // static - True to resolve query results before change detection runs, false to resolve after change detection.
  @ViewChild('chart', {static: true}) 
  private chartContainer: ElementRef;

  @Input()
  data: DataModel[];

  margin = {top: 20, right: 20, bottom: 30, left: 40};

  constructor() {
    
  }  

  ngOnChanges(): void {
    if (!this.data) { 
      return; //exit
    } 

    console.log('BarChartComponent ngOnChanges data', this.data)
    this.createChart(); 
  }

  ngOnInit(): void {
    if (!this.data) { 
      return; //exit
    } 

    console.log('BarChartComponent OnInit data', this.data)
    this.createChart(); 
  }

  onResize() {
    if (!this.data) { 
      return;
    } 

    this.createChart();
  }
 
  private createChart(): void {
    // Remove previous SVG graph
    console.log('Remove previous SVG')
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    
    // Find max number of confirmed cases to set corresponding max height of graph
    const numconfMax = this.data.map( d => d.numconf )
      .reduce( function (a, b){
          return Math.max(a, b);
      }); 

    // Append SVG to DOM
    console.log('Append SVG to DOM')
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
      .domain( this.data.map(d => d.date) );

    // Y axis range function
    const y = d3.scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain( [0, numconfMax] ); // [0, d3.max(data, d => d.numconf)]

    // Append Graph
    console.log('Append Graph to SVG')
    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // X axis
    console.log('Create X axis')
    g.append('g').attr('class', 'axis axis--x')      
        .transition().duration(600)
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    // Y axis
    console.log('Create Y axis')
    g.append('g').attr('class', 'axis axis--y')
      .call(d3.axisLeft(y)) // d3.axisLeft(y).ticks(10, '%')
      .append('text')      
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Confirmed Cases');

    // Bar chart columns
    console.log('Create Bars')
    g.selectAll('.bar').data(this.data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.date))
      .attr('y', d => y(d.numconf))  
      .attr('width', x.bandwidth())      
         .transition().duration(600)
      .attr('height', d => contentHeight - y(d.numconf));
  }
}
