// //FormBuilder � o construtor de formularios, FormControl � objeto referente aos campos
// //FormGroup � o responsavel pelo formulario
// //validator faz as valida��es
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

  //Definindo a inje��o de dependencia 
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
    
    ) { }

  // Definir os metodos que v�o ser executados em cada um dos ciclos do componente  
  ngOnInit(): void {
    this.setCurrentAction(); // vou definir qual a a��o
    this.buildCategoryForm(); // criar o formul�rio
    this.loadCategory(); // carregar o objeto em quest�o
  }

  ngAfterContentChecked(): void {
    // metodo so inicia ap�s carregamento de todos os dados e regras da pagina
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == 'new')
      this.createCategory();
    else  
      this.updateCategory();
  }


  //Private Methods
  private setCurrentAction(){
    if(this.route.snapshot.url[0].path == 'new') 
      this.currentAction = 'new' //verifico se o primeiro segmento for new ou edit
    else
      this.currentAction = 'edit'
  }

  //Define o formul�rio de categoria
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
          this.categoryForm.patchValue(this.category) // seta os valores no formul�rios
        },
        (error) => toastr.Warning('Ocorreu um erro no servidor','Aviso')  //alert('ocorreu um erro no servidor, tente mais tarde!')
      )
  }

  // ap�s ser carregado todos dados da pagina exibo o nome da pagina dinamico
  private setPageTitle(){
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de nova categoria';
    }
    else{
      const categoryName = this.category.name || ''
      this.pageTitle = 'Editando categoria: '+ categoryName;
    }
  }

  private createCategory(){
    // criando um objeto e atribuindo os valores do formulario
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category)
    .subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
    )
  }

  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
    .subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
    )
  }


  private actionForSuccess(category: Category){
    toastr.success('Solicitação processada com sucesso', 'Sucesso');

    //redirect/ reload na pagina
    this.router.navigateByUrl('categories',{skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    ) 
    // {skipLocationChange: true} não adiciona no historico de navega��o 
  }

  private actionForError(error){
    toastr.error('Ocorreu um erro ao processar a sua solicitação', 'Erro');
    this.submittingForm = false; 

    if(error.status == 422){
      this.serverErrorMessages = JSON.parse(error._body).errors;
    }
    else{
      this.serverErrorMessages = ['Falha na comunicação com o servidor'];
    }
  }
}
