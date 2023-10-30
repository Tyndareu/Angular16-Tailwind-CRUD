import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { CountriesService } from './countries.service';
import {
  Country,
  QueryParams,
  CountryResponse,
} from '../interfaces/interfaces';
import { Observable, catchError, of, throwError } from 'rxjs';

const mockCountry: Country = {
  id: 1,
  name: 'Spain',
  code: 'ES',
};

const mockBody: QueryParams = {
  pagination: {
    page: 0,
    collectionSize: 1,
    sortOrder: 'asc',
    sortField: 'name',
  },
};

const mockExpectedResponse: CountryResponse = {
  content: [
    {
      id: 1,
      name: 'España',
      code: 'ES',
    },
    {
      id: 2,
      name: 'Francia',
      code: 'FR',
    },
    {
      id: 3,
      name: 'Alemania',
      code: 'DE',
    },
  ],
  pageable: {
    sort: {
      sorted: true,
      unsorted: false,
      empty: false,
    },
    pageNumber: 1,
    pageSize: 10,
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: false,
  totalPages: 2,
  totalElements: 3,
  first: true,
  sort: {
    sorted: true,
    unsorted: false,
    empty: false,
  },
  number: 1,
  numberOfElements: 3,
  size: 10,
  empty: false,
};
class TestCountriesService extends CountriesService {
  getBaseUrl() {
    return this.baseUrl;
  }
}
describe('CountriesService', () => {
  let service: TestCountriesService;
  //let service: CountriesService;
  let httpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', [
      'post',
      'get',
      'put',
      'delete',
    ]);

    TestBed.configureTestingModule({
      providers: [
        TestCountriesService,
        { provide: HttpClient, useValue: httpClient },
      ],
    });
    service = TestBed.inject(TestCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable of Country', () => {
    httpClient.get.and.returnValue(of(mockCountry));

    const response = service.getCountryById('20');

    expect(response instanceof Observable).toBeTruthy();
    expect(response.subscribe).toBeDefined();

    const values = response.subscribe(country => {
      expect(country.id).toEqual(mockCountry.id);
      expect(country.name).toEqual(mockCountry.name);
      expect(country.code).toEqual(mockCountry.code);
    });

    expect(values).toBeTruthy();
  });
  it('should retrieve a list of countries with valid pagination data when getCountries is called with a valid body', () => {
    // Act
    httpClient.post.and.returnValue(of(mockExpectedResponse));
    const response = service.getCountries(mockBody);
    // Assert
    expect(response instanceof Observable).toBeTruthy();
  });

  it('should handle error response for getCountryById method', function () {
    const countryId = '999';
    const errorMessage = 'Error retrieving country';

    httpClient.get.and.returnValue(throwError(() => new Error(errorMessage)));

    service.getCountryById(countryId).pipe(
      catchError(error => {
        expect(error.message).toBe(errorMessage);
        return of(error.message);
      })
    );
  });

  // New

  it('should return an error when getCountries fails', () => {
    // Arrange
    httpClient.post.and.returnValue(throwError(() => new Error('Error')));

    // Act
    service.getCountries(mockBody).subscribe({
      error: err => {
        expect(err).toEqual('Error');
      },
    });

    // Assert
    expect(httpClient.post).toHaveBeenCalledWith(
      `${service.getBaseUrl()}/filter`,
      mockBody
    );
  });

  it('should return an error when getCountryById fails', () => {
    // Arrange
    const countryId = '1';
    httpClient.get.and.returnValue(throwError(() => new Error('Error')));

    // Act
    service.getCountryById(countryId).subscribe({
      error: err => {
        expect(err).toEqual('Error');
      },
    });

    // Assert
    expect(httpClient.get).toHaveBeenCalledWith(
      `${service.getBaseUrl()}/${countryId}`
    );
  });

  it('should handle error for editCountryById', () => {
    const updatedCountry = { ...mockCountry, name: 'New Name' };
    const errorMessage = 'Error editing country';

    httpClient.put.and.returnValue(throwError(() => new Error(errorMessage)));

    service.editCountryById(updatedCountry).subscribe({
      error: err => {
        expect(err).toEqual('Error editing country');
      },
    });
  });

  it('should handle error for deleteCountryById', () => {
    // Arrange
    const countryId = 1;
    httpClient.delete.and.returnValue(
      throwError(() => new Error('Error deleting country'))
    );

    // Act
    service.deleteCountryById(countryId).subscribe({
      error: err => {
        expect(err).toEqual('Error deleting country');
      },
    });
  });

  it('should return an error when newCountry fails', () => {
    // Arrange

    httpClient.post.and.returnValue(throwError(() => new Error('Error')));

    // Act
    service.newCountry(mockCountry).subscribe({
      error: err => {
        expect(err).toEqual('Error');
      },
    });

    // Assert
    expect(httpClient.post).toHaveBeenCalledWith(
      `${service.getBaseUrl()}`,
      mockCountry
    );
  });
});
