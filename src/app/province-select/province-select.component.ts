import { Component, OnInit, OnChanges, EventEmitter, Input, Output } from '@angular/core';
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

  // only want data of provinces
  // provinceUniqueIDs: any[] = [];
  provinceArray: any[] = [];
  @Output() selectedProvince = new EventEmitter<string>(); // actually an string ID
  selectedValue: string;
  
  provinceForm = new FormGroup({
    provinceSelection: new FormControl('')
  });  

  getProvinceData(): void {
    // get unique provinces from data set
    // this.provinceUniqueIDs = [...new Set( this.data.map(d => d.pruid) )];    
    /*
    this.provinceUniqueIDs = [      
      '59',
      '35'
    ];
    */
   
    // console.log('ProvinceSelectComponent 3 getProvinceData this.data BEFORE', this.data)
    
    // return a subset of complete data of only first index of unique IDs determined from previous step
    /*
    this.provinceArray = this.data.filter(
      d => this.provinceUniqueIDs.indexOf( d.pruid ) > 0  // indexOf: if no match return -1, if match return index > 0
    );
    */
    this.provinceArray = [
      {
        'pruid': '59',
        'prname': 'British Columbia'
      },    
      {
        'pruid': '48',
        'prname': 'Alberta'
      },
      {
        'pruid': '47',
        'prname': 'Saskatchewan'
      },
      {
        'pruid': '46',
        'prname': 'Manitoba'
      },
      {
        'pruid': '35',
        'prname': 'Ontario'
      },
      {
        'pruid': '24',
        'prname': 'Quebec'
      },
      {
        'pruid': '13',
        'prname': 'New Brunswick'
      },
      {
        'pruid': '10',
        'prname': 'Newfoundland and Labrador'
      },
      {
        'pruid': '12',
        'prname': 'Nova Scotia'
      },
      {
        'pruid': '11',
        'prname': 'Prince Edward Island'
      },
      {
        'pruid': '61',
        'prname': 'Northwest Territories'
      },
      {
        'pruid': '62',
        'prname': 'Nunavut'
      },
      {
        'pruid': '60',
        'prname': 'Yukon'
      }
    ];    
  }
 
  onChange( e ) {
    // set data model to user's selected province ID
    this.selectedValue = this.provinceForm.get('provinceSelection').value; 
    this.selectedProvince.emit( this.selectedValue );   
  }

  constructor() {  
  }

  ngOnInit(): void {    
    this.getProvinceData();
  }
}
