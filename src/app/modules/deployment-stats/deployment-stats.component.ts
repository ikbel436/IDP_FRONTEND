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
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';

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
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTabsModule,
  ],
  templateUrl: './deployment-stats.component.html',
  styleUrls: ['./deployment-stats.component.scss']
})
export class DeploymentStatsComponent {
  @ViewChild('chart') chart: ChartComponent;
  selectedTimeframe: string = 'monthly';
  totalDeployments: number | null = null;
  overview: any = {};
  namespaceStats: any[] = [];
  userDeploymentDetails: any[] = [];
  totalUsers: number | null = null;
  totalDeploymentsFreq: number | null = null;
  avgDeploymentsPerUser: number | null = null;
  users: any[] = [];
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

  // Placeholder for chartWeeklyExpenses, chartMonthlyExpenses, and chartYearlyExpenses
  chartWeeklyDeployments: any = {
    chart  : {
      animations: {
          enabled: false,
      },
      fontFamily: 'inherit',
      foreColor : 'inherit',
      height    : '100%',
      type      : 'line',
      sparkline : {
          enabled: true,
      },
  },
    colors: ['#00E396'],
    series: [{ name: 'Weekly Deployments', data: [10, 20, 30, 40, 50] }],
    stroke: { curve: 'smooth', width: 2 },
    tooltip: {
      theme: 'dark',
  },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    yaxis: { show: false }
  };

  chartMonthlyDeployments: any = {
    chart  : {
      animations: {
          enabled: false,
      },
      fontFamily: 'inherit',
      foreColor : 'inherit',
      height    : '100%',
      type      : 'line',
      sparkline : {
          enabled: true,
      },
  },
    colors: ['#FEB019'],
    series: [{ name: 'Monthly Deployments', data: [10, 20, 30, 40, 50] }],
    stroke : {
      curve: 'smooth',
  },
  tooltip: {
      theme: 'dark',
  },
    xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    yaxis  : {
      labels: {
          formatter: (val): string => `$${val}`,
      },
  },
  };

  chartYearlyDeployments: any = {
    chart  : {
      animations: {
          enabled: false,
      },
      fontFamily: 'inherit',
      foreColor : 'inherit',
      height    : '100%',
      type      : 'line',
      sparkline : {
          enabled: true,
      },
  },
    colors: ['#FF4560'],
    series: [{ name: 'Yearly Deployments', data: [100, 200, 300, 400, 500] }],
    stroke : {
      curve: 'smooth',
  },
  tooltip: {
      theme: 'dark',
  },
    xaxis: { categories: ['Q1', 'Q2', 'Q3', 'Q4'] },
    yaxis  : {
      labels: {
          formatter: (val): string => `$${val}`,
      },
  },
  };

  constructor(private dialog: MatDialog,private deploymentsService: DeploymentsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchStats();
    this.fetchSuccessRate();
    this.fetchDeploymentFrequency();
    this.fetchUsers();
  }
  onUpdateMember(member: any): void {
    // Handle update member logic
    console.log('Update member', member);
  }
  openAddUserDialog(member: any): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: member 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.fetchUsers();
      }
    });
  }
  onDeleteMember(member: any): void {
    this.authService.deleteUser(member._id).subscribe(
      (response) => {
        console.log(response.msg);
        this.fetchUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }
  fetchUsers(): void {
    this.authService.getUsers().subscribe(
      (response) => {
        this.users = response.users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
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

  changeTimeframe(newTimeframe: string): void {
    this.selectedTimeframe = newTimeframe;
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
