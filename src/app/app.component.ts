import { Component, OnInit, OnChanges, SimpleChange } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';
import { DataModel } from './data/data.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: Promise<any>; // Array<any>, Observable<DataModel>
  dataFetched: Array<any>;
  provinceID: string; // number  
  dataOfProvinceWeekly: Array<any>;
  csvUrl: string = 'https://health-infobase.canada.ca/src/data/covidLive/covid19.csv';  
  csvUrlWithProxy: string = `https://cors-anywhere.herokuapp.com/${ this.csvUrl }`;
  localCsv: string = './assets/covid19.csv';
  dataLoading: boolean;  
  
  constructor() { // private http: HttpClient 

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

  // show data of selected province and by week      
  getProvinceData(): void {
    const dataOfProvince = this.dataFetched.filter( d => d.pruid == this.provinceID ); // parseInt(d.pruid)   
    this.dataOfProvinceWeekly = this.filterDataAsWeekly( dataOfProvince );
  }

  // receive Event Emitter from province-select.component.ts: onChange/this.selected.emit()
  onSelect( id: string ) {
    this.provinceID = id; // parseInt( id ) 

    if( this.provinceID !== '' ){
      this.getProvinceData();
    }
  }
  
  getData(): void {
    const self = this; // 'this' context changes within d3.csv() function
    this.dataLoading = true;

    // using cors-anywhere as a proxy to access the external CSV file
    // d3.csv returns a promise, so needs a return statement inside    
    this.data = d3.csv( this.csvUrlWithProxy ) // this.localCsv
    .then( function (data){
      self.dataFetched = data; 
     
      return data;    
    })
    .finally( function (){            
      self.dataLoading = false;
    });
  }  

  ngOnInit(): void {
    this.getData();
  }
}
