import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarshipsComponent } from './scholarships.component'; // Import the new component

const routes: Routes = [
  // Define the main route for the Scholarships feature
  {
    path: '',
    component: ScholarshipsComponent // Load the new component here
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScholarshipsRoutingModule { }