import { Component, OnInit, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Restaurants } from '../../services/restaurants';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-admin-restaurant-form',
  styleUrl: './restaurant-form.scss',
  templateUrl: './restaurant-form.html',
})
export class AdminRestaurantForm implements OnInit {
  private readonly restaurantsService = inject(Restaurants);
  private readonly router = inject(Router);

  // ":id" z adresu — przy tworzeniu nowej restauracji jest puste
  readonly id = input<string>();

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    cuisine: ['', Validators.required],
    imageUrl: [''],
    deliveryTimeMin: [20, [Validators.required, Validators.min(1)]],
    deliveryTimeMax: [40, [Validators.required, Validators.min(1)]],
    deliveryFee: [0, [Validators.required, Validators.min(0)]],
    minimumOrderValue: [0, [Validators.required, Validators.min(0)]],
    address: ['', Validators.required],
    isActive: [true],
  });

  get isEdit() {
    return !!this.id();
  }

  ngOnInit(): void {
    // w trybie edycji wypełniamy formularz danymi restauracji
    if (this.isEdit) {
      const restaurant = this.restaurantsService.getById(Number(this.id()));
      if (restaurant) {
        this.form.patchValue(restaurant);
      }
    }
  }

  // pokazuje błąd dopiero, gdy użytkownik dotknął pola
  hasError(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.getRawValue();
    if (this.isEdit) {
      this.restaurantsService.update(Number(this.id()), formData);
    } else {
      this.restaurantsService.create(formData);
    }
    this.router.navigate(['/admin/restaurants']);
  }
}
