import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, QueryList, Renderer2, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-template-terraform',
  standalone     : true,
  imports        : [MatButtonToggleModule, FormsModule, NgFor, FuseCardComponent, MatButtonModule, MatIconModule, RouterLink, NgClass, MatMenuModule, MatCheckboxModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, TitleCasePipe],

  templateUrl: './template-terraform.component.html',
  styleUrl: './template-terraform.component.scss'
})
export class TemplateTerraformComponent implements AfterViewInit{
  @ViewChildren(FuseCardComponent, {read: ElementRef}) private _fuseCards: QueryList<ElementRef>;

    filters: string[] = ['all', 'aws', 'azure', 'GCP'];
    numberOfCards: any = {};
    selectedFilter: string = 'all';

    /**
     * Constructor
     */
    constructor(private _renderer2: Renderer2,private router: Router,private dialog: MatDialog)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Calculate the number of cards
        this._calcNumberOfCards();

        // Filter the cards for the first time
        this._filterCards();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On filter change
     *
     * @param change
     */
    onFilterChange(change: MatButtonToggleChange): void
    {
        // Set the filter
        this.selectedFilter = change.value;

        // Filter the cards
        this._filterCards();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _calcNumberOfCards(): void
    {
        // Prepare the numberOfCards object
        this.numberOfCards = {};

        // Prepare the count
        let count = 0;

        // Go through the filters
        this.filters.forEach((filter) =>
        {
            // For each filter, calculate the card count
            if ( filter === 'all' )
            {
                count = this._fuseCards.length;
            }
            else
            {
                count = this.numberOfCards[filter] = this._fuseCards.filter(fuseCard => fuseCard.nativeElement.classList.contains('filter-' + filter)).length;
            }

            // Fill the numberOfCards object with the counts
            this.numberOfCards[filter] = count;
        });
    }

    /**
     * Filter the cards based on the selected filter
     *
     * @private
     */
    private _filterCards(): void
    {
        // Go through all fuse-cards
        this._fuseCards.forEach((fuseCard) =>
        {
            // If the 'all' filter is selected...
            if ( this.selectedFilter === 'all' )
            {
                // Remove hidden class from all cards
                fuseCard.nativeElement.classList.remove('hidden');
            }
            // Otherwise...
            else
            {
                // If the card has the class name that matches the selected filter...
                if ( fuseCard.nativeElement.classList.contains('filter-' + this.selectedFilter) )
                {
                    // Remove the hidden class
                    fuseCard.nativeElement.classList.remove('hidden');
                }
                // Otherwise
                else
                {
                    // Add the hidden class
                    fuseCard.nativeElement.classList.add('hidden');
                }
            }
        });
    }
    downloadZIP() {
        // URL vers le fichier PDF à télécharger
        const pdfUrl = '/assets/ZIP/ECS_final.zip';
        
        // Création d'un élément <a> dynamique
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'ECS_final.zip'; // Nom du fichier téléchargé
        link.target = '_blank'; // Pour ouvrir dans un nouvel onglet
        document.body.appendChild(link);
    
        // Déclencher le téléchargement
        link.click();
    
        // Nettoyage
        document.body.removeChild(link);
      }
      downloadZIP1() {
        // URL vers le fichier PDF à télécharger
        const pdfUrl = '/assets/ZIP/EKS.zip';
        
        // Création d'un élément <a> dynamique
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'EKS.zip'; // Nom du fichier téléchargé
        link.target = '_blank'; // Pour ouvrir dans un nouvel onglet
        document.body.appendChild(link);
    
        // Déclencher le téléchargement
        link.click();
    
        // Nettoyage
        document.body.removeChild(link);
      }
      navigateToDetails() {
        this.router.navigate(['/ui/page-layouts/overview']); 
      }
      navigateToDetails1() {
        this.router.navigate(['/ui/page-layouts/overview1']); 
      }
      navigateToDetails2() {
        this.router.navigate(['/ui/page-layouts/overview2']); 
      }
      navigateToDetails3() {
        this.router.navigate(['/ui/page-layouts/overview3']); 
      }
      // openImageDialog(): void {
      //   this.dialog.open(ImageDialogComponent, {
      //     width: '50vw',
      //     height: '80vh',
      //     data: { imageSrc: 'assets/images/cards/architecture aws micro service-2-.png' } // Pass the image source to the dialog
      //   });
      // }
      // openImageDialog1(): void {
      //   this.dialog.open(ImageDialogComponent, {
      //     width: '50vw',
      //     height: '80vh',
      //     data: { imageSrc: 'assets/images/cards/ECS.jpg' } // Pass the image source to the dialog
      //   });
      // }
      // openImageDialog2(): void {
      //   this.dialog.open(ImageDialogComponent, {
      //     width: '50vw',
      //     height: '80vh',
      //     data: { imageSrc: 'assets/images/cards/basic-webapp-v2.png' } // Pass the image source to the dialog
      //   });
      // }
      // openImageDialog3(): void {
      //   this.dialog.open(ImageDialogComponent, {
      //     width: '50vw',
      //     height: '80vh',
      //     //https://learn.microsoft.com/en-us/azure/architecture/example-scenario/serverless/microservices-with-container-apps
      //     //https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-microservices/aks-microservices
      //     data: { imageSrc: 'assets/images/cards/aks.png' } // Pass the image source to the dialog
      //   });
      // }
      // openCostEstimationDialog(): void {
      //   const dialogRef = this.dialog.open(CostEstimationDialogComponent, {
      //     width: '1000px',
      //     height: '800vh',

      //      // Adjust width as needed
      //   });
      // }
      // openCostEstimationDialog1(): void {
      //   const dialogRef = this.dialog.open(CostEstimationDialog1Component, {
      //     width: '1000px',
      //     height: '800vh',

      //      // Adjust width as needed
      //   });
      // }
      // openCostEstimationDialog2(): void {
      //   const dialogRef = this.dialog.open(CostEstimationDialog2Component, {
      //     width: '1000px',
      //     height: '800vh',

      //      // Adjust width as needed
      //   });
      // }
}
