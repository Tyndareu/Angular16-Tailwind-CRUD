import { CountriesModule } from '../../countries.module';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CountriesService } from '../../services/countries.service';
import { PaginationStateService } from '../../services/pagination-state.service';

import { CountriesListComponent } from './countries-list.component';
import { CountryResponse } from '../../interfaces/interfaces';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { QueryParams } from '../../interfaces/queryParams';

const mockCountriesResponse: CountryResponse = {
  content: [],
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
  totalElements: 1,
  first: true,
  sort: {
    sorted: false,
    unsorted: true,
    empty: false,
  },
  number: 0,
  numberOfElements: 1,
  size: 12,
  empty: false,
};

const queryParams: QueryParams = {
  pagination: {
    page: 0,
    collectionSize: 12,
    sortOrder: 'desc',
    sortField: 'name',
  },
};

// const mockCountry: Country = {
//   id: 1,
//   code: 'US',
//   name: 'United States',
// };
describe('CountriesListComponent', () => {
  let component: CountriesListComponent;
  let fixture: ComponentFixture<CountriesListComponent>;
  let paginationStateService: jasmine.SpyObj<PaginationStateService>;
  let countriesService: jasmine.SpyObj<CountriesService>;
  let toast: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    toast = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    countriesService = jasmine.createSpyObj('CountriesService', [
      'getCountries',
      'deleteCountryById',
    ]);
    countriesService.getCountries.and.returnValue(of(mockCountriesResponse));
    paginationStateService = jasmine.createSpyObj('PaginationStateService', [
      'getPagination',
      'setPagination',
    ]);
    paginationStateService.getPagination.and.returnValue({
      page: 0,
      collectionSize: 12,
      sortOrder: 'desc',
      sortField: 'name',
    });

    TestBed.configureTestingModule({
      declarations: [CountriesListComponent],
      imports: [CountriesModule, RouterTestingModule],
      providers: [
        { provide: PaginationStateService, useValue: paginationStateService },
        { provide: CountriesService, useValue: countriesService },
        { provide: ToastrService, useValue: toast },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // The component should load countries when it is initialized.

  it('should load countries on component initialization', () => {
    // Assert that countriesService.getCountries was called with the correct parameters
    expect(countriesService.getCountries).toHaveBeenCalledWith(queryParams);
  });

  it('should not load countries when page number is negative', () => {
    // Arrange
    expect(() => component.updatePage(-5)).toThrowError(
      'Page number is invalid'
    );
  });

  // The component should not update the pagination state when the page size is zero.

  it('should not update pagination state when page size is negative', () => {
    // Assert that paginationStateService.setPagination was not called
    expect(() => component.updateSize(-1)).toThrowError('Page size is invalid');
  });

  it('should load countries on page change', () => {
    const page = 3;

    // Call onSelectPage
    component.updatePage(page);

    // Assert that countriesService.getCountries was called with the new page number
    expect(countriesService.getCountries).toHaveBeenCalledWith({
      pagination: {
        page: page - 1,
        collectionSize: 12,
        sortOrder: 'desc',
        sortField: 'name',
      },
    });
  });

  it('should update pagination state on page size selection', () => {
    // Arrange

    const pageSize = 24;

    // Act
    component.updateSize(pageSize);

    // Assert
    expect(paginationStateService.setPagination).toHaveBeenCalledWith({
      page: 0,
      collectionSize: 24,
      sortOrder: 'desc',
      sortField: 'name',
    });
  });

  it('should handle error when loading countries', () => {
    // Arrange
    countriesService.getCountries.and.throwError('Error');

    // Act & Assert
    expect(() => {
      component.loadCountries();
    }).toThrowError('Error');
  });
  it('should load countries in ascending order', () => {
    // Arrange
    // Act
    countriesService.getCountries({
      pagination: {
        page: 0,
        collectionSize: 12,
        sortOrder: 'asc',
        sortField: 'name',
      },
    });

    // Assert
    expect(countriesService.getCountries).toHaveBeenCalledWith({
      pagination: {
        page: 0,
        collectionSize: 12,
        sortOrder: 'asc',
        sortField: 'name',
      },
    });
  });

  it('should load countries in descending order', function () {
    // Arrange
    // Act
    countriesService.getCountries({
      pagination: {
        page: 0,
        collectionSize: 12,
        sortOrder: 'asc',
        sortField: 'name',
      },
    });

    // Assert
    expect(countriesService.getCountries).toHaveBeenCalledWith({
      pagination: {
        page: 0,
        collectionSize: 12,
        sortOrder: 'desc',
        sortField: 'name',
      },
    });
  });

  it('should show error message on load failure', () => {
    // Arrange
    countriesService.getCountries.and.returnValue(throwError(() => 'Error'));

    // Act
    component.loadCountries();

    // Assert
    expect(toast.error).toHaveBeenCalledWith('Error loading countries');
  });

  it('should update sort field', () => {
    // Arrange
    const sortField = 'name';

    // Act
    component.updateSortField(sortField);

    // Assert
    expect(component.queryParams.pagination.sortField).toBe(sortField);
    expect(paginationStateService.setPagination).toHaveBeenCalledWith({
      page: 0,
      collectionSize: 12,
      sortOrder: 'desc',
      sortField: sortField,
    });
  });

  it('should update sort order', () => {
    // Arrange
    const sortOrder = 'asc';

    // Act
    component.updateSort(sortOrder);

    // Assert
    expect(component.queryParams.pagination.sortOrder).toBe(sortOrder);
    expect(paginationStateService.setPagination).toHaveBeenCalledWith({
      page: 0,
      collectionSize: 12,
      sortOrder: sortOrder,
      sortField: 'name',
    });
  });

  it('should generate page numbers', () => {
    // Arrange
    const totalPages = 5;

    // Act
    const pageNumbers = component.generatePageNumbers(totalPages);

    // Assert
    expect(pageNumbers).toEqual([1, 2, 3, 4, 5]);
  });
});
