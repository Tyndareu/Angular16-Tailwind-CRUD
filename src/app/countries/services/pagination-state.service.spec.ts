import { TestBed } from '@angular/core/testing';

import { PaginationStateService } from './pagination-state.service';
import { Pagination } from '../interfaces/queryParams';

const mockInitialpagination: Pagination = {
  page: 1,
  collectionSize: 12,
  sortOrder: 'asc',
  sortField: 'name',
};

describe('PaginationService', () => {
  let service: PaginationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get pagination state', () => {
    // Act
    service.setPagination(mockInitialpagination);
    // Assert
    expect(service.getPagination()).toEqual(mockInitialpagination);
  });

  it('should override existing pagination state', () => {
    // Arrange
    service.setPagination(mockInitialpagination);

    // Override state
    const newPagination: Pagination = {
      page: 2,
      collectionSize: 25,
      sortOrder: 'asc',
      sortField: 'name',
    };
    // Act
    service.setPagination(newPagination);

    // Assert
    expect(service.getPagination()).toEqual(newPagination);
  });

  it('should throw error for invalid collectionSize', () => {
    // Arrange
    const invalidPagination: Pagination = {
      page: 1,
      collectionSize: -1, // Invalid
      sortOrder: 'asc',
      sortField: 'name',
    };
    // Act & Assert
    expect(() => {
      service.setPagination(invalidPagination);
    }).toThrowError();
  });
  it('should set pagination state with maximum collection size', () => {
    const paginationState: Pagination = {
      page: 2,
      collectionSize: Number.MAX_SAFE_INTEGER,
      sortOrder: 'asc',
      sortField: 'id',
    };
    service.setPagination(paginationState);
    expect(service.getPagination()).toEqual(paginationState);
  });

  // new
  it('should throw error for invalid page', () => {
    // Arrange
    const invalidPagination: Pagination = {
      page: -1, // Invalid
      collectionSize: 10,
      sortOrder: 'asc',
      sortField: 'name',
    };

    // Act & Assert
    expect(() => {
      service.setPagination(invalidPagination);
    }).toThrowError();
  });
  //TODO Fix this test - tipado
  // it('should throw error for invalid sortOrder', () => {
  //   // Arrange
  //   const invalidPagination: Pagination = {
  //     page: 1,
  //     collectionSize: 10,
  //     sortOrder: 'asx', // Invalid
  //     sortField: 'name',
  //   };

  //   // Act & Assert
  //   expect(() => {
  //     service.setPagination(invalidPagination);
  //   }).toThrowError();
  // });
  // TODO Fix this test - tipado
  // it('should throw error for invalid sortField', () => {
  //   // Arrange
  //   const invalidPagination: Pagination = {
  //     page: 1,
  //     collectionSize: 10,
  //     sortOrder: 'asc',
  //     sortField: 'id', // Invalid
  //   };

  //   // Act & Assert
  //   expect(() => {
  //     service.setPagination(invalidPagination);
  //   }).toThrowError();
  // });

  it('should allow max collectionSize value', () => {
    // Arrange
    const pagination: Pagination = {
      page: 1,
      collectionSize: Number.MAX_SAFE_INTEGER,
      sortOrder: 'asc',
      sortField: 'name',
    };

    // Act
    service.setPagination(pagination);

    // Assert
    expect(service.getPagination().collectionSize).toBe(
      Number.MAX_SAFE_INTEGER
    );
  });
});
