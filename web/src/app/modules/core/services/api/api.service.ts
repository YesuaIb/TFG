import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonWithTypes(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${name}`).pipe(
      mergeMap(pokemon => {
        const typeRequests: Observable<any>[] = pokemon.types.map((type: any) =>
          this.http.get<any>(type.type.url)
        );

        return forkJoin(typeRequests).pipe(
          map((typeResponses: any[]) => {
            pokemon.types = pokemon.types.map((t: any, index: number) => ({
              ...t,
              typeDetails: typeResponses[index]
            }));
            return pokemon;
          })
        );
      })
    );
  }

  getPokemonSpecies(name: string): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  }

  getEvolutionChain(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getAllTypes(): Observable<any[]> {
    return this.http.get<any>('https://pokeapi.co/api/v2/type').pipe(
      map(response => response.results.filter((t: any) => t.name !== 'shadow' && t.name !== 'unknown'))
    );
  }  
}
