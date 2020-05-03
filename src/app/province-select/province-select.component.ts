import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms"; // FormBuilder

@Component({
  selector: 'app-province-select',
  templateUrl: './province-select.component.html',
  styleUrls: ['./province-select.component.scss']
})
export class ProvinceSelectComponent implements OnInit {  
  provinceArray: any = [
    'BC', 'ON', 'NL', 'NS'
  ];

  // model
  provinceForm = new FormGroup({
    province: new FormControl('')
  })

  onChange( e ) {
    // TODO: Use EventEmitter with form value

    alert(JSON.stringify(this.provinceForm.value)) // ? value of form

    // TODO: update form value
    this.provinceForm.get('province').setValue( 
       e.target.value, 
       { onlySelf: true } // ??
    );

  }

  constructor() { }

  ngOnInit(): void {
  }

}
