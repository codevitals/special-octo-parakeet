import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { Users } from '../models/users.model';
import { Patient } from '../models/patient';
import { Appointment } from '../models/appointment';
import { ApiService } from './api.service';
import { catchError, map, tap } from 'rxjs/operators';
import { TmplAstRecursiveVisitor } from '@angular/compiler';
import { Executor } from 'selenium-webdriver';

@Injectable()
export class DataService {

  isLoggedIn = false;
  isLogIn: BehaviorSubject<boolean>;
  constructor(private api: ApiService, private http: HttpClient) {
    this.isLogIn = new BehaviorSubject<boolean>(false);
  }

  authenticateUser(username: string, password: string): Observable<boolean> {
    // store 'userId' from response as key name 'userId' to the localstorage
    // return true if user authenticated
    // return false if user not authenticated
    const requestBody = {
      username: username,
      password: password
    };
    return this.http.post('api/auth/server/', requestBody).pipe(
      map((response: any)=>{
        if(response && response.userId > 0) {          
          localStorage.setItem('userId', response.userId.toString());
          this.isLogIn.next(true);
          return true as boolean;          
        }
        else {
          this.isLogIn.next(false);
          return false as boolean;          
        }
      }),
      catchError(this.definedHandleError)
    );
  }

  getAuthStatus(): Observable<boolean> {
    return this.isLogIn.asObservable();
  }

  doLogOut() {
    // remove the key 'userId' if exists
  }

  getUserDetails(userId: number): Observable<Users> {
    return this.http.get('api/users/' + userId.toString()).pipe(
      map((response: Users)=>{
        return response;
      }),
      catchError(this.definedHandleError)
    );
  }

  updateProfile(userDetails: Users): Observable<boolean> {
    // should return the updated status according to the response from api service
    return this.http.post('api/users/' + userDetails.userId, userDetails).pipe(
      map((response: Users)=>{
        if(response && response.userId > 0) {          
          localStorage.setItem('userId', response.userId.toString());
          return true as boolean;          
        }
        else {
          return false as boolean;          
        }
      }),
      catchError(this.definedHandleError)
    );
  }

  registerPatient(patientDetails): Observable<any> {
    return this.http.post('api/allpatients', patientDetails).pipe(
      map((response: any)=>{
        if(response && response.patientId) {
          return response;          
        }
        else {
          throw Error('Invalid UserId');    
        }
      }),
      catchError(this.definedHandleError)
    );
  }

  getAllPatientsList(): Observable<any> {
    return this.http.get('api/allpatients').pipe(
      map((response: Patient[])=>{
        if(response && response.length > 0) {
          return response;          
        }
        else {
          return null;          
        }
      }),
      catchError(this.definedHandleError)
    );
  }

  getParticularPatient(id): Observable<any> {
    if(id) {
      return this.http.get('api/allpatients/' + id.toString()).pipe(
        map((response: Patient)=>{
          if(response) {
            return response;          
          }
        }),
        catchError(this.definedHandleError)
      );
    }   
  }
  
  getDiseasesList(): Observable<any> {
    return this.http.get('api/diseases').pipe(
      map((response: any[])=>{
        if(response) {
          return response;          
        }
        else {
          return null;          
        }
      }),
      catchError(this.definedHandleError)
    );
  }

  bookAppointment(appointmentDetails): Observable<any> {
    return this.http.post('api/reqappointments', appointmentDetails).pipe(
      map((response: any)=>{
        if(response) {          
          return response;          
        }
        else {
          return null;          
        }
      }),
      catchError(this.definedHandleError)
    );
  }

  getAppointments(patientId): Observable<any> {
    return this.http.get('/reqappointments?patientId=' + patientId.toString()).pipe(
      map((response: any[])=>{
        if(response) {          
          return response;          
        }
      }),
      catchError(this.definedHandleError)
    );
  }

  deleteAppointment(appointmentId): Observable<any> {
    return this.http.delete('api/reqappointments/' + appointmentId).pipe(
      map((response: any)=>{
        if(response) {          
          return true as boolean;          
        }
        else {
          return false as boolean;          
        }
      }),
      catchError(this.definedHandleError)
    );
  }

  requestedAppointments(): Observable<any> {
    return this.http.get('api/reqappointments').pipe(
      map((response: any[])=>{
        if(response && response.length > 0) {
          return response;          
        }
        else {
          return null;          
        }
      }),
      catchError(this.definedHandleError)
    );
  }

  getUserId(): number {
    try {
      this.isLogIn.subscribe(data=>{
        if(data == true) {
          return 1;
        }
        else {
          return -1;
        }
      })  
    }
    catch (e) {
      return -1;
    } 
  }

  private definedHandleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  private undefinedHandleError(error: HttpErrorResponse) {
    if (error.error == "test 404 error"){
      return throwError('test 404 error');      
    }
    else {
      return throwError(undefined); 
    }    
  }

}

