import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { DataModel } from 'src/app/data/data.model';

@Component({
  selector: 'app-data-select',
  templateUrl: './data-select.component.html',
  styleUrls: ['./data-select.component.scss']
})
export class DataSelectComponent implements OnInit {
  // @Input()
  // data: DataModel[];
  
  @Output() 
  selectedDataType = new EventEmitter<string>(); // actually a string ID
  
  dataTypeArray: any[];

  dataTypeForm = new FormGroup({
    dataTypeSelection: new FormControl('')
  });  
  
  constructor() { }

  ngOnInit(): void {
    // initial static version
    this.dataTypeArray = [
      { 
        'id': 'numconf',
        'value': 'Cases' 
      },
      {
        'id': 'numdeaths',
        'value': 'Deaths' 
      },
      {
        'id': 'numrecover',
        'value': 'Recovered' 
      },
      {
        'id': 'numtested',
        'value': 'Tested' 
      }
    ];
  }

  onChange( e ) {
    // inform parent component of user's selected province ID
    this.selectedDataType.emit( this.dataTypeForm.get('dataTypeSelection').value );   
  }
}
