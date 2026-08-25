import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fuel } from '../../models/fuel.model';

@Injectable({
  providedIn: 'root'
})
export class FuelApiService {

  private apiUrl = 'http://localhost:8080/api/v1/fuel';

  constructor(private http: HttpClient) {}

  getAllFuelLogs(): Observable<Fuel[]> {
    return this.http.get<Fuel[]>(this.apiUrl);
  }

  createFuelLog(fuel: Partial<Fuel>): Observable<Fuel> {
    return this.http.post<Fuel>(this.apiUrl, fuel);
  }

  deleteFuelLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
