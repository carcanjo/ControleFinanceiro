// //FormBuilder é o construtor de formularios, FormControl é objeto referente aos campos
// //FormGroup é o responsavel pelo formulario
// //validator faz as validações
// ActivatedRoute para identificar quando vai ser edit ou quando vai ser new 
// Route para fazer direcionamentos
// importar as categorias para poder trabalhar com elas 
// para manipular a rota

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms'; 
import { ActivatedRoute, Route, Router} from '@angular/router';
import { Category } from '../shared/category-model';
import { CategoryService } from '../shared/category.service';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category =  new Category();

  //Definindo a injeção de dependencia 
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
    
    ) { }

  // Definir os metodos que vão ser executados em cada um dos ciclos do componente  
  ngOnInit(): void {
    this.setCurrentAction(); // vou definir qual a ação
    this.buildCategoryForm(); // criar o formulário
    this.loadCategory(); // carregar o objeto em questão
  }

  ngAfterContentChecked(): void {
    // metodo so inicia após carregamento de todos os dados e regras da pagina
    this.setPageTitle();
  }


  //Private Methods
  private setCurrentAction(){
    if(this.route.snapshot.url[0].path == 'new') 
      this.currentAction = 'new' //verifico se o primeiro segmento for new ou edit
    else
      this.currentAction = 'edit'
  }

  //Define o formulário de categoria
  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory(){
    if(this.currentAction == 'edit')
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))     // + faz um casting da variavel string para number
      )
      .subscribe(
        (category) =>{
          this.category = category
          this.categoryForm.patchValue(this.category) // seta os valores no formulários
        },
        (error) => alert('ocorreu um erro no servidor, tente mais tarde!')
      )
  }

  // após ser carregado todos dados da pagina exibo o nome da pagina dinamico
  private setPageTitle(){
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de nova categoria';
    }
    else{
      const categoryName = this.category.name || ''
      this.pageTitle = 'Editando categoria: '+ categoryName;
    }
  }

}
