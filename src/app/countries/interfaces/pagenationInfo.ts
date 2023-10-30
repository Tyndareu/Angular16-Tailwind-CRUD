export interface PaginationInfo {
  totalPages: number | null;
  pageNumber: number;
  size: number;
  sortOrder?: string;
  sortField?: string;
}

export interface PaginationSave {
  pageNumber: number;
  size: number;
  sortOrder: 'asc' | 'desc';
  sortField: 'name' | 'id';
}
