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
  data$: Promise<any>; // Array<any>, Observable<DataModel>
  dataFetched: Array<any>;
  provinceID: string; // number  
  dataTypeID: string;  
  csvUrl: string = 'https://health-infobase.canada.ca/src/data/covidLive/covid19.csv';  
  csvUrlWithProxy: string = `https://cors-anywhere.herokuapp.com/${ this.csvUrl }`;
  localCsv: string = './assets/covid19.csv';
  dataLoading: boolean;  
  
  constructor() { // private http: HttpClient 

  }

  // receive Event Emitter from child province-select.component.ts: onChange/emit()
  onProvinceSelect( id: string ) {
    this.provinceID = id; // parseInt( id ) 
  }

  onDataTypeSelect( id: string ) {
    this.dataTypeID = id; // parseInt( id ) 
  }
  
  getData(): void {
    const self = this; // 'this' context changes within d3.csv() function
    this.dataLoading = true;

    // using cors-anywhere as a proxy to access the external CSV file
    // d3.csv returns a promise, so needs a return statement inside    
    this.data$ = d3.csv( this.csvUrlWithProxy ) // this.localCsv
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
