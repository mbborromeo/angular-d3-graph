import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataModel } from './data/data.model';
import * as d3 from 'd3';
// import * as dsv from 'd3-dsv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data: any; // : Observable<DataModel>
  csvUrl: string = 'https://health-infobase.canada.ca/src/data/covidLive/covid19.csv';

  constructor(private http: HttpClient) {
    console.log('AppComponent constructor here!!!!');    

    const BC_ID: number = 59;
    // const CANADA_ID: number = 1;    
    // const REPAT_TRVLRS_ID: number = 99;
    // let dateOfInterest: string = '21-03-2020'; // ''

    // using cors-anywhere as a proxy to access the external CSV file
    // d3.csv returns a promise, so needs a return statement inside
    this.data = d3.csv(`https://cors-anywhere.herokuapp.com/${ this.csvUrl }`)
      .then( function (data){
        console.log('covid CSV data is', data);

        //dateOfInterest = '21-03-2020';
        
        // filter: remove Canada and Repatriated Travellers, and specify date of interest
        //return data.filter(d => d.date==dateOfInterest && parseInt(d.pruid)!==CANADA_ID && parseInt(d.pruid)!==REPAT_TRVLRS_ID );
        // var i = d3.timeDay.filter(function(d) { return (d.getDate() - 1) % 10 === 0; });
        return data.filter( d => parseInt(d.pruid)===BC_ID ); 
                
      });

    // , d3.autoType or use dsv.autoType as arg to a dsv function

    // this.data = this.http.get<DataModel>('../assets/covid19.csv')
    //   .pipe(
    //     tap(_ => console.log('fetched data') ),
    //     catchError( this.handleError )
    //   );     
    
    console.log('end AppComponent constructor');
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     'Something bad happened; please try again later.');
  // };
}
