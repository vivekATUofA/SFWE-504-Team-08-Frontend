import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ScholarshipDialogComponent } from './scholarship-dialog/scholarship-dialog.component';

import { ApiService } from '../../../../src/app/core/services/api.service';
import { AuthService } from '../../../../src/app/core/services/auth.service';

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: number;
  archived: boolean;
  deadline?: string;
  applied?: boolean;
}

@Component({
  selector: 'app-scholarships',
  standalone: true,
  templateUrl: './scholarships.component.html',
  styleUrls: ['./scholarships.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class ScholarshipsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Scholarship>([]);

  // make sure these match the template ViewChild selectors
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // sorting accessor: case-insensitive for strings, numeric for amount
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'name':
          return item.name?.toLowerCase() ?? '';
        case 'description':
          return item.description?.toLowerCase() ?? '';
        case 'amount':
          return Number(item.amount ?? 0);
        default:
          return item[property];
      }
    };

    this.loadScholarships();
  }

  ngAfterViewInit(): void {
    // Attach paginator and sort when view is ready
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loadScholarships(): void {
    this.loading = true;

    this.apiService.get('/scholarships').subscribe({
      next: (data: Scholarship[]) => {
        this.dataSource.data = data || [];
        this.loading = false;

        // Defensive: ensure paginator/sort are attached even if data returns before view init
        if (this.paginator && this.dataSource.paginator !== this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort && this.dataSource.sort !== this.sort) {
          this.dataSource.sort = this.sort;
        }

        // reset to first page after reload
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load scholarships', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  createScholarship() {
    const dialogRef = this.dialog.open(ScholarshipDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.post('/scholarships', result).subscribe({
          next: () => {
            this.snackBar.open('Scholarship created', 'Close', { duration: 3000 });
            this.loadScholarships();
          },
          error: () => {
            this.snackBar.open('Create failed', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  editScholarship(id: number) {
    const scholarship = this.dataSource.data.find(s => s.id === id);
    if (!scholarship) return;

    const dialogRef = this.dialog.open(ScholarshipDialogComponent, { data: scholarship });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.put(`/scholarships/${id}`, result).subscribe({
          next: () => {
            this.snackBar.open('Scholarship updated', 'Close', { duration: 3000 });
            this.loadScholarships();
          },
          error: () => {
            this.snackBar.open('Update failed', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteScholarship(id: number) {
    if (confirm('Are you sure you want to delete this scholarship?')) {
      this.apiService.delete(`/scholarships/${id}`).subscribe({
        next: () => {
          this.snackBar.open('Scholarship deleted', 'Close', { duration: 3000 });
          this.loadScholarships();
        },
        error: () => {
          this.snackBar.open('Delete failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

applyForScholarship(scholarshipId: number): void {
  const userId = this.authService.getCurrentUser().id; // <-- MUST exist in AuthService

  if (!userId) {
    this.snackBar.open('User not logged in', 'Close', { duration: 2000 });
    return;
  }

  const url = `/scholarships/${scholarshipId}/apply/${userId}`;

  this.apiService.post(url).subscribe({
    next: () => {
      this.snackBar.open('Application submitted successfully!', 'Close', { duration: 3000 });
      this.loadScholarships();
    },
    error: (err) => {
      this.snackBar.open('Failed to apply for scholarship', 'Close', { duration: 3000 });
      console.error(err);
    }
  });
}


  viewDetails(id: number) {
    console.log("View details", id);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
