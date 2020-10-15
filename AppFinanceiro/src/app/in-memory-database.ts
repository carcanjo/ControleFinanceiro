// tslint:disable-next-line: eofline
import {InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category-model';

export class InMemoryDatabase implements InMemoryDbService{
    // tslint:disable-next-line: typedef
    createDb(){
        const categories: Category[] = [
            { id: 1 , name: 'Moradia', description: 'Pagamentos de contas de casa'},
            { id: 2 , name: 'Saude', description: 'Plano de saude e remédios' },
            { id: 3 , name: 'Lazer', description: 'Cinema, parques, praia etc' },
            { id: 4 , name: 'Salario', description: 'Recebimento de salário' },
            { id: 5 , name: 'Freelas', description: 'Trabalhos como freelancer' },
        ];
        // tslint:disable-next-line: semicolon
        return { categories }
    }
// tslint:disable-next-line: eofline
}