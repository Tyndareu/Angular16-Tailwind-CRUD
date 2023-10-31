import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryListComponent } from './country-list.component';
import { Country } from '../../interfaces/country';

describe('CountryListComponent', () => {
  let component: CountryListComponent;
  let fixture: ComponentFixture<CountryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryListComponent],
    });
    fixture = TestBed.createComponent(CountryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit deleteCountry event with valid country object', () => {
    const country: Country = { id: 1, code: 'US', name: 'United States' };
    spyOn(component.deleteCountry, 'emit');

    component.onDeleteCountry(country);

    expect(component.deleteCountry.emit).toHaveBeenCalledWith(country);
  });
});
