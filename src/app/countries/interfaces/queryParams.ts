export interface QueryParams {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  collectionSize: number;
  sortOrder: 'asc' | 'desc';
  sortField: 'id' | 'name';
}
