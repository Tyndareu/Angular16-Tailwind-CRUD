import { Component, signal } from '@angular/core';
import { Country, NewCountry } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-country',
  templateUrl: './new-country.component.html',
})
export class NewCountryComponent {
  public country = signal<Country>({
    id: 0,
    code: '',
    name: '',
  });

  constructor(
    private countriesService: CountriesService,
    private router: Router,
    private toast: ToastrService
  ) {}

  onSubmit(country: Country) {
    if (country.code === '' || country.name === '') {
      throw Error('Invalid country object');
    }
    const newCountry: NewCountry = {
      name: country.name,
      code: country.code,
    };
    this.countriesService.newCountry(newCountry).subscribe({
      next: () => {
        this.toast.success('Created!');
        this.router.navigateByUrl('countries/list');
      },
      error: err => {
        this.toast.error('Error creating country!');
        throw Error(err);
      },
    });
  }
  backButton() {
    this.router.navigateByUrl('countries/list');
  }
}
