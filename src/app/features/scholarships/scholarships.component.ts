import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

import { ApiService } from '../../../../src/app/core/services/api.service';

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: number;
  archived: boolean;
  applied?: boolean; // optional for student actions
}

@Component({
  selector: 'app-scholarships',
  standalone: true,
  templateUrl: './scholarships.component.html',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    HeaderComponent,  
    FooterComponent  
  ]
})
export class ScholarshipsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Scholarship>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadScholarships();
  }

  loadScholarships(): void {
    this.loading = true;
    this.apiService.get('/scholarships').subscribe({
      next: (data: Scholarship[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading scholarships', err);
        this.snackBar.open('Failed to load scholarships', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewDetails(scholarshipId: number): void {
    console.log('View details for scholarship', scholarshipId);
    // Future: navigate to a detailed page
  }

editScholarship(id: number) {
  console.log('Edit scholarship', id);
  // TODO: Open edit dialog or navigate to edit page
}

deleteScholarship(id: number) {
  console.log('Delete scholarship', id);
  // TODO: Call API to delete
}

applyForScholarship(id: number) {
  console.log('Apply for scholarship', id);
  // TODO: Call API to apply
  const scholarship = this.dataSource.data.find(s => s.id === id);
  if (scholarship) scholarship.applied = true;
}

}
