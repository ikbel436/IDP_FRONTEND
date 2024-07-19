import { Component, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DeploymentsService } from '../get-deployments/deployments.service';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-deployment-stats',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTooltipModule,
    NgClass,
    NgFor,
    CurrencyPipe,
    DecimalPipe,
  ],
  templateUrl: './deployment-stats.component.html',
  styleUrls: ['./deployment-stats.component.scss']
})
export class DeploymentStatsComponent {
  @ViewChild('chart') chart: ChartComponent;
  selectedTimeframe: string = 'daily';
  totalDeployments: number | null = null;
  overview: any = {};
  namespaceStats: any[] = [];
  userDeploymentDetails: any[] = [];
  totalUsers: number | null = null;
  totalDeploymentsFreq: number | null = null;
  avgDeploymentsPerUser: number | null = null;
  
  chartOptions: any = {
    series: [{
      name: 'Deployments',
      data: []
    }],
    chart: {
      type: 'line',
      height: 350,
    },
    xaxis: {
      categories: [],
    },
    stroke: {
      width: 2
    },
    dataLabels: {
      enabled: true
    }
  };

  radarChartOptions: any = {
    series: [],
    chart: {
      type: 'radar',
      height: 350,
    },
    labels: [],
    legend: {
      position: 'top'
    },
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColor: '#e9e9e9',
          fill: {
            colors: ['#f8f8f8', '#fff']
          }
        }
      }
    },
    stroke: {
      width: 2
    },
    tooltip: {
      enabled: true
    },
    yaxis: {
      show: true,
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        }
      }
    }
  };

  constructor(private deploymentsService: DeploymentsService) { }

  ngOnInit(): void {
    this.fetchStats();
    this.fetchSuccessRate();
    this.fetchDeploymentFrequency();
  }

  fetchStats(): void {
    this.deploymentsService.getDeploymentStats(this.selectedTimeframe).subscribe(
      (data) => {
        this.totalDeployments = data.totalDeployments;
        this.overview = data.overview;
        this.updateChartData(data);
      },
      (error) => {
        console.error('Error fetching deployment statistics:', error);
      }
    );
  }

  fetchSuccessRate(): void {
    this.deploymentsService.getDeploymentSuccessRate(this.selectedTimeframe).subscribe(
      (data) => {
        this.namespaceStats = data.namespaceStats;
        this.updateRadarChartData(data.namespaceStats);
      },
      (error) => {
        console.error('Error fetching deployment success rate statistics:', error);
      }
    );
  }

  fetchDeploymentFrequency(): void {
    this.deploymentsService.getDeploymentFrequency(this.selectedTimeframe).subscribe(
      (data) => {
        this.totalUsers = data.totalUsers;
        this.totalDeploymentsFreq = data.totalDeployments;
        this.avgDeploymentsPerUser = data.avgDeploymentsPerUser;
        this.userDeploymentDetails = data.userDeploymentDetails;
      },
      (error) => {
        console.error('Error fetching deployment frequency statistics:', error);
      }
    );
  }

  updateChartData(data: any): void {
    this.chartOptions.series[0].data = data.deployments;
    this.chartOptions.xaxis.categories = data.labels;
    this.updateChart();
  }

  updateRadarChartData(namespaceStats: any): void {
    this.radarChartOptions.series = [{
      name: 'Success Rate',
      data: namespaceStats.map(stat => stat.successRate)
    }];
    this.radarChartOptions.labels = namespaceStats.map(stat => stat.namespace);
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.updateOptions(this.chartOptions);
    }
  }

  onTimeframeChange(event: any): void {
    this.selectedTimeframe = event.value;
    this.fetchStats();
    this.fetchSuccessRate();
    this.fetchDeploymentFrequency();
  }

  getAvgSuccessRate(): number {
    if (this.namespaceStats.length === 0) {
      return 0;
    }
    const total = this.namespaceStats.reduce((sum, stat) => sum + parseFloat(stat.successRate), 0);
    return total / this.namespaceStats.length;
  }
}