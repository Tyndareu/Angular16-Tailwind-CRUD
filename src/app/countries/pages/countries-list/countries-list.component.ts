import { Component, OnInit, signal } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';
import {
  QueryParams,
  PaginationInfo,
  SortField,
  SortOrder,
} from '../../interfaces/interfaces';
import { PaginationStateService } from '../../services/pagination-state.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { catchError, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
})
export class CountriesListComponent implements OnInit {
  countries = signal<Country[]>([]);
  isLoading = false;
  pageSizeOptions = [12, 24, 36, 48];
  sortOrder: SortOrder[] = ['asc', 'desc'];
  sortField: SortField[] = ['name', 'id'];

  paginationInfo: PaginationInfo = {
    totalPages: null,
    pageNumber: 0,
    size: 12,
    sortOrder: 'desc',
    sortField: 'name',
  };

  queryParams: QueryParams = {
    pagination: {
      page: 0,
      collectionSize: 12,
      sortOrder: 'desc',
      sortField: 'name',
    },
  };

  constructor(
    private countriesService: CountriesService,
    private paginationStateService: PaginationStateService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.queryParams.pagination = this.paginationStateService.getPagination();
    this.loadCountries();
  }

  loadCountries() {
    this.isLoading = true;

    this.countriesService.getCountries(this.queryParams).subscribe({
      next: response => {
        const { content, totalPages, number, size } = response;

        this.countries.set(content);

        this.paginationInfo = {
          totalPages,
          pageNumber: number + 1,
          size,
        };

        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.toast.error('Error loading countries');
        console.error(err);
      },
    });
  }

  generatePageNumbers(totalPages: number) {
    if (totalPages < 0) return [0];
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  updatePage(page: number) {
    if (page < 0) throw Error('Page number is invalid');
    this.queryParams.pagination.page = page - 1;
    this.updatePagination();
  }

  updateSort(order: 'asc' | 'desc') {
    this.queryParams.pagination.sortOrder = order;
    this.updatePagination();
  }

  updateSortField(field: 'name' | 'id') {
    this.queryParams.pagination.sortField = field;
    this.updatePagination();
  }

  updateSize(size: number) {
    if (size < 0) throw Error('Page size is invalid');
    this.queryParams.pagination.page = 0;
    this.queryParams.pagination.collectionSize = size;
    this.updatePagination();
  }

  updatePagination() {
    this.paginationStateService.setPagination(this.queryParams.pagination);
    this.loadCountries();
  }

  deleteCountry(country: Country) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: country.name,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(result => result),
        switchMap(() => this.countriesService.deleteCountryById(country.id)),
        catchError(() => of(this.toast.error('Error deleting country')))
      )
      .subscribe(() => {
        this.toast.success('Country deleted!');
        this.loadCountries();
      });
  }
}
