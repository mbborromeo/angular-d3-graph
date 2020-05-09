import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataModel } from './data/data.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data: Promise<any>; // Array<any>, Observable<DataModel>
  provinceID: number;
  csvUrl: string = 'https://health-infobase.canada.ca/src/data/covidLive/covid19.csv';  
  csvUrlWithProxy: string = `https://cors-anywhere.herokuapp.com/${ this.csvUrl }`;
  localCsv: string = './assets/covid19.csv';
  dataLoading: boolean;
  
  constructor( private http: HttpClient ) {
  }
  
  getData(): void {
    const self = this; // 'this' context changes within d3.csv() function
    this.dataLoading = true;
    console.log('AppComponent getData this.dataLoading set to true', this.dataLoading)
    console.log('AppComponent getData this.data before csv()', this.data)

    // using cors-anywhere as a proxy to access the external CSV file
    // d3.csv returns a promise, so needs a return statement inside
    this.data = d3.csv( this.csvUrlWithProxy ) // this.localCsv
      .then( function (data){
        console.log('AppComponent covid CSV data is', data);  
        console.log('AppComponent TYPE OF CSV DATA', typeof(data) )
                
        // show data of selected province
        console.log('AppComponent csv() self.provinceID', self.provinceID)
        const objs = data.filter( d => parseInt(d.pruid)==self.provinceID );        
        return objs;        
      })
      .finally( function (){
        console.log('AppComponent csv() self.data!!!!', self.data)
        self.dataLoading = false;
      });
  }

  /* receive Event Emitter from province-select.component.ts: onChange/this.selected.emit() */
  onSelect( id: string ) {
    this.provinceID = parseInt( id );
    console.log('AppComponent onSelect provinceID', this.provinceID)   

    this.getData();
  }
}
