
import { Injectable } from '@angular/core';
import { Country, Region, Smallcountry } from '../interfaces/country.interfaces';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private baseUrl:string = 'https://restcountries.com/v3.1';
  constructor(private http:HttpClient) { }
  private _regions: Region[]=[Region.Africa,Region.Americas,Region.Asia,Region.Europe,Region.Oceania];

  get regions():Region[]{
    return [...this._regions];
  }
  getCountriesByRegion(region:Region):Observable<Smallcountry[]>{
    if (!region ) return of([]);
    const url:string = `${ this.baseUrl}/region/${region}?fields=cca3,name,borders`;
    return this.http.get<Country[]>(url).pipe(
      map(countries => countries.map(country => ({
        name:country.name.common,
        cca3:country.cca3,
        borders:country.borders ?? [],
      })))
    )
  }

  getCountryByAlphaCode(cca3:string):Observable<Smallcountry>{
    if (!cca3 ) return of();
    const url:string = `${ this.baseUrl}/alpha/${cca3}?fields=cca3,name,borders`;
    return this.http.get<Country>(url)
    .pipe(
      map(country => ({
        name: country.name.common,
        cca3:country.cca3,
        borders:country.borders ??[],
      }))
    )
  }

  getCountryBordersByCodes(borders:string[]):Observable<Smallcountry[]>{
    if (!borders || borders.length == 0) return of([]);

    const countryRequest:Observable<Smallcountry>[] = [];

    borders.forEach(code => {
      const request = this.getCountryByAlphaCode(code);
      countryRequest.push(request);
    });

    return combineLatest(countryRequest)
  }
}
