import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormGroup, FormBuilder,Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Appointment } from '../../models/appointment';
// import * as alertify from 'alertify.js';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css'],
  providers: [DatePipe]
})
export class ViewPatientComponent implements OnInit {
  patientId: string;
  patient;
  names;
  today;
  isBookAppointment: boolean = false;
  isScheduledAppointment: boolean = false;
  isFormEnabled: boolean = false;  
  isTableEnabled: boolean = false;
  appointmentForm: FormGroup;
  appointmentDetails = new Appointment;
  bookedAppointmentResponse;
  ScheduledAppointmentResponse: any[] = [];
  diseases: any[];

  constructor(fb: FormBuilder,private route: Router, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private dataService: DataService) {
    this.today = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    // add necessary validators
    // this.appointmentForm = fb.group({
    //   'selectDisease' : [null],
    //   'tentativeDate' : [null],
    //   'priority' : [null]
    // })
    this.appointmentForm = new FormGroup({
      selectDisease: new FormControl(null, [Validators.required]),
      tentativeDate: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
    });
    this.patientId = this.activatedRoute.snapshot.params['id'];
   }

  ngOnInit() {
    this.patientId = this.activatedRoute.snapshot.params['id'];
    // get selected patient id
    // get Particular Patient from service using patient id and assign response to patient property
    this.dataService.getParticularPatient(this.patientId).subscribe(data => {
      if (data) {
        this.patient = data;
      }
      else {
      }
    });     
  }

  bookAppointment() {
    this.isBookAppointment = true;
    this.isScheduledAppointment = false;
    this.isFormEnabled = true;
    this.isTableEnabled = false;
    // get diseases list from service
    this.dataService.getDiseasesList().subscribe(data2 => {
      if (data2) {
        this.diseases = data2;
      }
      else {
        this.diseases = [];
      }
    });
    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately
  }

  scheduleAppointment() {
    this.isBookAppointment = false;
    this.isScheduledAppointment = true;
    // The below attributes to be added while booking appointment using service
    // patientId, patientFirstName, patientLastName, disease, priority, tentativedate, registeredTime

    // if booked successfully should redirect to 'requested_appointments' page
    
  }

  scheduledAppointment() {
    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately
    // get particular patient appointments using getAppointments method of DataService 
    this.isTableEnabled = true;
    this.isFormEnabled = false;
    this.dataService.getAppointments(this.patientId).subscribe((data)=>{
      if(data) {
        this.ScheduledAppointmentResponse = data;
      }
      else {
        this.ScheduledAppointmentResponse = [];
      }
      
    })
  }

  cancelAppointment(id) {
    // delete selected appointment uing service
    // After deleting the appointment, get particular patient appointments
    this.dataService.deleteAppointment(id).subscribe((data) => {
      this.dataService.getParticularPatient(this.patientId).subscribe(data => {
        if (data) {
          this.patient = data;
        }
      });    
    }, (error) => {
      throw(error);
    })
  }
  
}

