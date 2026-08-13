import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

//import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard-charts.html',
  styleUrls: ['./dashboard-charts.css']
})
export class DashboardChartsComponent {

  // 1. Fuel Consumption Bar Chart
  public fuelChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [420, 380, 510, 490, 450, 310, 290],
        label: 'Fuel Used (Liters)',
        backgroundColor: '#3b82f6', // Matches the Blue KPI card
        borderRadius: 4
      }
    ]
  };

  public fuelChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false } // Hides the legend for a cleaner look
    },
    scales: {
      x: { grid: { display: false } }, // Removes vertical grid lines
      y: { border: { display: false } }
    }
  };

  // 2. Vehicle Status Doughnut Chart
  public statusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Active', 'Idle', 'Maintenance'],
    datasets: [
      {
        data: [65, 35, 20],
        backgroundColor: ['#22c55e', '#f97316', '#ef4444'], // Green, Orange, Red
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  public statusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', // Makes the doughnut ring thinner and more modern
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      }
    }
  };
}
