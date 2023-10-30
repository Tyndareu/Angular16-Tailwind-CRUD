import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environments } from 'src/environments/environments';
import { Country, CountryResponse, NewCountry } from '../interfaces/country';
import { QueryParams } from '../interfaces/queryParams';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  protected baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {}

  getCountries(queryParams: QueryParams): Observable<CountryResponse> {
    return this.http
      .post<CountryResponse>(`${this.baseUrl}/filter`, queryParams)
      .pipe(
        catchError(() => {
          return throwError(() => 'Error');
        })
      );
  }

  getCountryById(countryId: string): Observable<Country> {
    return this.http.get<Country>(`${this.baseUrl}/${countryId}`).pipe(
      catchError(() => {
        return throwError(() => 'Error');
      })
    );
  }

  editCountryById(country: Country): Observable<Country> {
    return this.http
      .put<Country>(`${this.baseUrl}/${country.id}`, country)
      .pipe(
        catchError(() => {
          return throwError(() => 'Error editing country');
        })
      );
  }

  deleteCountryById(id: number): Observable<Country> {
    return this.http.delete<Country>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => {
        return throwError(() => 'Error deleting country');
      })
    );
  }

  newCountry(newCountry: NewCountry): Observable<CountryResponse> {
    return this.http.post<CountryResponse>(`${this.baseUrl}`, newCountry).pipe(
      catchError(() => {
        return throwError(() => 'Error');
      })
    );
  }
}
