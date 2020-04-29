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
    // for testing only - delete this line after
    //this.createChart();
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

  private createChart(): void {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    const data = this.data;
    console.log('createChart data is ', data);
    const arrayOfNumconf = data.map( d => d.numconf );
    // 300, change to dynamic value using max
    const dataMaxValue = arrayOfNumconf.reduce( function (a, b){
        return Math.max(a, b);
    }); 

    const svg = d3.select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', dataMaxValue); // element.offsetHeight

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = dataMaxValue - this.margin.top - this.margin.bottom; // element.offsetHeight - 

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain( data.map(d => d.prname) ); // map so grouped together and displayed as one

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain( [0, dataMaxValue] ); // [0, d3.max(data, d => d.numconf)]

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y)) // d3.axisLeft(y).ticks(10, '%')
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Confirmed Cases');

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.prname))
        .attr('y', d => y(d.numconf))
        .attr('width', x.bandwidth())
        .attr('height', d => contentHeight - y(d.numconf));
  }

}
