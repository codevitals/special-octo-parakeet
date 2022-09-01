import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { DataService } from '../../services/data.service';
import {ActivatedRoute, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-all-patients-list',
  templateUrl: './all-patients-list.component.html',
  styleUrls: ['./all-patients-list.component.css']
})
export class AllPatientsListComponent implements OnInit {

  allPatients: any[];
  patient: any;
  constructor(private route: Router, private dataService: DataService) { }

  ngOnInit() {
    // get all patients list from service
    // ng test --watch=false    
    this.dataService.getAllPatientsList().subscribe(data => {
      if (data && data.length > 0) {
        this.allPatients = data;
      }
      else {
        this.allPatients = [];
      }
    });
  }

  view(patientId) {       
    this.route.navigate(['/patientList/' + patientId.toString()]);
  }
}
