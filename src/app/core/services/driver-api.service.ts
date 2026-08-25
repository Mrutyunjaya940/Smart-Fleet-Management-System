import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverApiService {

  private apiUrl = 'http://localhost:8080/api/v1/drivers';

  constructor(private http: HttpClient) {}

  getAllDrivers(status?: string): Observable<Driver[]> {
    const url = status && status !== 'All' ? `${this.apiUrl}?status=${status}` : this.apiUrl;
    return this.http.get<Driver[]>(url);
  }

  getDriverById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  createDriver(driver: Partial<Driver>): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  updateDriver(id: number, driver: Partial<Driver>): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/${id}`, driver);
  }

  deleteDriver(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
