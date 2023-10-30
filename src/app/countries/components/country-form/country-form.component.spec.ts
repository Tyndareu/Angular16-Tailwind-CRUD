import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryFormComponent } from './country-form.component';
import { Country } from '../../interfaces/country';
import { CountriesModule } from '../../countries.module';

const mockCountry: Country = {
  id: 1,
  name: 'Spain',
  code: 'ES',
};

describe('CountryFormComponent', () => {
  let component: CountryFormComponent;
  let fixture: ComponentFixture<CountryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryFormComponent],
      imports: [CountriesModule],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryFormComponent);
    component = fixture.componentInstance;
    component.country = mockCountry;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct country data', () => {
    // Arrange
    const countryForm = component.countryForm;
    // Assert
    expect(countryForm.value).toEqual({
      id: 1,
      name: 'Spain',
      code: 'ES',
    });
  });
  it('should validate the form correctly', () => {
    const countryForm = component.countryForm;

    countryForm.controls['name'].setValue('');
    expect(countryForm.invalid).toBeTruthy();

    countryForm.controls['code'].setValue('');
    expect(countryForm.invalid).toBeTruthy();

    countryForm.controls['name'].setValue('Mexico');
    countryForm.controls['code'].setValue('MX');
    expect(countryForm.valid).toBeTruthy();
  });

  it('should emit the country data when the submit button is clicked', () => {
    // Arrange
    const countryForm = component.countryForm;
    const clickSubmitSpy = spyOn(component.clickSubmit, 'emit');

    countryForm.controls['name'].setValue('Mexico');
    countryForm.controls['code'].setValue('MX');
    // Act
    component.onSubmitClick();
    // Assert
    expect(clickSubmitSpy).toHaveBeenCalledWith({
      id: 1,
      name: 'Mexico',
      code: 'MX',
    });
  });

  it('should emit the back event when the back button is clicked', () => {
    // Arrange
    const clickBackSpy = spyOn(component.clickBack, 'emit');
    // Act
    component.onBackClick();
    // Assert
    expect(clickBackSpy).toHaveBeenCalled();
  });

  it('should throw an error if country input is null', function () {
    component.country = null;
    expect(() => {
      component.ngOnInit();
    }).toThrowError('Country is required to create a form component');
  });

  // submits valid form data
  it('should submit valid form data', () => {
    component.countryForm.setValue({
      id: 1,
      name: 'USA',
      code: 'US',
    });
    spyOn(component.clickSubmit, 'emit');

    component.onSubmitClick();

    expect(component.clickSubmit.emit).toHaveBeenCalledWith({
      id: 1,
      name: 'USA',
      code: 'US',
    });
  });

  // does not emit clickSubmit event when form is invalid
  it('should not emit clickSubmit event when form is invalid', () => {
    component.countryForm.setValue({
      id: 1,
      name: '',
      code: 'US',
    });
    spyOn(component.clickSubmit, 'emit');

    component.onSubmitClick();

    expect(component.clickSubmit.emit).not.toHaveBeenCalled();
  });
});
