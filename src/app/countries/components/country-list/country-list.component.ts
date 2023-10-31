import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
})
export class CountryListComponent {
  @Input() countries: Country[] = [];
  @Output() deleteCountry: EventEmitter<Country> = new EventEmitter();

  constructor() {}
  onDeleteCountry(country: Country) {
    this.deleteCountry.emit(country);
  }
}
