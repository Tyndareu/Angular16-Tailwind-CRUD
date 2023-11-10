import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Country } from '../../interfaces/country';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-country-form',
  templateUrl: './country-form.component.html',
})
export class CountryFormComponent implements OnInit {
  @Input() country: Country | null = null;
  @Input() newCountry = false;
  @Output() clickSubmit: EventEmitter<Country> = new EventEmitter();
  @Output() clickBack: EventEmitter<void> = new EventEmitter();

  public countryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.countryForm = this.fb.group({
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
  }

  ngOnInit(): void {
    if (!this.country) {
      throw new Error('Country is required to create a form component');
    }
    this.countryForm.patchValue(this.country);
  }

  onSubmitClick() {
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }
    this.clickSubmit.emit(this.countryForm.value);
  }

  onBackClick() {
    this.clickBack.emit();
  }

  isValidField(field: string): boolean {
    const formControl = this.countryForm.get(field);
    return formControl !== null && formControl.invalid && formControl.touched;
  }
}
