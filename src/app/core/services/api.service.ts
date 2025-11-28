import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

// The base API URL is defined in the environment file
const BASE_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private formatErrors(error: any) {
    // Basic error handler for consistent reporting
    console.error('API Error:', error);
    return new Observable(observer => observer.error(error));
  }

  // Generic GET request
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${BASE_URL}${path}`, { params });
  }

  // Generic POST request
  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(`${BASE_URL}${path}`, body);
  }

  // Generic PUT request
  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(`${BASE_URL}${path}`, body);
  }

  // Generic DELETE request
  delete(path: string): Observable<any> {
    return this.http.delete(`${BASE_URL}${path}`);
  }
}