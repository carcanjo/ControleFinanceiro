import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import {CategoryFormComponent} from './category-form/category-form.component';

const routes: Routes = [
  // deixo o path em branco para ele não add nada na rota vai carregar a rota categories conf na App-routing;
  {path: '', component: CategoryListComponent},
  {path: 'new', component: CategoryFormComponent},
  {path: ':id/edit', component: CategoryFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
