import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Users } from '../../models/users.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  editProfile = false;
  userId = -1;
  userDetails = new Users;

  editProfileForm: FormGroup;
  userImg = './../../assets/user.jpg';
  mobileErrMsg = 'You must enter a valid mobile number';
  emailErrMsg = 'You must enter a valid Email ID';
  locationErrMsg = 'You must enter the location';

  constructor(private dataService: DataService) { }

  ngOnInit() {

    // add necessary validators
    // username should be disabled. it should not be edited

    this.editProfileForm = new FormGroup({
      userName: new FormControl('test'),
      mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]),
      email: new FormControl('test@test.com', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      location: new FormControl('testLocation', [Validators.required])
    });

    // get login status from service
    this.getProfileDetails();    

    // get userId from service and assign it to userId property
    let userId = this.dataService.getUserId();

    // get profile details and display it
    this.dataService.getUserDetails(userId).subscribe(data=>{
      if(data) {
        this.userDetails = data;
      }
    })

  }

  changeMyProfile() {
    // if successfully changed the profile it should display new details hiding the form
    this.discardEdit();
  }

  editMyProfile() {
    // change editProfile property value appropriately
    this.editProfile = true;
    this.editProfileForm = new FormGroup({
      userName: new FormControl('test'),
      mobile: new FormControl('1234567890', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]),
      email: new FormControl('test@test.com', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      location: new FormControl('testLocation', [Validators.required])
    });
  }

  discardEdit() {
    // change editProfile property value appropriately
    this.editProfile = false;
  }

  getProfileDetails() {

    // retrieve user details from service using userId
    try{
      let userId = this.dataService.getUserId();
      this.dataService.getUserDetails(userId).subscribe(data=>{
        if(data) {
          this.userDetails = data;
        }
        else {
          this.editProfileForm = new FormGroup({
            userName: new FormControl(''),
            mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]),
            email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
            location: new FormControl('', [Validators.required])
          });
        }
      })
    }    
    catch(e){
      this.editProfileForm = new FormGroup({
        userName: new FormControl(''),
        mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]),
        email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
        location: new FormControl('', [Validators.required])
      });
    }

  }
  
}
