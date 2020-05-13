import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { DataModel } from 'src/app/data/data.model';

@Component({
  selector: 'app-province-select',
  templateUrl: './province-select.component.html',
  styleUrls: ['./province-select.component.scss']
})
export class ProvinceSelectComponent implements OnInit {
  @Input()
  data: DataModel[];
  
  @Output() 
  selectedProvince = new EventEmitter<string>(); // actually a string ID
  
  provinceArray: any[];
  REPAT_TRAVELLERS: string = '99';
  CANADA: string = '1';
  
  provinceForm = new FormGroup({
    provinceSelection: new FormControl('')
  });  

  constructor() {

  }
 
  onChange( e ) {
    // set data model to user's selected province ID
    this.selectedProvince.emit( this.provinceForm.get('provinceSelection').value );   
  }

  getProvinces(): Array<any> {
    // create a new Object which will contain only key/value pairs (so there will be no duplicate items)
    // { 43: 'Alberta', 55: 'British Columbia' }
    const provinceNamesById = {};
    // filter out Repatriated Travellers
    const dataOnlyProvinces = this.data.filter( d => d.pruid!=this.REPAT_TRAVELLERS );
    dataOnlyProvinces.forEach( function (elem, i){
      provinceNamesById[elem.pruid] = elem.prname;
    });    

    // then create a new Array of all the objects converted to arrays of [key, value] elements
    // [ [43, 'Alberta'], [55, 'British Columbia'] ] 
    const provinceArrayOfArrays = Object.entries( provinceNamesById );    

    // then map it and extract the elements and turn it back into an Array of Objects of key/value pairs.
    // [ {pruid: 43, prname: 'Alberta'}, {pruid: 55, prname: 'British Columbia'} ]
    return provinceArrayOfArrays.map( ([ pruid, prname ]) => ({ pruid, prname }) );
  }

  /*
  getProvinces(): void {
    // // get unique provinces from data set
    // this.provinceUniqueIDs = [...new Set( this.data.map(d => d.pruid) )];       
    
    // // return a subset of complete data of only first index of unique IDs determined from previous step    
    // this.provinceArray = this.data.filter(
    //   d => this.provinceUniqueIDs.indexOf( d.pruid ) > 0  // indexOf: if no match return -1, if match return index > 0
    // );

    // const provincesSubsetIdName = data.map( ({pruid, prname}) => ({pruid, prname}) );
    // const provincesData = [...new Set( provincesSubsetIdName )];     
    // const provincesUniqueIDs = [...new Set( data.map(d => d.pruid) )]; 
    // // const provincesUniqueIDs = [...new Set( provincesSubsetIdName.map(d => d.pruid) )]; 

    // // return a subset of complete data of only first index of unique IDs determined from previous step
    // self.provinceOptionsArray = data.filter(
    //   d => provinceUniqueIDs.indexOf( d.pruid ) > 0  // indexOf: if no match return -1, if match return index > 0
    // );

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
    //     return keepOrNot;
    //   }
    // );
  }
  */

  ngOnInit(): void {
    this.provinceArray = this.getProvinces();
  }
}
