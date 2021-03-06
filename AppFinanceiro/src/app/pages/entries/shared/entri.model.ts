import { Category } from '../../categories/shared/category-model';

export class Entry{
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public type?: string,
        public amount?: string,
        public data?: string,
        public paid?: string,
        public categoryId?: number,
        public category?: Category
    ){}

    static types = {
        expense: 'Despesa',
        renevue: 'Receita'
    }

    get paidText(): string{
        return this.paid ? 'Pago' : 'Pendente';
    }
}