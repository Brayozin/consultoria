class Margem {
    total: string;
    disponivel: string;
    categoria: string;

    constructor(total: string, disponivel: string, categoria: string) {
        this.total = total;
        this.disponivel = disponivel;
        this.categoria = categoria;
    }
}
class Margens {
    emprestimo: Margem;
    cartao: Margem;
    saque: Margem;
    compra: Margem;

    constructor(emprestimo: Margem, cartao: Margem, saque: Margem, compra: Margem) {
        this.emprestimo = emprestimo;
        this.cartao = cartao;
        this.saque = saque;
        this.compra = compra;
    }
}

class Matricula {
    matricula: string;
    cpf: string;
    nome: string;
    tipo: string;
    situacao: string;
    margens: Margens;

    constructor(matricula: string, nome: string, cpf: string, tipo: string, situacao: string, margens: Margens) {
        this.matricula = matricula;
        this.cpf = cpf;
        this.nome = nome;
        this.tipo = tipo;
        this.situacao = situacao;
        let emprestimo = new Margem(margens['emprestimo']['total'], margens['emprestimo']['disponivel'], 'emprestimo');
        let cartao = new Margem(margens['cartao']['total'], margens['cartao']['disponivel'], 'cartao');

        let saque = new Margem(margens['saque']['total'], margens['saque']['disponivel'], 'saque');
        let compra = new Margem(margens['compra']['total'], margens['compra']['disponivel'], 'compra');
        this.margens = new Margens(emprestimo, cartao, saque, compra);
    }
}

class Cliente {
    cpf: string;
    nome: string;
    matriculas: Matricula[];
    ultimaConsulta: Date;

    constructor(cpf: string, nome: string, matriculas: [Matricula], ultimaConsulta?: Date) {
        this.cpf = cpf;
        this.nome = nome;
        this.matriculas = new Array<Matricula>();
        for (let i = 0; i < matriculas.length; i++) {
            this.matriculas.push(new Matricula(matriculas[i].matricula, matriculas[i].nome, matriculas[i].cpf, matriculas[i].tipo, matriculas[i].situacao, matriculas[i].margens));
        }
        this.ultimaConsulta = ultimaConsulta ? ultimaConsulta : new Date();
    }
}

export { Matricula, Margem, Margens, Cliente };