import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, forkJoin, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private initialized = false;

  private pokemonCache = new Map<number, any>();
  private efectividadCache = new Map<number, any>();
  private tiposCache = new Map<number, any>();
  private evolucionesCache = new Map<number, any>();
  private allPokemons: any[] = [];
  private allTipos: any[] = [];

  constructor(private http: HttpClient) {}

  preload(): void {
    if (this.initialized) return;

    const cacheOk = this.restoreCacheFromLocalStorage();
    if (cacheOk) {
      this.initialized = true;
      console.log('Precarga recuperada desde localStorage');
      return;
    }

    forkJoin({
      pokemons: this.getAllPokemons(),
      tipos: this.getAllTipos()
    }).subscribe(({ pokemons, tipos }) => {
      this.allPokemons = pokemons['member'];
      this.saveAllPokemonsToCache(this.allPokemons);

      this.allTipos = tipos['member'];
      this.allTipos.forEach((tipo: any) => {
        this.tiposCache.set(tipo.id, tipo);
      });

      const primeros151 = this.allPokemons.slice(0, 151);
      const loteSize = 75;
      const lotes: any[][] = [];

      for (let i = 0; i < primeros151.length; i += loteSize) {
        lotes.push(primeros151.slice(i, i + loteSize));
      }

      of(...lotes).pipe(
        concatMap((lote) => {
          const pokemonRequests = lote.map(pokemon => this.getPokemon(pokemon.id));
          return forkJoin(pokemonRequests).pipe(
            concatMap((pokemonResults) => {
              pokemonResults.forEach((res: any) => {
                const id = res.id;
                this.pokemonCache.set(id, res);
                this.savePokemonToCache(id, res);
              });

              const evolucionesRequests = pokemonResults.map((res: any) =>
                this.getEvoluciones(res.id).pipe(
                  tap((evoData) => {
                    this.evolucionesCache.set(res.id, evoData);
                    localStorage.setItem(`evoluciones_${res.id}`, JSON.stringify(evoData));
                  })
                )
              );

              return forkJoin(evolucionesRequests);
            })
          );
        })
      ).subscribe({
        complete: () => {
          const tipoIds = Array.from(new Set(
            this.allPokemons.slice(0, 151).flatMap(p =>
              p.tipos?.map((t: any) => t.id) || []
            )
          ));

          const efectividadRequests = tipoIds.map(id =>
            this.getEfectividad(id).pipe(
              tap((ef) => {
                this.efectividadCache.set(id, ef);
                localStorage.setItem(`efectividad_${id}`, JSON.stringify(ef));
              })
            )
          );

          forkJoin(efectividadRequests).subscribe(() => {
            this.saveCacheToLocalStorage();
            this.initialized = true;
            console.log('Precarga completa y cache guardada en localStorage');
          });
        }
      });
    });
  }

  saveTiposToCache(tipos: any[]): void {
    this.allTipos = tipos;
  }

  savePokemonToCache(id: number, data: any): void {
    this.pokemonCache.set(id, data);
    localStorage.setItem(`pokemon_${id}`, JSON.stringify(data));
  }

  saveEvolucionesToCache(id: number, data: any): void {
    this.evolucionesCache.set(id, data);
  }

  saveAllPokemonsToCache(pokemons: any[]): void {
    this.allPokemons = pokemons;
    localStorage.setItem('allPokemons', JSON.stringify(pokemons));
  }

  restoreCacheFromLocalStorage(): boolean {
    try {
      const allPokemonsStr = localStorage.getItem('allPokemons');
      if (!allPokemonsStr) return false;

      this.allPokemons = JSON.parse(allPokemonsStr);
      this.allPokemons.forEach(p => {
        const pDataStr = localStorage.getItem(`pokemon_${p.id}`);
        if (pDataStr) {
          const pData = JSON.parse(pDataStr);
          this.pokemonCache.set(p.id, pData);
        }
      });

      this.allTipos.forEach(tipo => {
        const efectividadStr = localStorage.getItem(`efectividad_${tipo.id}`);
        if (efectividadStr) {
          this.efectividadCache.set(tipo.id, JSON.parse(efectividadStr));
        }
        const evoStr = localStorage.getItem(`evoluciones_${tipo.id}`);
        if (evoStr) {
          this.evolucionesCache.set(tipo.id, JSON.parse(evoStr));
        }
      });

      return true;
    } catch (e) {
      console.warn('Error restaurando caché local:', e);
      return false;
    }
  }

  getCachedPokemon(id: number): any {
    return this.pokemonCache.get(id);
  }

  getCachedTipos(): any[] {
    return Array.from(this.tiposCache.values());
  }

  getCachedEvoluciones(id: number): any {
    return this.evolucionesCache.get(id);
  }

  getCachedEfectividad(id: number): any {
    return this.efectividadCache.get(id);
  }

  getCachedAllPokemons(): any[] {
    return this.allPokemons;
  }

  getEquipos(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/equipos`);
  }

  getEquiposId(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/equipos/${id}`);
  }

  getAllEquipos(id: number, usuarios: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/${usuarios}/${id}/equipos`);
  }

  getLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:8000/api/login', credentials);
  }

  getRegistro(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/usuarios`);
  }

  getAllPokemons(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/pokemons`);
  }

  getPokemon(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/pokemons/${id}`);
  }

  getEvoluciones(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/pokemons/${id}/evoluciones`);
  }

  getAllTipos(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/tipos`);
  }

  getTipos(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/tipos/${id}`);
  }

  getEfectividad(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/tipos/${id}/efectividad`);
  }

  saveCacheToLocalStorage(): void {
    localStorage.setItem('allPokemons', JSON.stringify(this.allPokemons));
    this.pokemonCache.forEach((data, id) => {
      localStorage.setItem(`pokemon_${id}`, JSON.stringify(data));
    });
    this.efectividadCache.forEach((data, id) => {
      localStorage.setItem(`efectividad_${id}`, JSON.stringify(data));
    });
    this.evolucionesCache.forEach((data, id) => {
      localStorage.setItem(`evoluciones_${id}`, JSON.stringify(data));
    });
  }
}
