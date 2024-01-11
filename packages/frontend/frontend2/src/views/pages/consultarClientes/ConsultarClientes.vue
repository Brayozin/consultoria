<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { watch } from 'vue';
import axios from 'axios';
import DetailClientes from './DetailClientes.vue';



const cpf = ref<string>('');
const cpfList = ref([]);
const cpfInput = ref();

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
    { field: 'nome', header: 'Nome', sortable: true, filter: true, active: true },
    { field: 'tipo', header: 'Tipo', sortable: true, filter: true, active: false },
    { field: 'cpf', header: 'CPF', sortable: true, filter: true, active: true },
    { field: 'matricula', header: 'Matricula', sortable: true, filter: true, active: false },
    { field: 'situac', header: 'Situação', sortable: true, filter: true, active: false },
    { field: 'margemEmpDisp', header: 'Empréstimo Disponível', sortable: true, filter: true, active: true },
    { field: 'margemCartDisp', header: 'Cartão Disponível', sortable: true, filter: true, active: true },
    { field: 'margemBenefSaqueDisp', header: 'Benefício Saque Disponível', sortable: true, filter: true, active: true },
    { field: 'margemCompDisp', header: 'Compra Disponível', sortable: true, filter: true, active: true }
]);

const showDialog = ref(false);

const showDialogColumns = () => {
    showDialog.value = true;
};

// Table Data
const clientes = ref([
    {
        name: 'Gabriel Oliveira',
        tipo: 'Estatutário',
        cpf: '180.810.222-36',
        matricula: 'A123',
        situac: 'Ativo',
        margemEmp: 'R$ 1.200,00',
        margemCart: 'R$ 500,00',
        margemBenefSaque: 'R$ 800,00',
        margemComp: 'R$ 600,00'
    },
    {
        name: 'Amanda Silva',
        tipo: 'Comissionados',
        cpf: '986.834.992-35',
        matricula: 'B456',
        situac: 'Inativo',
        margemEmp: 'R$ 1.500,00',
        margemCart: 'R$ 700,00',
        margemBenefSaque: 'R$ 900,00',
        margemComp: 'R$ 700,00'
    },
    {
        name: 'Lucas Santos',
        tipo: 'Temporários',
        cpf: '059.755.392-00',
        matricula: 'C789',
        situac: 'Ativo',
        margemEmp: 'R$ 1.000,00',
        margemCart: 'R$ 400,00',
        margemBenefSaque: 'R$ 700,00',
        margemComp: 'R$ 500,00'
    },
    {
        name: 'Juliana Souza',
        tipo: 'Contratados',
        cpf: '485.577.422-74',
        matricula: 'D012',
        situac: 'Ativo',
        margemEmp: 'R$ 1.300,00',
        margemCart: 'R$ 600,00',
        margemBenefSaque: 'R$ 850,00',
        margemComp: 'R$ 650,00'
    },
    {
        name: 'Matheus Pereira',
        tipo: 'Terceirizados',
        cpf: '892.158.992-94',
        matricula: 'E345',
        situac: 'Inativo',
        margemEmp: 'R$ 800,00',
        margemCart: 'R$ 300,00',
        margemBenefSaque: 'R$ 600,00',
        margemComp: 'R$ 400,00'
    },
    {
        name: 'Marina Lima',
        tipo: 'Cargo Efetivo ou Estatutário',
        cpf: '847.589.902-12',
        matricula: 'F678',
        situac: 'Ativo',
        margemEmp: 'R$ 1.100,00',
        margemCart: 'R$ 450,00',
        margemBenefSaque: 'R$ 750,00',
        margemComp: 'R$ 550,00'
    },
    {
        name: 'Rafaela Rodrigues',
        tipo: 'Comissionados',
        cpf: '948.356.372-08',
        matricula: 'G901',
        situac: 'Ativo',
        margemEmp: 'R$ 1.250,00',
        margemCart: 'R$ 550,00',
        margemBenefSaque: 'R$ 900,00',
        margemComp: 'R$ 700,00'
    },
    {
        name: 'Pedro Almeida',
        tipo: 'Temporários',
        cpf: '525.988.452-34',
        matricula: 'H234',
        situac: 'Inativo',
        margemEmp: 'R$ 1.050,00',
        margemCart: 'R$ 500,00',
        margemBenefSaque: 'R$ 800,00',
        margemComp: 'R$ 650,00'
    },
    {
        name: 'Camila Fernandes',
        tipo: 'Terceirizados',
        cpf: '276.936.722-65',
        matricula: 'I567',
        situac: 'Ativo',
        margemEmp: 'R$ 900,00',
        margemCart: 'R$ 350,00',
        margemBenefSaque: 'R$ 700,00',
        margemComp: 'R$ 450,00'
    },
    {
        name: 'Diego Oliveira',
        tipo: 'Terceirizados',
        cpf: '276.936.722-65',
        matricula: 'J890',
        situac: 'Ativo',
        margemEmp: 'R$ 1.150,00',
        margemCart: 'R$ 600,00',
        margemBenefSaque: 'R$ 850,00',
        margemComp: 'R$ 650,00'
    },
]);

