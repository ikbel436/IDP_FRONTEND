import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryProject } from './project.types';
import { catchError } from 'rxjs/operators';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    // Private
    private _project: BehaviorSubject<InventoryProject | null> =
        new BehaviorSubject(null);
    private _projects: BehaviorSubject<InventoryProject[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    /**
     * Api Base URL
     */
    private apiUrl = 'http://localhost:3000/';
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for product
     */
    get product$(): Observable<InventoryProject> {
        return this._project.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<InventoryProject[]> {
        return this._httpClient.get<any>(`${this.apiUrl}/get`);
    }

    /**
     * Getter for token
     */
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    // getProducts(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
    //     Observable<{  products: InventoryProject[] }>
    // {
    //     return this._httpClient.get<{  products: InventoryProject[] }>('api/apps/ecommerce/inventory/products', {
    //         params: {
    //             page: '' + page,
    //             size: '' + size,
    //             sort,
    //             order,
    //             search,
    //         },
    //     }).pipe(
    //         tap((response) =>
    //         {
    //             this._products.next(response.products);
    //         }),
    //     );
    // }

    /**
     * Get product by id
     */
    // getProductById(id: string): Observable<InventoryProject>
    // {
    //     return this._products.pipe(
    //         take(1),
    //         map((products) =>
    //         {
    //             // Find the product
    //             const product = products.find(item => item.id === id) || null;

    //             // Update the product
    //             this._product.next(product);

    //             // Return the product
    //             return product;
    //         }),
    //         switchMap((product) =>
    //         {
    //             if ( !product )
    //             {
    //                 return throwError('Could not found product with id of ' + id + '!');
    //             }

    //             return of(product);
    //         }),
    //     );
    // }

    /**
     * Create product
     */
    // createProduct(): Observable<InventoryProject>
    // {
    //     return this.products$.pipe(
    //         take(1),
    //         switchMap(products => this._httpClient.post<InventoryProject>('api/apps/ecommerce/inventory/product', {}).pipe(
    //             map((newProduct) =>
    //             {
    //                 // Update the products with the new product
    //                 this._products.next([newProduct, ...products]);

    //                 // Return the new product
    //                 return newProduct;
    //             }),
    //         )),
    //     );
    // }

    /**
     * Update product
     *
     * @param id
     * @param product
     */
    updateProduct(id: string, product: InventoryProject): Observable<InventoryProject> {
        return this.products$.pipe(
            take(1),
            switchMap(products => {
                // Ensure products is an array before proceeding
                if (!Array.isArray(products)) {
                    console.error('products is not an array:', products);
                    return of(null); // Or handle this case appropriately
                }
    
                return this._httpClient.put<InventoryProject>(`${this.apiUrl}/project/${id}`, {
                    id,
                    product,
                }).pipe(
                    map((updatedProduct) => {
                        // Find the index of the updated product
                        const index = products.findIndex(item => item._id === id);
    
                        // Update the product
                        products[index] = updatedProduct;
    
                        // Update the products
                        this._projects.next(products);
    
                        // Return the updated product
                        return updatedProduct;
                    }),
                    switchMap(updatedProduct => this.product$.pipe(
                        take(1),
                        filter(item => item && item._id === id),
                        tap(() => {
                            // Update the product if it's selected
                            this._project.next(updatedProduct);
    
                            // Return the updated product
                            return updatedProduct;
                        }),
                    )),
                );
            }),
        );
    }
    
    updateProject1(projectId: string, updatedProject: any): Observable<any> {
        return this._httpClient.put(`${this.apiUrl}/project/${projectId}`, updatedProject);
      }
    
    /**
     * Delete the product
     *
     * @param id
     */
      deleteProduct(projectId: string): Observable<any> {
        return this._httpClient.delete(`${this.apiUrl}/project/${projectId}`);
      }
    // deleteProduct(id: string): Observable<boolean>
    // {
    //     return this.products$.pipe(
    //         take(1),
    //         switchMap(products => this._httpClient.delete(`${this.apiUrl}/project/${id}`).pipe(
    //             map((isDeleted: boolean) =>
    //             {
    //                 // Find the index of the deleted product
    //                 const index = products.findIndex(item => item._id === id);

    //                 // Delete the product
    //                 products.splice(index, 1);

    //                 // Update the products
    //                 this._projects.next(products);

    //                 // Return the deleted status
    //                 return isDeleted;
    //             }),
    //         )),
    //     );
    // }

    /**
     * Get
     * Project
     * */

    getProjects(): Observable<InventoryProject[]> {
        
        const token = this.accessToken; 
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );
        return this._httpClient.get<InventoryProject[]>(`${this.apiUrl}/get` , {headers});
    }

    // Inside your ProjectService class
    getProjectsByIds(id: string) {
        // Implement this method based on how your backend API supports fetching projects by IDs
        // This is a placeholder implementation
        return this._httpClient.get<InventoryProject>(`${this.apiUrl}/get/${id}`);
    }

    createProject(
        name: string,
        description: string,
        provider: string,
        lien: string
      ): Observable<InventoryProject> {
        const token = this.accessToken; 
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        const body = { name, description, provider, lien };
      
        return this.products$.pipe(
          take(1),
          switchMap(products => this._httpClient.post<InventoryProject>(`${this.apiUrl}/project`, body, {
            headers,
          }).pipe(
            map((newProduct) => {
              // Update the _project with the new product
              this._project.next(newProduct);
      
              // Return the new product
              return newProduct;
            }),
          )),
        );
      }
      
    // createProject(): Observable<InventoryProject>
    // {
    //     return this.products$.pipe(
    //         take(1),
    //         switchMap(products => this._httpClient.post<InventoryProject>(`${this.apiUrl}/project`, {}).pipe(
    //             map((newProduct) =>
    //             {
    //                 // Update the products with the new product
    //                 this._projects.next([newProduct, ...products]);

    //                 // Return the new product
    //                 return newProduct;
    //             }),
    //         )),
    //     );
    // }

    

}
