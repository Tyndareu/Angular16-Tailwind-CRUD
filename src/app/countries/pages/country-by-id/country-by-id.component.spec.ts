import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CountryByIdComponent } from './country-by-id.component';
import { CountriesService } from '../../services/countries.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CountryFormComponent } from '../../components/country-form/country-form.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { of, throwError } from 'rxjs';
import { Country } from '../../interfaces/country';

const mockCountry: Country = { id: 1, code: 'US', name: 'United States' };

describe('CountryByIdComponent', () => {
  let component: CountryByIdComponent;
  let fixture: ComponentFixture<CountryByIdComponent>;
  let countriesService: jasmine.SpyObj<CountriesService>;
  let router: jasmine.SpyObj<Router>;
  let toast: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    // service mocks
    toast = jasmine.createSpyObj('ToastrService', ['success']);
    countriesService = jasmine.createSpyObj('CountriesService', [
      'getCountryById',
      'editCountryById',
    ]);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // TestBed
    TestBed.configureTestingModule({
      declarations: [
        CountryByIdComponent,
        CountryFormComponent,
        LoadingComponent,
      ],
      providers: [
        { provide: CountriesService, useValue: countriesService },
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toast },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCountryById and set response to country variable when id is defined', () => {
    // Arrange
    const id = '1';
    countriesService.getCountryById.and.returnValue(of(mockCountry));
    const component = new CountryByIdComponent(countriesService, router, toast);

    // Act
    component.id = id;
    component.ngOnInit();

    // Assert
    expect(countriesService.getCountryById).toHaveBeenCalledWith(id);
    expect(component.country()).toEqual(mockCountry);
  });

  it('should not call getCountryById and keep country variable null when id is not defined', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(countriesService.getCountryById).not.toHaveBeenCalled();
    expect(component.country()).toBeNull();
  });

  it('should set country variable to null and log error when getCountryById returns an error', function () {
    // Arrange
    const id = '1';
    const error = new Error('Error getting country');

    countriesService.getCountryById.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    // Act
    component.id = id;
    component.ngOnInit();

    // Assert
    expect(countriesService.getCountryById).toHaveBeenCalledWith(id);
    expect(component.country()).toBeNull();
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('should not update country if input is invalid or incomplete', () => {
    // Arrange
    const country: Country = {
      id: 1,
      code: '',
      name: '',
    };
    countriesService.editCountryById.and.returnValue(of({} as Country));

    // Act
    component.onSubmit(country);

    // Assert
    expect(countriesService.editCountryById).not.toHaveBeenCalled();
  });

  it('should navigate to countries list page after updating country', fakeAsync(() => {
    // Arrange
    const country: Country = {
      id: 1,
      code: 'US',
      name: 'United States',
    };
    countriesService.editCountryById.and.returnValue(of({} as Country));

    // Act
    component.onSubmit(country);
    tick(500);
    // Assert
    expect(router.navigateByUrl).toHaveBeenCalledWith('countries/list');
  }));

  it('should not navigate to countries list page if input is invalid or incomplete', () => {
    // Arrange
    const country: Country = {
      id: 1,
      code: '',
      name: '',
    };

    // Act
    component.onSubmit(country);

    // Assert
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should navigate to "countries/list" when called', () => {
    component.backButton();
    expect(router.navigateByUrl).toHaveBeenCalledWith('countries/list');
  });
});
