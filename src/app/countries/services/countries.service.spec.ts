import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CountriesService } from './countries.service';
import { Country, CountryResponse } from '../interfaces/country';

describe('CountriesService', () => {
  let service: CountriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountriesService],
    });

    service = TestBed.inject(CountriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get countries', () => {
    const mockResponse: CountryResponse = {
      countries: [{ id: 1, name: 'Mexico' }],
    };

    service.getCountries({}).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/filter`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get country by id', () => {
    const mockResponse: Country = { id: 1, name: 'Mexico' };

    service.getCountryById('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should edit country', () => {
    const country: Country = { id: 1, name: 'Mexico' };

    service.editCountryById(country).subscribe(() => {});

    const req = httpMock.expectOne(`${service.baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(country);
    req.flush(null);
  });

  it('should delete country', () => {
    service.deleteCountryById(1).subscribe(() => {});

    const req = httpMock.expectOne(`${service.baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should create new country', () => {
    const newCountry = { name: 'New Country' };

    service.newCountry(newCountry).subscribe(() => {});

    const req = httpMock.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCountry);
    req.flush(null);
  });

  it('should return error on failure', () => {
    let error: Error;
    service.getCountries({}).subscribe({
      error: err => (error = err),
    });

    const req = httpMock.expectOne(`${service.baseUrl}/filter`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(error).toBeDefined();
  });
});
