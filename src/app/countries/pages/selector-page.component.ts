import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../services/countries.service';
import { Region, Smallcountry } from '../interfaces/country.interfaces';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'selector-page',
  templateUrl: 'selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {
  public countriesByRegion:Smallcountry[] =[];
  public borders : Smallcountry [] = [];
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}
  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChange();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges.pipe(
      tap(() => this.myForm.get('country')!.setValue('')),
      switchMap(region => this.countriesService.getCountriesByRegion(region))
    ).subscribe((value) => {
      this.countriesByRegion = value;
    });
  }

  onCountryChange():void{
    this.myForm.get('country')!.valueChanges.pipe(
      tap(() => this.myForm.get('borders')!.setValue('')),
       switchMap(code => this.countriesService.getCountryByAlphaCode(code)),
       switchMap(country => this.countriesService.getCountryBordersByCodes(country.borders)),
    ).subscribe(value => {
      this.borders = value;
    });
  }
}
