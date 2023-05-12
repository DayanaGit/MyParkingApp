import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/Environment/environment';
import { Observable } from 'rxjs';
import {Client} from '../Interfaces/Client';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private endPoint: string = environment.clientEndPoint;
  
  constructor(private http:HttpClient) { }

  getClients():Observable<Client[]>{
    return this.http.get<Client[]>(`${this.endPoint}/GetClients`);
  }

  getClient(idClient:number):Observable<Client[]>{
    return this.http.get<Client[]>(`${this.endPoint}${idClient}`);
  }

  addClient(model:Client):Observable<Client>{
    var client = JSON.stringify(model);
    var endPoint = `${this.endPoint}/CreateClient`
    return this.http.post<Client>(endPoint,client,httpOptions);
  }

  updateClient(model:Client):Observable<Client>{
    var client = JSON.stringify(model);
    var endPoint = `${this.endPoint}/UpdateClient`
    return this.http.put<Client>(endPoint,client,httpOptions);
  }

  deleteClient(idClient:number):Observable<void>{
    var endPoint = `${this.endPoint}/`
    return this.http.delete<void>(`${endPoint}${idClient}`);
  }
}
