import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';  // ✅ use only this
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ApiService } from '../../../../app/core/services/api.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, HeaderComponent, FooterComponent], // ✅ no NgChartsModule
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  scholarships: any[] = [];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  // Chart types
  barType: ChartType = 'bar';
  pieType: ChartType = 'pie';
  doughnutType: ChartType = 'doughnut';
  lineType: ChartType = 'line';
  radarType: ChartType = 'radar';

  // Chart data
  barData: ChartData<'bar', number[], string> = { labels: [], datasets: [{ label: 'Amount', data: [] }] };
  pieData: ChartData<'pie', number[], string> = { labels: [], datasets: [{ data: [] }] };
  doughnutData: ChartData<'doughnut', number[], string> = { labels: [], datasets: [{ data: [] }] };
  lineData: ChartData<'line', number[], string> = { labels: [], datasets: [{ label: 'Trend', data: [], fill: false }] };
  radarData: ChartData<'radar', number[], string> = { labels: [], datasets: [{ label: 'Score', data: [] }] };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.get('/scholarships').subscribe((data: any[]) => {
      this.scholarships = data;
      this.prepareCharts();
    });
  }

  prepareCharts(): void {
    const labels = this.scholarships.map(s => s.name);
    const amounts = this.scholarships.map(s => s.amount);

    this.barData = { labels, datasets: [{ label: 'Amount', data: amounts }] };
    this.pieData = { labels, datasets: [{ data: amounts }] };
    this.doughnutData = { labels, datasets: [{ data: amounts }] };
    this.lineData = { labels, datasets: [{ label: 'Trend', data: amounts, fill: false }] };
    this.radarData = { labels, datasets: [{ label: 'Score', data: amounts }] };
  }
}
