import { Component, Input, OnInit, signal } from '@angular/core';

import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-country-by-id',
  templateUrl: './country-by-id.component.html',
})
export class CountryByIdComponent implements OnInit {
  @Input() id?: string;
  public country = signal<Country | null>(null);
  public loading = true;

  constructor(
    private countriesService: CountriesService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    if (this.id) {
      this.countriesService.getCountryById(this.id).subscribe({
        next: country => {
          this.country.set(country);
        },
        error: err => {
          this.country.set(null);
          console.error(err);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
  onSubmit(country: Country) {
    if (country.code === '' || country.name === '') {
      return;
    }
    this.countriesService.editCountryById(country).subscribe({
      next: () => {
        this.toast.success('Updated!');
        setTimeout(() => {
          this.router.navigateByUrl('countries/list');
        }, 500);
      },
      error: err => {
        this.toast.error('Error getting Country!');
        console.error(err);
      },
    });
  }
  backButton() {
    this.router.navigateByUrl('countries/list');
  }
}
