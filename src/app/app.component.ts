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
  provinceOptionsArray: Array<any>;
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
  getFilteredData(): void {
    const dataOfProvince = this.dataFetched.filter( d => d.pruid == this.provinceID ); // parseInt(d.pruid)   
    this.dataOfProvinceWeekly = this.filterDataAsWeekly( dataOfProvince );
  }

  /* receive Event Emitter from province-select.component.ts: onChange/this.selected.emit() */
  onSelect( id: string ) {
    this.provinceID = id; // parseInt( id ) 

    if( this.provinceID !== '' ){
      this.getFilteredData();
    }
  }

  getProvinceOptions(): Array<any> {
    // create a new object which will contain only key/value pairs (so there will be no duplicate items)
    // iterate thru each row in data, and set object key to pruid, and set object value to prname
    const provinceNamesById = {}
    this.dataFetched.forEach( function (elem, i){
      provinceNamesById[elem.pruid] = elem.prname;
    });
    // { 43: 'Alberta', 55: 'British Columbia' }

    // then create a new array of all the objects converted to arrays of [key, value] elements, 
    const provinceArrayOfArrays = Object.entries( provinceNamesById );
    // [ [43, 'Alberta'], [55, 'British Columbia'] ]

    // then map it and extract the elements and turn it back into an array of objects of key/value pairs.
    // [ {pruid: 43, prname: 'Alberta'}, {pruid: 55, prname: 'British Columbia'} ]
    return provinceArrayOfArrays.map( ([ pruid, prname ]) => ({ pruid, prname }) );
  }

  /*
  getProvinceOptions(): void {
    // get unique provinces from data set
    // this.provinceUniqueIDs = [...new Set( this.data.map(d => d.pruid) )];    
    
    // this.provinceUniqueIDs = [      
    //   '59',
    //   '35'
    // ];
   
    // console.log('ProvinceSelectComponent 3 getProvinceData this.data BEFORE', this.data)
    
    // return a subset of complete data of only first index of unique IDs determined from previous step
    
    // this.provinceArray = this.data.filter(
    //   d => this.provinceUniqueIDs.indexOf( d.pruid ) > 0  // indexOf: if no match return -1, if match return index > 0
    // );
  }
  */
  
  getData(): void {
    const self = this; // 'this' context changes within d3.csv() function
    this.dataLoading = true;

    // using cors-anywhere as a proxy to access the external CSV file
    // d3.csv returns a promise, so needs a return statement inside    
    this.data = d3.csv( this.csvUrlWithProxy ) // this.localCsv
    .then( function (data){
      self.dataFetched = data;
      self.provinceOptionsArray = self.getProvinceOptions();    

      /*
      const provincesSubsetIdName = data.map( ({pruid, prname}) => ({pruid, prname}) );
      console.log('AppComponent csv() - provinceSubsetIdName', provincesSubsetIdName)

      const provincesData = [...new Set( provincesSubsetIdName )]; 
      console.log('AppComponent csv() - provincesData!!!!', provincesData) 
      
      const provincesUniqueIDs = [...new Set( data.map(d => d.pruid) )]; 
      // const provincesUniqueIDs = [...new Set( provincesSubsetIdName.map(d => d.pruid) )];  
      console.log('AppComponent csv() - provinceUniqueIDs', provincesUniqueIDs)  

      return a subset of complete data of only first index of unique IDs determined from previous step
      self.provinceOptionsArray = data.filter(
        d => provinceUniqueIDs.indexOf( d.pruid ) > 0  // indexOf: if no match return -1, if match return index > 0
      );

      // // Ref: https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array
      // // Problem is: this logic does not iterate over every item in provincesUniqueIDs.  
      // // It only iterates over every item in provincesSubsetIdName, but only checking for first value of provincesUniqueIDs.
      // self.provinceOptionsArray = provincesSubsetIdName.filter(
      //   p => {
      //     const index = provincesUniqueIDs.indexOf( p.pruid );
      //     console.log('p', p, '| p.pruid', p.pruid, '| index', index)
      //     let keepOrNot: boolean = false;
      //     if( index > 0 ){
      //       keepOrNot = true;
      //     } 
      //     console.log('keepOrNot', keepOrNot)
          
      //     return keepOrNot;
      //   }
      // );
      */
     
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
