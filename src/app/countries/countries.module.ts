import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CountriesRoutingModule } from './countries-routing.module';
import { MaterialModule } from '../material/material/material.module';

import { CountriesListComponent } from './pages/countries-list/countries-list.component';
import { CountryByIdComponent } from './pages/country-by-id/country-by-id.component';
import { CountryFormComponent } from './components/country-form/country-form.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { NewCountryComponent } from './pages/new-country/new-country.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CountriesListComponent,
    CountryByIdComponent,
    CountryFormComponent,
    CountryListComponent,
    NewCountryComponent,
  ],
  imports: [
    CommonModule,
    CountriesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class CountriesModule {}
