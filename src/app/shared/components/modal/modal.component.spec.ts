import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalComponent } from './modal.component';
import { Country } from 'src/app/countries/interfaces/country';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ModalComponent>>;

  const mockCountry: Country = {
    name: 'Test Country',
    code: 'TC',
    id: 1,
  };

  beforeEach(() => {
    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockCountry },
      ],
    });

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ModalComponent>
    >;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with false when no clicked', () => {
    component.onNoClick();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true when confirm clicked', () => {
    component.onConfirm();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
