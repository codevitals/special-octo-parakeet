import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder,Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { DataService } from '../../services/data.service';
// import * as alertify from 'alertify.js';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [DatePipe]
})
export class FormComponent implements OnInit {

  complexForm: FormGroup;
  patientDetails = new Patient;
  result;

  today: string;

  noRecordsFound = 'No patient records found in the list. Click on Register New Patient to add Patient details.';

  emptyFirstname = 'You must include a first name.';
  minlengthFirstname = 'Your first name must be at least 3 characters long.';
  maxlengthFirstname = 'Your first name cannot exceed 20 characters.';
  emptyLastname = 'You must include a last name.';
  minlengthLastname = 'Your last name must be at least 3 characters long.';
  maxlengthLastname = 'Your last name cannot exceed 20 characters.';
  noGender = 'You must select a gender.';
  noDob = 'You must select a valid date of birth.';
  noMobile = 'You must include mobile number.';
  numberMobile = 'You must enter a valid 10 digit mobile number.';
  maxlengthMobile = 'Your mobile number should not exceed 10 digits.';
  noEmail = 'You must include a valid email.';
  patternEmail = 'Pattern does not match.';

  ngOnInit() {
    this.today = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

    this.complexForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      gender: new FormControl(null, [Validators.required]),
      dob: new FormControl(null, [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^!*(\d!*){10,}$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      description: new FormControl(''),
    });
  }

  constructor( fb: FormBuilder,private datePipe: DatePipe,private route: Router, private dataService: DataService){
    // this.complexForm = fb.group({
    //   'firstName' : [''],
    //   'lastName': [''],
    //   'gender' : [null],
    //   'dob' : [null],
    //   'mobile' : [''],
    //   'email' : [''],
    //   'description' : ''
    // })
  }

  submitForm(value: any){

    // assign new date object to reportedTime
    // should reister new patient using service
    // if added successfully should redirect to 'patientList' page
    this.route.navigate(['/patientList']);

  }

}
