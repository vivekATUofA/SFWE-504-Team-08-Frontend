import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScholarshipsRoutingModule } from './scholarships-routing.module';
import { ScholarshipsComponent } from './scholarships.component';

@NgModule({
  // Since ScholarshipsComponent is standalone, we keep declarations empty
  declarations: [], 
  imports: [
    CommonModule,
    ScholarshipsRoutingModule,
    ScholarshipsComponent // Import the standalone component directly
  ]
})
export class ScholarshipsModule { }