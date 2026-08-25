import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripApiService {

  private apiUrl = 'http://localhost:8080/api/v1/trips';

  constructor(private http: HttpClient) {}

  getAllTrips(status?: string): Observable<Trip[]> {
    const url = status && status !== 'All' ? `${this.apiUrl}?status=${status}` : this.apiUrl;
    return this.http.get<Trip[]>(url);
  }

  createTrip(trip: Partial<Trip>): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
