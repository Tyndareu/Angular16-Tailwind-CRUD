import { Injectable } from '@angular/core';
import { Pagination } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PaginationStateService {
  private paginationState: Pagination = {
    page: 0,
    collectionSize: 12,
    sortOrder: 'desc',
    sortField: 'name',
  };

  setPagination(paginationState: Pagination) {
    const { page, collectionSize, sortOrder, sortField } = paginationState;
    if (collectionSize < 1) {
      throw new Error('Collection size must be greater than 0');
    }
    if (page < 0) {
      throw new Error('Page must be greater than 0');
    }
    this.paginationState = {
      page,
      collectionSize,
      sortOrder,
      sortField,
    };
  }

  getPagination() {
    return { ...this.paginationState };
  }
}
