<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { watch } from 'vue';
import axios from 'axios';
import DetailClientes from './DetailClientes.vue';

const cpf = ref<string>('');
const cpfList = ref([]);
const cpfInput = ref();

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

class matricula {
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
    matriculas: matricula[];
    ultimaConsulta: Date;

    constructor(cpf: string, nome: string, matriculas: [matricula], ultimaConsulta?: Date) {
        this.cpf = cpf;
        this.nome = nome;
        this.matriculas = new Array<matricula>();
        for (let i = 0; i < matriculas.length; i++) {
            this.matriculas.push(new matricula(matriculas[i].matricula, matriculas[i].nome, matriculas[i].cpf, matriculas[i].tipo, matriculas[i].situacao, matriculas[i].margens));
        }
        this.ultimaConsulta = ultimaConsulta ? ultimaConsulta : new Date();
    }
}

const validateCPF = (cpf: string) => {
    let sum = 0;
    let remainder;

    cpf = cpf.replace(/[.-]/g, '');

    if (cpf === '00000000000') return false;

    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    return true;
};

const onEnterCPF = () => {
    if (validateCPF(cpf.value)) {
        if (cpfList.value.includes(cpf.value)) {
            alert('CPF já adicionado');
            cpf.value = '';
            cpfInput.value.$el.focus();
            return;
        }
        cpfList.value.push(cpf.value);
        cpf.value = '';
        cpfInput.value.$el.focus();
    } else {
        alert('CPF inválido');
        cpfInput.value.$el.focus();
    }
};

const onPasteCPF = (e: ClipboardEvent) => {
    const addMask = (cpf: string) => {
        let cpfNoMask = cpf.replace(/[.-]/g, '');
        let cpfMasked = '';
        for (let i = 0; i < cpfNoMask.length; i++) {
            if (i === 3 || i === 6) cpfMasked += '.';
            if (i === 9) cpfMasked += '-';
            cpfMasked += cpfNoMask[i];
        }
        return cpfMasked;
    };

    console.log('pasted CPF');
    console.log(e.clipboardData?.getData('text'));
    let pastedCPF = e.clipboardData?.getData('text');
    if (pastedCPF?.length && pastedCPF?.length > 14) {
        let cpfListPasted = pastedCPF.split('\n');
        cpfListPasted.forEach((cpf) => {
            if (validateCPF(cpf) && !cpfList.value.includes(cpf)) {
                // remove non numeric characters
                let cpfNoMask = cpf.replace(/[.,-]/g, '');
                cpfList.value.push(addMask(cpfNoMask));
            }
        });
    }
};

const cpfRules = computed(() => {
    return [(v: string) => !!v || 'CPF é obrigatório', (v: string) => v.length === 14 || 'CPF deve ter 11 dígitos'];
});

// Table

const columns = ref([
    { field: 'cliente.cpf', header: 'CPF', sortable: true, filter: true, active: true, width: '8rem' },
    { field: 'cliente.nome', header: 'Nome', sortable: true, filter: true, active: true, width: '10rem' },
    { field: 'matriculaSelecionada', header: 'Matricula', active: true, width: '8rem' },
    { field: 'tipo', header: 'Tipo', sortable: true, filter: true, active: true, width: '6rem' },
    { field: 'situac', header: 'Situação', sortable: true, filter: true, active: true, width: '5rem' },
    { field: 'margemTotal', header: 'Total', sortable: true, filter: true, active: true, width: '5rem' },
    { field: 'margemDisponivel', header: 'Disponível', sortable: true, filter: true, active: true, width: '5rem' }
]);

const margensOptions = [
    { label: 'Empréstimo', value: 'emprestimo' },
    { label: 'Cartão', value: 'cartao' },
    { label: 'Saque', value: 'saque' },
    { label: 'Compra', value: 'compra' }
];
const margemSelecionada = ref('emprestimo');

const showDialog = ref(false);

const showDialogColumns = () => {
    showDialog.value = true;
};

const loading = ref(false);
const clientResponse = ref([]);

const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target?.result);
        };
        reader.onerror = (e) => {
            reject(e);
        };
        reader.readAsText(file);
    });
};
// File looks like this:
// 111.286.709-09;
// 111.212.999-12;
const parseCSV = (csv: string) => {
    return csv.split('\n');
};

