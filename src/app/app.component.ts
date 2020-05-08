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
export class AppComponent { // implements OnChanges, OnInit
  data: Promise<any>; // Array<any>, Observable<DataModel>
  provinceID: number;
  // dataOfProvince: Array<DataModel>;
  csvUrl: string = 'https://health-infobase.canada.ca/src/data/covidLive/covid19.csv';  
  csvUrlWithProxy: string = `https://cors-anywhere.herokuapp.com/${ this.csvUrl }`;
  localCsv: string = './assets/covid19.csv';
  loading: boolean;
  
  constructor( private http: HttpClient ) {
    console.log('AppComponent 0 constructor');
  }

  /*
  ngOnChanges( changes: {[propKey: string]: SimpleChange }): void {    
    console.log('AppComponent changes', changes)
    if( this.provinceID ){
      console.log('AppComponent 1 ngOnChanges this.data has NEW content', this.data)
      this.getData();    
    }
  }
  */
  
  /*
  ngOnInit() {
    console.log('AppComponent 2 ngOnInit loading intially', this.loading)

    if( this.provinceID ){
      this.getData();
      console.log('AppComponent ngOnInit data intially', this.data)    
    }
  }
  */
  
  getData(): void {
    const self = this; // 'this' context changes within d3.csv() function
    this.loading = true;
    console.log('AppComponent getData this.loading set to true', this.loading)
    console.log('AppComponent getData this.data before csv()', this.data)

    // using cors-anywhere as a proxy to access the external CSV file
    // d3.csv returns a promise, so needs a return statement inside
    /*
    this.data = d3.csv( this.localCsv ) // this.csvUrlWithProxy
      .then( function (data){
        console.log('AppComponent covid CSV data is', data);  
        console.log('TYPE OF CSV DATA', typeof(data) )
                
        // show BC initially
        // self.loading = false; // needs to happen AFTER this.data is set
        return data.filter( d => parseInt(d.pruid)==self.provinceID );
      });
    */

    this.data = d3.csv( this.localCsv ) // this.csvUrlWithProxy
      .then( function (data){
        console.log('AppComponent covid CSV data is', data);  
        console.log('AppComponent TYPE OF CSV DATA', typeof(data) )
                
        // show BC initially
        console.log('AppComponent csv() self.provinceID', self.provinceID)
        const objs = data.filter( d => parseInt(d.pruid)==self.provinceID );        
        return objs;        
      })
      .finally( function (){
        console.log('AppComponent csv() self.data!!!!', self.data)
        self.loading = false;
      });
    
    /*
    this.http.get( this.localCsv, {responseType: 'text'} ).subscribe( data => {
        var objs = d3.csvParse(data);
        return objs;
    });
    */

  }

  onSelect( id: string ) {
    this.provinceID = parseInt( id );
    console.log('AppComponent onSelect provinceID', this.provinceID)   

    this.getData();
  }
}
