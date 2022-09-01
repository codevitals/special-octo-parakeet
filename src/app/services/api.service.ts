import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { Credentials } from '../models/credentials.model';
import { Users } from '../models/users.model';
import { Patient } from '../models/patient';
import { Appointment } from '../models/appointment';
import { map, tap } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class ApiService {

  API_URL: String;
  AUTH_API_URL = '/auth/server/';

  constructor(private http: HttpClient) {
    this.API_URL = 'api';
  }

  public checkLogin(username: string, password: string): Observable<Credentials> {
    const requestBody = {
      username: username,
      password: password
    };
    return this.http.post('api/auth/server/', requestBody).pipe(
      map((response: Credentials)=>{
        if(response) {          
          return response;          
        }
      }),
      catchError(this.handleError)
    );
  }

  public getUserDetails(userId: number): Observable<Users> {
    return this.http.get('api/users/' + userId.toString()).pipe(
      map((response: Users)=>{
        return response;
      }),
      catchError(this.handleError)
    );
  }

  public updateDetails(userDetails: Users): Observable<Users> {
    // should return user details if successfully updated the details
    try{
      return this.http.put('api/users/' + userDetails.userId, userDetails).pipe(
        map((response: Users)=>{
          if(response && response.userId > 0) {          
            localStorage.setItem('userId', response.userId.toString());
            return response;          
          }
          else {
            return response;          
          }
        }),
        catchError(this.handleError)
      );
    }
    catch(ex){
      this.handleError(ex);
    }// handle error
  }

  public registerPatient(patientDetails: any): Observable<any> {
    return this.http.post('api/allpatients', patientDetails).pipe(
      map((response: any)=>{
        if(response) {          
          return response;          
        }
        else {
          return null;          
        }
      }),
      catchError(this.handleError)
    );
  }

  public getAllPatientsList(): Observable<any> {
    return this.http.get('api/allpatients').pipe(
      map((response: any[])=>{
        if(response) {          
          return response;          
        }
        else {
          return null;          
        }
      }),
      catchError(this.handleError)
    );
  }

  public getParticularPatient(id): Observable<any> {
    if(id) {
      return this.http.get('api/allpatients/' + id.toString()).pipe(
        map((response: Patient)=>{
          if(response) {
            return response;          
          }
        }),
        catchError(this.handleError)
      );
    }  
  }

  public getDiseasesList(): Observable<any> {
    return this.http.get('api/diseases').pipe(
      map((response: any[])=>{
        if(response) {
          return response;          
        }
        else {
          return null;          
        }
      }),
      catchError(this.handleError)
    );
  }

  public bookAppointment(appointmentDetails: any): Observable<any> {
    return this.http.post('api/reqappointments', appointmentDetails).pipe(
      map((response: any)=>{
        if(response) {          
          return response;          
        }
        else {
          return null;          
        }
      }),
      catchError(this.handleError)
    );
  }

  public requestedAppointments(): Observable<any> {
    return this.http.get('api/reqappointments').pipe(
      map((response: any[])=>{
        if(response) {          
          return response;          
        }
        else {
          return null;          
        }
      }),
      catchError(this.handleError)
    );
  }

  public getAppointments(userId): Observable<any> {
    if(userId) {
      return this.http.get('api/reqappointments?patientId=' + userId.toString()).pipe(
        map((response: any[])=>{
          if(response) {          
            return response;          
          }
          else {
            return null;          
          }
        }),
        catchError(this.handleError)
      );
    }    
  }

  public deleteAppointment(appointmentId): Observable<any> {
    return this.http.delete('api/reqappointments/' + appointmentId).pipe(
      map((response: any)=>{
        if(response) {          
          return true as boolean;          
        }
        else {
          return false as boolean;          
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if(error.error instanceof ErrorEvent) {
      console.error('An error occurred');
    }
    else {
      console.error('An error occurred');
    }
    return throwError(error);
  }
  
}
