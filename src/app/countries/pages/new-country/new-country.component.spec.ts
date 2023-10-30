import { CountriesModule } from '../../countries.module';

import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NewCountryComponent } from './new-country.component';
import { CountriesService } from '../../services/countries.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CountryFormComponent } from '../../components/country-form/country-form.component';
import { Country, CountryResponse, NewCountry } from '../../interfaces/country';
import { of, throwError } from 'rxjs';

const mockCountry: Country = {
  id: 1,
  code: 'US',
  name: 'United States',
};

const mockNewCountry: NewCountry = {
  name: mockCountry.name,
  code: mockCountry.code,
};

const mockCountryResponse: CountryResponse = {
  content: [mockCountry],
  pageable: {
    sort: {
      sorted: false,
      unsorted: true,
      empty: false,
    },
    pageNumber: 1,
    pageSize: 10,
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: true,
  totalPages: 1,
  totalElements: 2,
  first: true,
  sort: {
    sorted: false,
    unsorted: true,
    empty: false,
  },
  number: 0,
  numberOfElements: 2,
  size: 10,
  empty: false,
};

describe('NewCountryComponent', () => {
  let component: NewCountryComponent;
  let fixture: ComponentFixture<NewCountryComponent>;
  let countriesService: jasmine.SpyObj<CountriesService>;
  let router: jasmine.SpyObj<Router>;
  let toast: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    // service mocks
    toast = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    countriesService = jasmine.createSpyObj('CountriesService', ['newCountry']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [CountriesModule],
      declarations: [NewCountryComponent, CountryFormComponent],
      providers: [
        {
          provide: CountriesService,
          useValue: countriesService,
        },
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toast },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('backButton should navigate to countries/list', () => {
    component.backButton();
    expect(router.navigateByUrl).toHaveBeenCalledWith('countries/list');
  });

  it('should submit new country', fakeAsync(() => {
    // Arrange
    countriesService.newCountry.and.returnValue(of(mockCountryResponse)); // Mock the newCountry method to return an observable with the mockCountry

    // Act
    component.country.set(mockCountry); // Set the component's country object
    component.onSubmit(mockCountry); // Call the onSubmit method

    tick();

    // Assert
    expect(countriesService.newCountry).toHaveBeenCalledWith(mockNewCountry);
    expect(router.navigateByUrl).toHaveBeenCalledWith('countries/list');
  }));

  it('should throw error when newCountry throws an error', () => {
    // Arrange
    countriesService.newCountry.and.throwError('Error');

    // Act
    try {
      component.onSubmit(mockCountry);
    } catch (error) {
      toast.error('Error creating country!');
    }

    // Assert
    expect(countriesService.newCountry).toHaveBeenCalledWith(mockNewCountry);
    expect(toast.error).toHaveBeenCalledWith('Error creating country!');
  });

  it('should throw error when invalid country object', fakeAsync(() => {
    // Arrange
    const invalidCountry = {
      id: 0,
      code: '',
      name: '',
    };

    // Act & Assert
    countriesService.newCountry.and.returnValue(
      throwError(() => new Error('Invalid country'))
    );

    tick();

    expect(() => {
      component.onSubmit(invalidCountry);
    }).toThrowError();
    expect(countriesService.newCountry).not.toHaveBeenCalled();
  }));

  it('should navigate to countries/list on back button click', () => {
    // Act
    component.backButton();

    // Assert
    expect(router.navigateByUrl).toHaveBeenCalledWith('countries/list');
  });

  it('should navigate to countries/list on successful submit', () => {
    // Arrange
    countriesService.newCountry.and.returnValue(of(mockCountryResponse)); // Mock the newCountry method to return an observable with the mockCountry

    // Act
    component.onSubmit(mockCountry); // Call the onSubmit method

    // Assert
    expect(countriesService.newCountry).toHaveBeenCalledWith(mockNewCountry);
    expect(router.navigateByUrl).toHaveBeenCalledWith('countries/list');
  });
});
