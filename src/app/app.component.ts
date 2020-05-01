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
  //data: Observable<DataModel>;
  data: any;
  csvUrl: string = 'https://health-infobase.canada.ca/src/data/covidLive/covid19.csv';

  constructor(private http: HttpClient) {
    console.log('AppComponent constructor here!!!!');    

    // using cors-anywhere as a proxy to access the external CSV file
    this.data = d3.csv(`https://cors-anywhere.herokuapp.com/${ this.csvUrl }`)
      .then( function (data){
        console.log('covid CSV data is', data);
        console.log('state and cases field names', data.columns[1], data.columns[4]);
        console.log('2nd data entry', data[1]);

        // filter out British Columbia only
        return data.filter(d => d.date=='21-03-2020' && parseInt(d.pruid)!==1 && parseInt(d.pruid)!==99 ); // d.pruid==59, data, d3.csv returns a promise, so need a return statement
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