const onFileUpload = async (e: any) => {
    console.log('file uploaded');
    alert('file uploaded');
    const file = e.files[0];
    const csv = await readFile(file);
    const cpfListParsed = parseCSV(csv as string);
    cpfList.value = cpfListParsed;
    console.log(cpfList.value);
    // load 3 sec
};

// Search Clients

const searchClients = async () => {
    console.log('searching clients');
    console.log(cpfList.value);
    loading.value = true;
    //remove nulls
    cpfList.value = cpfList.value.filter((cpf) => cpf !== null);
    // remove - . and ,
    let cpfs = cpfList.value.map((cpf: any) => cpf.replace(/[.-]/g, ''));
    let cpflistString = cpfs.join(',');
    let request = {
        params: {
            cpfList: cpflistString // Assuming cpfList.value is an array
        }
    };

    try {
        let response: any = await axios.get('https://api.idealfinanceira.com/getclientes', request);
        let clientes = response.data.clientes;
        console.log('clientes', clientes);
        let matriculas: any = [];
        for (let i = 0; i < clientes.length; i++) {
            let cliente = new Cliente(clientes[i].cpf, clientes[i].nome, clientes[i].matriculas);
            matriculas.push({
                cliente: cliente,
                matriculaSelecionada: cliente.matriculas[0].matricula,
                matriculasOptions: cliente.matriculas.map((matricula) => {
                    return { label: matricula.matricula, value: matricula.matricula };
                }),
                margemSelecionada: cliente.matriculas[0].margens.emprestimo.categoria,
                margem: cliente.matriculas[0].margens.emprestimo
            });
        }
        // let matriculas: any = [];

        // let clienteParse = JSON.parse(JSON.stringify(clienteExemploJson));
        // let cliente = new Cliente(clienteParse.cpf, clienteParse.nome, clienteParse.matriculas);
        // matriculas.push({
        //     cliente: cliente,
        //     matriculaSelecionada: cliente.matriculas[0].matricula,
        //     matriculasOptions: cliente.matriculas.map((matricula) => {
        //         return { label: matricula.matricula, value: matricula.matricula };
        //     }),
        //     margemSelecionada: cliente.matriculas[0].margens.emprestimo.categoria,
        //     margem: cliente.matriculas[0].margens.emprestimo
        // });

        clientResponse.value = matriculas;
        loading.value = false;
    } catch (error) {
        // Handle errors if any
        console.error('Error fetching clients:', error);
        loading.value = false;
    }
};

const consultaCliente = ref(false);

// watch ClienteSelecionado

const clienteExemploJson: any = {
    nome: 'ALAN PESSOA DA SILVA',
    cpf: '71269886215',
    matriculas: [
        {
            matricula: '0001863614B',
            nome: 'ALAN PESSOA DA SILVA',
            cpf: '71269886215',
            margens: {
                emprestimo: { total: '7938,25', reservada: '0,00', disponivel: '7938,25          ' },
                cartao: { total: '1134,04', reservada: '0,00', disponivel: '966,29          ' },
                saque: { total: '3175,30', reservada: '0,00', disponivel: '3175,30          ' },
                compra: { total: '4536,14', reservada: '0,00', disponivel: '4536,14          ' }
            },
            tipo: 'ESTATUTARIO',
            situacao: 'Ativo - EXERCICIO REGULAR'
        },
        {
            matricula: '0001863614C',
            nome: 'ALAN PESSOA DA SILVA',
            cpf: '71269886215',
            margens: {
                emprestimo: { total: '0,00', reservada: '0,00', disponivel: '0,00          ' },
                cartao: { total: '0,00', reservada: '0,00', disponivel: '0,00          ' },
                saque: { total: '0,00', reservada: '0,00', disponivel: '0,00          ' },
                compra: { total: '0,00', reservada: '0,00', disponivel: '0,00          ' }
            },
            tipo: 'ESTATUTARIO',
            situacao: 'Suspenso - SEM MARGEM MES ATUAL'
        },
        {
            matricula: '0001863614D',
            nome: 'ALAN PESSOA DA SILVA',
            cpf: '71269886215',
            margens: {
                emprestimo: { total: ' 190,67', reservada: '0,00', disponivel: ' 190,67          ' },
                cartao: { total: ' 27,24', reservada: '0,00', disponivel: ' 27,24          ' },
                saque: { total: ' 76,27', reservada: '0,00', disponivel: ' 76,27          ' },
                compra: { total: ' 108,96', reservada: '0,00', disponivel: ' 108,96          ' }
            },
            tipo: 'ESTATUTARIO',
            situacao: 'Ativo - EXERCICIO REGULAR'
        }
    ]
};

