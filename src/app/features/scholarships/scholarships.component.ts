import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../src/app/core/services/api.service'; // Assuming ApiService is in core/services

// Define the expected structure for a scholarship object
interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  // Add other necessary fields (e.g., status, eligibility)
}

@Component({
  selector: 'app-scholarships',
  standalone: true,
  templateUrl: './scholarships.component.html', 
  imports: [
    CommonModule, 
    RouterModule // Needed for routerLink
  ]
})
export class ScholarshipsComponent implements OnInit {
  
  scholarships: Scholarship[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadScholarships();
  }

  loadScholarships(): void {
    this.loading = true;
    this.errorMessage = null;

    // IMPORTANT: Assuming the API endpoint for listing scholarships is '/v1/scholarships'
    this.apiService.get('/scholarships').subscribe({
      next: (data: Scholarship[]) => {
        this.scholarships = data;
        this.loading = false;
        console.log('Scholarships loaded:', data);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = 'Failed to load scholarships. Check if the API is running and the token is valid.';
        console.error('API Error:', err);
      }
    });
  }

  // Placeholder for future actions
  viewDetails(id: number): void {
    console.log('Viewing details for scholarship:', id);
    // Future: navigate to a detailed view page
  }
}