import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CountriesRoutingModule } from './countries-routing.module';
import { SelectorPageComponent } from './pages/selector-page.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [CommonModule,
    CountriesRoutingModule,
  ReactiveFormsModule],
  exports: [],
  declarations: [SelectorPageComponent],
  providers: [],
})
export class CountriesModule { }

