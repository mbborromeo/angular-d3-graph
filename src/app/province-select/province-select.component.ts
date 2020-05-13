import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { DataModel } from 'src/app/data/data.model';

@Component({
  selector: 'app-province-select',
  templateUrl: './province-select.component.html',
  styleUrls: ['./province-select.component.scss']
})
export class ProvinceSelectComponent { // implements OnInit
  @Input()
  provinceArray: any[]; // data: DataModel[];
  
  @Output() selectedProvince = new EventEmitter<string>(); // actually a string ID
  selectedValue: string;
  
  provinceForm = new FormGroup({
    provinceSelection: new FormControl('')
  });  

  constructor() {
    
  }
 
  onChange( e ) {
    // set data model to user's selected province ID
    this.selectedValue = this.provinceForm.get('provinceSelection').value; 
    this.selectedProvince.emit( this.selectedValue );   
  }

  /*
  ngOnInit(): void {
    console.log('ProvinceSelectComponent constructor ngOnInit', this.provinceArray)
  }
  */
}
