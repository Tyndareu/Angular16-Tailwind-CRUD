import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Country } from '../../interfaces/country';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-country-form',
  templateUrl: './country-form.component.html',
})
export class CountryFormComponent implements OnInit {
  @Input() country: Country | null = null;
  @Input() newCountry = false;
  @Output() clickSubmit: EventEmitter<Country> = new EventEmitter();
  @Output() clickBack = new EventEmitter();

  public countryForm: FormGroup = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    code: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[A-Z]{2}$/),
      ],
    ],
  });

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    if (!this.country)
      throw Error('Country is required to create a form component');
    this.countryForm.patchValue(this.country);
  }

  onSubmitClick() {
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }
    //this.countryForm.reset();
    this.clickSubmit.emit(this.countryForm.value);
  }

  onBackClick() {
    this.clickBack.emit();
  }
  isValidField(field: string) {
    return (
      this.countryForm.controls[field].errors &&
      this.countryForm.controls[field].touched
    );
  }
}
