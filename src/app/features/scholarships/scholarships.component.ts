import { Component, OnInit, ViewChild } from '@angular/core';
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
export class ScholarshipsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Scholarship>([]);

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
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load scholarships', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  // =============================
  //    CREATE SCHOLARSHIP
  // =============================
  createScholarship() {
    const dialogRef = this.dialog.open(ScholarshipDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.post('/scholarships', result).subscribe({
          next: () => {
            this.snackBar.open('Scholarship created', 'Close', { duration: 3000 });
            this.loadScholarships();
          }
        });
      }
    });
  }

  // =============================
  //    EDIT SCHOLARSHIP
  // =============================
  editScholarship(id: number) {
    const scholarship = this.dataSource.data.find(s => s.id === id);
    if (!scholarship) return;

    const dialogRef = this.dialog.open(ScholarshipDialogComponent, {
      data: scholarship
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.put(`/scholarships/${id}`, result).subscribe({
          next: () => {
            this.snackBar.open('Scholarship updated', 'Close', { duration: 3000 });
            this.loadScholarships();
          }
        });
      }
    });
  }

  // =============================
  //    DELETE SCHOLARSHIP
  // =============================
  deleteScholarship(id: number) {
    if (confirm('Are you sure you want to delete this scholarship?')) {
      this.apiService.delete(`/scholarships/${id}`).subscribe({
        next: () => {
          this.snackBar.open('Scholarship deleted', 'Close', { duration: 3000 });
          this.loadScholarships();
        }
      });
    }
  }

  applyForScholarship(id: number) {
    this.snackBar.open('Apply API not added yet.', 'Close', { duration: 2000 });
  }

  viewDetails(id: number) {
  console.log("View details", id);
  // Future: navigate to detail page
}

isAdmin(): boolean {
  return this.authService.isAdmin();
}

}