// File Reading and Parsing

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
    let cpfs = cpfList.value.map((cpf:any) => cpf.replace(/[.-]/g, ''));
    let cpflistString = cpfs.join(',');
    let request = {
        params: {
            cpfList: cpflistString // Assuming cpfList.value is an array
        }
    };


    try {

        let response:any = await axios.get('https://api.idealfinanceira.com/searchandupdate', request);
        let clientes = response.data.clientes;
        console.log("clientes", clientes);
        let matriculas: any = [];
        for (let i = 0; i < clientes.length; i++) {
            let cliente = clientes[i];
            cliente.matriculas.forEach((matricula: any) => {
                matriculas.push({
                    cpf: cliente.cpf,
                    nome: cliente.nome,
                    matricula: matricula.matricula,
                    situac: matricula.situacao,
                    tipo: matricula.tipo,
                    margemEmpDisp: matricula.margens[0].disponivel,
                    margemCartDisp: matricula.margens[1].disponivel,
                    margemBenefSaqueDisp: matricula.margens[2].disponivel,
                    margemCompDisp: matricula.margens[3].disponivel
                })
            });
 
        }
        clientResponse.value = matriculas;
        loading.value = false;
    } catch (error) {
        // Handle errors if any
        console.error('Error fetching clients:', error);
        loading.value = false;
    }
};

const consultaCliente = ref(false);

</script>

<template>
    <div>

        <!-- modal -->
        <Dialog v-model:visible="consultaCliente" header="Detalhes do Cliente" :modal="true" :style="{ width: '50vw' }" :baseZIndex="10000">
                    <DetailClientes />
        </Dialog>

        <div class="card">
            <!-- activate modal -->
            <h1 class="text-3xl font-semibold">Consultar Clientes</h1>
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-6 pl-3">
                    <div class="grid flex flex-row gap-0 mt-2">
                        <!-- upload file button -->
                        <div class="flex flex-col align-bottom justify-end p-0 mr-2">
                            <FileUpload name="demo[]" mode="basic" chooseLabel="arquivo"  class="h-12" label="Upload" :auto="true" @upload="onFileUpload" url="https://www.filestackapi.com/api/store/S3?key=APmFG7UofSSml24EoVumCz"
                            > </FileUpload>
                        </div>
                        <div class="col-3 flex flex-col p-0">
                            <label for="cpf" class="text-blue-200 text-md font-bold">Consultar CPF</label>
                            <InputMask ref="cpfInput" mask="999.999.999-99" v-model="cpf" id="cpf" class="h-12 w-full text-lg" @keydown.enter.native="onEnterCPF" @paste="onPasteCPF" autofocus />
                        </div>
                        <div class="flex flex-col align-bottom justify-end p-0 ml-2">
                            <Button label="Buscar" class="p-button p-2 h-12 bg-primary-500 font-normal text-white " icon="pi pi-search" @click="searchClients" />
                        </div>
                    </div>
                    <!-- cpf list  -->
                    <div class="grid flex flex-row gap-1 mt-2">
                        <span class="bg-blue-300 text-white p-2 rounded-md col-1 " style="width: 30px;" v-if="cpfList.length != 0" @click="cpfList = []">
                            <i class="pi pi-times"></i>
                        </span>
                        <span class="bg-blue-500 text-white p-2 rounded-md" v-for="(cpf, index) in cpfList" :key="index">
                            {{ cpf }}
                            <i class="pi pi-times" @click="cpfList.splice(index, 1)"></i>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Table of Client Data  -->

            <div class="card" >
                <DataTable :value="clientResponse" tableStyle="min-width: 50rem" selectionMode="multiple" selection="selectedProduct">
                    <template #header>
                        <div class="flex flex-row gap-2">
                            <!-- <span class="p-input-icon-right">
                                <i class="pi pi-search" ></i>
                                <InputText type="search" placeholder="Pesquisar" class="p-2" style="width: 25rem" :value="valuePesquisar" />
                            </span> -->

                            <!-- activate/deactivate columns -->
                            <Button type="button" icon="pi pi-cog" class="p-button-rounded p-button-secondary p-button-outlined" @click="showDialogColumns()" />
                            <Dialog v-model:visible="showDialog" header="Colunas" :modal="true" :style="{ width: '50vw' }" :baseZIndex="10000">
                                <div class="grid flex flex-row gap-0">
                                    <div v-for="column in columns" :key="column.field" class="col-4 p-0 m-0 mt-5">
                                        <Button :label="column.header" class="p-button p-2 m-2 w-4/5 h-14" :class="column.active ? 'bg-primary-500 text-white' : 'bg-primary-200 text-white'" @click="column.active = !column.active">
                                            {{ column.header }} <i class="pi pi-check" v-if="column.active"></i> <i class="pi pi-times float-right" v-else></i>
                                        </Button>
                                    </div>
                                </div>
                            </Dialog>
                        </div>
                    </template>
                    <!-- Checkbox to select -->
                    <Column selectionMode="multiple" style="width: 3rem" selection="selectedProduct"></Column>
                    <Column  v-for="column in columns" :key="column.field" :field="column.field" :header="column.header" :sortable="column.sortable" :filter="column.filter" :style="{ display: column.active ? 'table-cell' : 'none' }"></Column>

                    <!-- whatsapp redict column -->
                    <Column header="Whatsapp" class="text-center">
                        <template #body="slotProps">
                            <a @click="consultaCliente = true" class="pi pi-whatsapp"> </a>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Your component styles go here */
</style>
