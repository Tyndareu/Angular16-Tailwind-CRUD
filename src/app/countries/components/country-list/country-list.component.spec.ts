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

  it('should emit the deleteCountry event with a valid country object', () => {
    // Arrange
    const country: Country = { id: 1, code: 'US', name: 'United States' };
    spyOn(component.deleteCountry, 'emit');

    // Act
    component.onDeleteCountry(country);

    // Assert
    expect(component.deleteCountry.emit).toHaveBeenCalledWith(country);
  });
});