const clienteSelecionado = ref();

const onRowSelect = (event: any) => {
    console.log('row selected');
    console.log(event);
    clienteSelecionado.value = event.data.cliente;
    consultaCliente.value = true;
};
</script>

<template>
    <div>
        <!-- modal -->
        <Dialog v-model:visible="consultaCliente" header="Detalhes do Cliente" :modal="true" :style="{ width: '50vw' }" :baseZIndex="10000">
            <DetailClientes :clienteRow="clienteSelecionado" />
        </Dialog>

        <div class="card">
            <!-- activate modal -->
            <h1 class="text-3xl font-semibold">Consultar Clientes</h1>
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-6 pl-3">
                    <div class="grid flex flex-row gap-0 mt-2">
                        <!-- upload file button -->
                        <div class="flex flex-col align-bottom justify-end p-0 mr-2">
                            <FileUpload name="demo[]" mode="basic" chooseLabel="arquivo" class="h-12" label="Upload" :auto="true" @upload="onFileUpload" url="https://www.filestackapi.com/api/store/S3?key=APmFG7UofSSml24EoVumCz"> </FileUpload>
                        </div>
                        <div class="col-3 flex flex-col p-0 inputWithBorder">
                            <label for="cpf" class="text-blue-200 text-md font-bold">Consultar CPFs</label>
                            <InputMask ref="cpfInput" mask="999.999.999-99" v-model="cpf" id="cpf" class="h-12 w-full text-lg" @keydown.enter.native="onEnterCPF" @paste="onPasteCPF" autofocus />
                        </div>
                        <div class="flex flex-col align-bottom justify-end p-0 ml-2">
                            <Button label="Buscar" class="p-button p-2 h-12 bg-primary-500 font-normal text-white" icon="pi pi-search" @click="searchClients" />
                        </div>
                    </div>
                    <!-- cpf list  -->
                    <div class="grid flex flex-row gap-1 mt-2 items-center">
                        <span
                            class="bg-transparent border-primary text-primary font-medium border-2 p-2 rounded-md m-2rounded-md col-1 mb-1 flex items-center justify-center"
                            style="width: 39px; height: 39px"
                            v-if="cpfList.length != 0"
                            @click="cpfList = []"
                        >
                            <i class="pi pi-times"></i>
                        </span>
                        <span class="bg-transparent border-primary text-primary font-medium border-2 p-2 rounded-md mb-1 max-w-11rem col-2 flex justify-between items-center" v-for="(cpf, index) in cpfList" :key="index">
                            <span class="text-md w-full">{{ cpf }}</span>
                            <i class="pi pi-times" @click="cpfList.splice(index, 1)"></i>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Table of Client Data  -->
            <div class="flex justify-center">
                <div class="progress-bar" v-if="loading">
                    <div class="progress-bar-value"></div>
                </div>
                <div class="mt-4" v-else></div>
            </div>
            <div class="card p-1" id="clientTable">
                <DataTable
                    :value="clientResponse"
                    tableStyle="min-width: 50rem"
                    stripedRows
                    paginator
                    :rows="5"
                    :rowsPerPageOptions="[5, 10, 15]"
                    selectionMode="single"
                    dataKey="cpf"
                    v-model:selectedRowKeys="clienteSelecionado"
                    metaKeySelection="false"
                    size="small"
                    @rowSelect="onRowSelect"
                >
                    <template #header>
                        <div class="flex flex-row gap-2 justify-between">
                            <div class="col-2">
                                <Button type="button" icon="pi pi-cog" class="p-button-rounded p-button-secondary p-button-outlined" @click="showDialogColumns()" />
                                <Dialog id="dialogColunas" header="Colunas" v-model:visible="showDialog" :modal="true" :baseZIndex="10000" :style="{ width: '50%' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" class="border-2 border-primary">
                                    <div class="grid flex flex-row gap-0 h-1/2 p-3 my-2">
                                        <div v-for="column in columns" :key="column.field" class="col-3 py-2 px-1 h-12 flex justify-start items-center gap-1">
                                            <Checkbox v-model="column.active" :input-id="column.field" binary="true" :value="column.active" class="" />
                                            <span class="flex flex-row justify-start items-end">
                                                <label :for="column.field" class="text-blue-200 text-md font-bold">{{ column.header }}</label>
                                            </span>
                                        </div>
                                    </div>

                                    <template #paginatorstart>
                                        <div class="flex flex-row justify-end items-center gap-2">
                                            <Button label="Cancelar" class="p-button p-2 h-12 bg-primary-500 font-normal text-white" icon="pi pi-times" @click="showDialog = false" />
                                            <Button label="Salvar" class="p-button p-2 h-12 bg-primary-500 font-normal text-white" icon="pi pi-check" @click="showDialog = false" />
                                        </div>
                                    </template>
                                </Dialog>
                            </div>
                            <div class="col-8 flex flex-row gap-2 justify-end margemDrop">
                                <div class="flex flex-row justify-start items-center col-2 p-0" v-for="option in margensOptions">
                                    <Button
                                        type="button"
                                        :label="option.label"
                                        class="justify-center p-button w-full h-11"
                                        @click="margemSelecionada = option.value"
                                        :class="{ 'bg-primary text-white inner-border': margemSelecionada === option.value, 'text-primary bg-white border-primary border-2': margemSelecionada !== option.value }"
                                    >
                                        <template #default>
                                            <span class="text-sm text-center align-content-center align-items-center justify-center">{{ option.label }}</span>
                                        </template>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- Checkbox to select -->
                    <!-- <Column selectionMode="multiple" style="width: 3rem" selection="selectedProduct"></Column> -->

                    <!-- Column visualizar -->

                    <Column
                        v-for="column in columns"
                        :key="column.field"
                        :field="column.field"
                        :header="column.header"
                        :sortable="column.sortable"
                        :filter="column.filter"
                        :style="{ display: column.active ? 'table-cell' : 'none', width: column.width }"
                    >
                        <template v-if="column.field === 'cliente.cpf'" #body="slotProps">
                            <!-- shows cpf of cliente -->
                            <div class="flex flex-row justify-start text-sm items-center gap-2 w-full">
                                <span class="text-sm">{{ slotProps.data.cliente.cpf }}</span>
                            </div>
                        </template>
                        <template v-if="column.field === 'cliente.nome'" #body="slotProps">
                            <!-- shows nome of cliente -->
                            <div class="flex flex-row justify-start text-sm items-center gap-2 w-full">
                                <span class="text-sm">{{ slotProps.data.cliente.nome }}</span>
                            </div>
                        </template>

                        <template v-if="column.field === 'matriculaSelecionada'" #body="slotProps">
                            <!-- select matricula -->
                            <div class="flex flex-row justify-start text-sm items-center gap-2 w-full columnMatricula">
                                <Dropdown dropdown v-model="slotProps.data.matriculaSelecionada" :options="slotProps.data.matriculasOptions" optionLabel="label" optionValue="value" class="h-10 w-full text-sm">
                                    <template #value="{ value, placeholder }">
                                        <span v-if="value" class="flex flex-row justify-start items-center gap-1">
                                            <span class="text-sm">{{ value }}</span>
                                        </span>
                                        <span v-else class="flex flex-row justify-start items-center gap-1">
                                            <span class="text-sm">{{ placeholder }}</span>
                                        </span>
                                    </template>
                                </Dropdown>
                            </div>
                        </template>
                        <template v-if="column.field === 'margemDisponivel'" #body="slotProps">
                            <!-- shows margem of margemSelecionada -->
                            <div class="flex flex-row justify-start text-sm items-center gap-2 w-full">
                                <span class="text-sm">R$ {{ slotProps.data.cliente.matriculas.find((matricula) => matricula.matricula === slotProps.data.matriculaSelecionada).margens[margemSelecionada].disponivel }}</span>
                            </div>
                        </template>

                        <template v-if="column.field === 'margemTotal'" #body="slotProps">
                            <!-- shows margem of margemSelecionada -->
                            <div class="flex flex-row justify-start text-sm items-center gap-2 w-full">
                                <span class="text-sm whitespace-nowrap">R$ {{ slotProps.data.cliente.matriculas.find((matricula) => matricula.matricula === slotProps.data.matriculaSelecionada).margens[margemSelecionada].total }}</span>
                            </div>
                        </template>

                        <template v-if="column.field === 'tipo'" #body="slotProps">
                            <!-- shows tipo of matriculaSelecionada -->
                            <div class="flex flex-row justify-start text-sm items-center gap-2 w-full">
                                <span class="text-sm whitespace-nowrap">{{ slotProps.data.cliente.matriculas.find((matricula) => matricula.matricula === slotProps.data.matriculaSelecionada).tipo }}</span>
                            </div>
                        </template>

                        <template v-if="column.field === 'situac'" #body="slotProps">
                            <!-- shows situac of matriculaSelecionada -->
                            <div class="flex flex-row justify-start text-sm items-center gap-2 w-full">
                                <span class="text-sm"> {{ slotProps.data.cliente.matriculas.find((matricula) => matricula.matricula === slotProps.data.matriculaSelecionada).situacao.includes('Ativo') ? 'Ativo' : 'Inativo' }}</span>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style>
