import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesListComponent } from './pages/countries-list/countries-list.component';
import { CountryByIdComponent } from './pages/country-by-id/country-by-id.component';
import { NewCountryComponent } from './pages/new-country/new-country.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'new-country',
    component: NewCountryComponent,
  },
  {
    path: 'list',
    component: CountriesListComponent,
  },
  {
    path: 'country/:id',
    component: CountryByIdComponent,
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountriesRoutingModule {}
