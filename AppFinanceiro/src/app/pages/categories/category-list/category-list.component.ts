import { Component, OnInit } from '@angular/core';
import { Category} from '../shared/category-model';
import { CategoryService} from '../shared/category.service';
import toastr from 'toastr';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService ) { }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(
      categories => {
        return this.categories = categories;
      },
      error => {
        alert('Erro ao listar as caregorias');
      });
  }

  // tslint:disable-next-line: typedef
  deleteCategory(category){
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete){
      toastr.success('Categoria excluida com sucesso', 'Sucesso');
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        () => toastr.error('Erro ao se comunicar com o servidor', 'Erro')
        
      );
    }
  }
}