#dialogColunas > .p-dialog-header {
}

#clientTable .p-paginator .p-paginator-rpp-options .p-dropdown-label {
    min-width: 2.5rem;
    height: 2.5rem;
    border: none !important;
}

#clientTable .columnMatricula .p-dropdown .p-dropdown-label {
    border: none !important;
    border-radius: 0.25rem 0 0 0.25rem !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

#clientTable .columnMatricula .p-dropdown .p-inputtext {
    border: none !important;
    box-shadow: none !important;
}

#clientTable .columnMatricula .p-dropdown .p-dropdown-trigger {
    color: var(--primary-300);
}

#clientTable .margemDrop .p-dropdown .p-dropdown-label {
    border: 2px solid var(--primary-500) !important;
    border-radius: 0.3rem 0 0 0.3rem !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0px 0px 1px 1px var(--primary-100) !important;
}

#clientTable .margemDrop .p-dropdown .p-dropdown-trigger {
    background-color: var(--primary-500);
    color: var(--primary-100) !important;
}

#clientTable .margemDrop .p-dropdown .p-dropdown-trigger:hover {
    background-color: var(--primary-600);
}

.inputWithBorder .p-inputtext {
    border: 2px solid var(--primary-600) !important;
}

.progress-bar {
    height: 21px;
    background-color: transparent;
    width: 97%;
    justify-content: center;
    display: flex;
    overflow: hidden;
    box-shadow: 0px 2px 5px 5px var(--primary-400);
    top: 22px;
    position: relative;
    filter: blur(8px);
}

