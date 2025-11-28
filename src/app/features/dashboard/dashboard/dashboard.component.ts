import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { ApiService } from '../../../../app/core/services/api.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

Chart.register(...registerables); // Important for all chart types

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  scholarships: any[] = [];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  barChartData: ChartData<'bar'> = { labels: [], datasets: [{ label: 'Amount', data: [] }] };
  pieChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
  doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [] }] };
  lineChartData: ChartData<'line'> = { labels: [], datasets: [{ label: 'Trend', data: [], fill: false }] };
  radarChartData: ChartData<'radar'> = { labels: [], datasets: [{ label: 'Score', data: [] }] };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.get('/scholarships').subscribe((data: any[]) => {
      this.scholarships = data;
      this.prepareCharts();
    });
  }

  prepareCharts() {
    const labels = this.scholarships.map(s => s.name);
    const amounts = this.scholarships.map(s => s.amount);

    this.barChartData.labels = labels;
    this.barChartData.datasets[0].data = amounts;

    this.pieChartData.labels = labels;
    this.pieChartData.datasets[0].data = amounts;

    this.doughnutChartData.labels = labels;
    this.doughnutChartData.datasets[0].data = amounts;

    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = amounts;

    this.radarChartData.labels = labels;
    this.radarChartData.datasets[0].data = amounts;
  }
}
