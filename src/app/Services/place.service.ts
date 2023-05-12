import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/Environment/environment';
import { Observable } from 'rxjs';
import {Place} from '../Interfaces/Place';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  private endPoint: string = environment.placeEndpoint;

  constructor(private http:HttpClient) { }

  getPlaces():Observable<Place[]>{
    return this.http.get<Place[]>(`${this.endPoint}/GetPlaces`);
  }

  getPlace(idPlace:number):Observable<Place[]>{
    return this.http.get<Place[]>(`${this.endPoint}${idPlace}`);
  }
}