.progress-bar-value {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--primary-400);
    animation: indeterminateAnimation 1s infinite linear;
    transform-origin: 0% 50%;
}

@keyframes indeterminateAnimation {
    0% {
        transform: translateX(0) scaleX(0);
    }
    50% {
        transform: translateX(0) scaleX(0.4);
    }
    100% {
        transform: translateX(100%) scaleX(0.5);
    }
}

/* progressbar inset that is an box shadow on top of component */

#clientTable {
    position: relative;
}

/* @keyframes boxShadowInderminate {
  0% {
  content:"";
  position: absolute;
  inset: -5px;
  transform: translate(0px,0px);
  z-index: 0;
  background: conic-gradient(from 90deg at 40% 50%, rgba(5, 5, 181, 0) 50%, rgb(40, 40, 225) 55%, rgba(255, 0, 251, 0) 100%);
  filter: blur(10px);
  }
    100% {
  content:"";
  position: absolute;
  inset: -5px;
  transform: translate(100px,0px);
  z-index: 0;
  background: conic-gradient(from 90deg at 40% 50%, rgba(5, 5, 181, 0) 50%, rgb(40, 40, 225) 55%, rgba(255, 0, 251, 0) 100%);
  filter: blur(10px);
    }
        

} */

/* Your component styles go here */
</style>
