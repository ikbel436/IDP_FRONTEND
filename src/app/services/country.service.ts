import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Country } from 'app/models/country.types';
import { countries } from 'app/mock-api/apps/contacts/data';

@Injectable({ providedIn: 'root' })
export class CountryService {
  // Private
  private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);

  country: Country[];

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for countries
   */
  get countries$(): Observable<Country[]> {
    return this._countries.asObservable();
  }

  /**
   * Get country info by code
   *
   * @param code
   */
  getCountryByCode(code: string): Country {
    return countries.find((country) => country.code === code);
  }

  getCountryByIso(iso: string): Country {
    return countries.find((country) => country.iso === iso);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get countries
   */
  getCountries(): Observable<Country[]> {
    if (this.country) {
      return of(this.country);
    } else {
      return this._httpClient.get<Country[]>('api/apps/contacts/countries').pipe(
        tap((countries) => {
          this._countries.next(countries);
          this.country = countries;
        })
      );
    }
  }
}
