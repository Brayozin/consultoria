!
<template lang="">
    <div class="card">
        <div class="card filter flex flex-col">
            <!-- Filter component goes here -->
            <div class="col-12 flex flex-row p-0 gap-2">
                <!-- Filter -->
                <div class="col-3 p-0">
                    <span class="p-float-label autocomplete-custom w-full">
                        <AutoComplete dropdown v-model="value" :suggestions="filteredFilters" @complete="search($event)" field="text" class="h-12 w-full"></AutoComplete>
                        <label for="autocomplete" class="text-blue-200 text-md font-bold">Filtro</label>
                    </span>
                </div>
                <!-- Operation -->
                <div class="col-2 p-0">
                    <span class="p-float-label">
                        <AutoComplete dropdown v-model="value2" :suggestions="filteredOps" @complete="searchOps($event, value)" field="text" class="h-12"></AutoComplete>
                        <label for="inputtext" class="text-blue-200 text-md font-bold">Operação</label>
                    </span>
                </div>
                <!-- Value -->
                <div class="col-5 p-0">
                    <span class="p-float-label">
                        <InputText type="text" id="inputtext" v-model="valueFilrto" class="h-12 w-full" />
                        <label for="inputtext" class="text-blue-200 text-md font-bold">Valor</label>
                    </span>
                </div>
                <!-- add/remove filter -->
                <div class="col-2 p-0 float-right">
                    <span class="p-float-label">
                        <Button type="button" icon="pi pi-plus" class="p-button-rounded p-button-success p-button-outlined" @click="addFilter" />
                        <Button type="button" icon="pi pi-minus" class="p-button-rounded p-button-danger p-button-outlined" @click="removeFilter" />
                    </span>
                </div>
            </div>
            <!-- Search buttons -->
            <div class="col-12 flex flex-row p-0 gap-2 mt-5 justify-start">
                <!-- Quantidade (radio button )-->

                <div class="col-3 p-0">
                    <Button label="Pesquisar" class="p-button p-2 h-11 w-full bg-blue-500 border-blue-500 border-solid border-2 font-normal text-white" icon="pi pi-search" />
                </div>
                <div class="col-3 p-0">
                    <Button label="Limpar" class="p-button p-2 w-full h-11 bg-white font-normal text-blue-500 border-blue-600 border-solid border-2" icon="pi pi-times" />
                </div>

                <!-- atualizar selecionados -->
                <div class="col-3 p-0 ml-auto">
                    <Button label="Atualizar Selecionados" class="p-button p-2 w-full h-11 bg-white font-normal text-blue-500 border-blue-600 border-solid border-2" icon="pi pi-refresh" />
                </div>
            </div>
        </div>
        <div class="card">
            <DataTable :value="clientes" tableStyle="min-width: 50rem" selectionMode="multiple" selection="selectedProduct">
                <template #header>
                    <div class="flex flex-row gap-2">
                        <span class="p-input-icon-right">
                            <i class="pi pi-search" v-if="iconPesquisar"></i>
                            <InputText type="search" placeholder="Pesquisar" class="p-2" style="width: 25rem" :value="valuePesquisar" />
                        </span>

                        <!-- activate/deactivate columns -->
                        <Button type="button" icon="pi pi-cog" class="p-button-rounded p-button-secondary p-button-outlined" @click="showDialogColumns()" />
                        <Dialog v-model:visible="showDialog" header="Colunas" :modal="true" :style="{ width: '50vw' }" :baseZIndex="10000">
                            <div class="grid flex-row gap-0">
                                <div v-for="column in columns" :key="column.field" class="col-4 p-0 m-0 border-1 border-primary">
                                   <!-- checkbox -->
                                   <span>teste</span>
                                    
                                </div>
                            </div>
                        </Dialog>
                    </div>
                </template>
                <!-- Checkbox to select -->
                <Column selectionMode="multiple" style="width: 3rem" selection="selectedProduct"></Column>
                <Column
                    v-for="column in columns"
                    :key="column.field"
                    :field="column.field"
                    :header="column.header"
                    :sortable="column.sortable"
                    :filter="column.filter"
                    :filterMatchMode="column.filterMatchMode"
                    :style="{ display: column.active ? 'table-cell' : 'none' }"
                ></Column>

                <!-- whatsapp redict column -->
                <Column header="Whatsapp" class="text-center">
                    <template #body="slotProps">
                        <a href="www.wa.me/41998152523" class="pi pi-whatsapp"> </a>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; // optional
import Row from 'primevue/row'; // optional

import AutoComplete from 'primevue/autocomplete';

interface Operation {
    text: string;
    code: string;
}
interface Filter {
    text: string;
    code: string;
    ops: Operation[];
}
const selectedProduct = ref();

const valuePesquisar = ref<string | null>(null);
const iconPesquisar = ref<boolean | null>(true);
watch(valuePesquisar, (newValue, oldValue) => {
    if (newValue != null) {
        iconPesquisar.value = false;
    } else {
        iconPesquisar.value = true;
    }
});

const columns = ref([
    { field: 'name', header: 'Nome', sortable: true, filter: true, active: true },
    { field: 'tipo', header: 'Tipo', sortable: true, filter: true, active: false },
    { field: 'cpf', header: 'CPF', sortable: true, filter: true, active: true },
    { field: 'matricula', header: 'Matricula', sortable: true, filter: true, active: false },
    { field: 'situac', header: 'Situação', sortable: true, filter: true, active: false },
    { field: 'margemEmp', header: 'Margem Empréstimo', sortable: true, filter: true, active: true },
    { field: 'margemCart', header: 'Margem Cartão', sortable: true, filter: true, active: true },
    { field: 'margemBenefSaque', header: 'Margem Benefício Saque', sortable: true, filter: true, active: true },
    { field: 'margemComp', header: 'Margem Compra', sortable: true, filter: true, active: true }
]);
// show dialog
const showDialog = ref<boolean>(false);
const showDialogColumns = () => {
    showDialog.value = true;
};

const filteredFilters = ref<Filter[]>([]);
const value = ref<string | null>(null);
const valueFilrto = ref<string | null>(null);

const opsText = [
    { text: 'Contém', code: 'contem' },
    { text: 'Não Contém', code: 'naoContem' },
    { text: 'Igual', code: 'igual' },
    { text: 'Diferente', code: 'diferente' },
    { text: 'Começa com', code: 'comecaCom' },
    { text: 'Termina com', code: 'terminaCom' },
    { text: 'Vazio', code: 'vazio' },
    { text: 'Não Vazio', code: 'naoVazio' }
];
const opsNum = [
    { text: 'Igual', code: 'igual' },
    { text: 'Diferente', code: 'diferente' },
    { text: 'Maior', code: 'maior' },
    { text: 'Maior ou Igual', code: 'maiorOuIgual' },
    { text: 'Menor', code: 'menor' },
    { text: 'Menor ou Igual', code: 'menorOuIgual' },
    { text: 'Vazio', code: 'vazio' },
    { text: 'Não Vazio', code: 'naoVazio' }
];

const filters = ref<Filter[]>([
    { text: 'Nome', code: 'nome', ops: opsText },
    { text: 'Tipo', code: 'tipo', ops: opsText },
    { text: 'CPF', code: 'cpf', ops: opsText },
    { text: 'Matricula', code: 'matricula', ops: opsText },
    { text: 'Margem Empréstimo', code: 'margemEmp', ops: opsNum },
    { text: 'Margem Cartão', code: 'margemCart', ops: opsNum },
    { text: 'Margem Benefício Saque', code: 'margemBenefSaque', ops: opsNum },
    { text: 'Margem Compra', code: 'margemComp', ops: opsNum }
]);
const filteredOps = ref<Operation[]>([]);
const value2 = ref<string | null>(null);

const search = (event: { query: string }) => {
    const filtered: Filter[] = [];
    const query = event.query.toLowerCase();

    for (let i = 0; i < filters.value.length; i++) {
        const filter = filters.value[i];
        if (filter.text.toLowerCase().indexOf(query) === 0 || filter.code.toLowerCase().indexOf(query) === 0) {
            filtered.push(filter);
        }
    }
    filteredFilters.value = filtered;
};

const searchOps = (event: { query: string }, value) => {
    const filtered: Operation[] = [];
    const query = event.query.toLowerCase();
    console.log('value', value);

    for (let i = 0; i < value.ops.length; i++) {
        const op = value.ops[i];
        if (op.text.toLowerCase().indexOf(query) === 0 || op.code.toLowerCase().indexOf(query) === 0) {
            filtered.push(op);
        }
    }
    filteredOps.value = filtered;
};

const clientes = ref([
    { name: 'Alice', tipo: 'Servidor', cpf: '111.222.333-44', matricula: 'A123', situac: 'Ativo', margemEmp: 'R$ 1.200,00', margemCart: 'R$ 500,00', margemBenefSaque: 'R$ 800,00', margemComp: 'R$ 600,00' },
    { name: 'Bruno', tipo: 'Pensionista', cpf: '222.333.444-55', matricula: 'B234', situac: 'Inativo', margemEmp: 'R$ 900,00', margemCart: 'R$ 300,00', margemBenefSaque: 'R$ 400,00', margemComp: 'R$ 700,00' },
    { name: 'Camila', tipo: 'Servidor', cpf: '333.444.555-66', matricula: 'C345', situac: 'Ativo', margemEmp: 'R$ 1.000,00', margemCart: 'R$ 200,00', margemBenefSaque: 'R$ 600,00', margemComp: 'R$ 800,00' },
    { name: 'Diego', tipo: 'Pensionista', cpf: '444.555.666-77', matricula: 'D456', situac: 'Ativo', margemEmp: 'R$ 800,00', margemCart: 'R$ 400,00', margemBenefSaque: 'R$ 500,00', margemComp: 'R$ 900,00' },
    { name: 'Elena', tipo: 'Servidor', cpf: '555.666.777-88', matricula: 'E567', situac: 'Inativo', margemEmp: 'R$ 1.100,00', margemCart: 'R$ 600,00', margemBenefSaque: 'R$ 700,00', margemComp: 'R$ 400,00' },
    { name: 'Fabio', tipo: 'Pensionista', cpf: '666.777.888-99', matricula: 'F678', situac: 'Ativo', margemEmp: 'R$ 900,00', margemCart: 'R$ 300,00', margemBenefSaque: 'R$ 300,00', margemComp: 'R$ 600,00' },
    { name: 'Giovanna', tipo: 'Servidor', cpf: '777.888.999-00', matricula: 'G789', situac: 'Ativo', margemEmp: 'R$ 1.300,00', margemCart: 'R$ 700,00', margemBenefSaque: 'R$ 400,00', margemComp: 'R$ 500,00' },
    { name: 'Hector', tipo: 'Pensionista', cpf: '888.999.000-11', matricula: 'H890', situac: 'Inativo', margemEmp: 'R$ 800,00', margemCart: 'R$ 200,00', margemBenefSaque: 'R$ 200,00', margemComp: 'R$ 700,00' },
    { name: 'Isabela', tipo: 'Servidor', cpf: '999.000.111-22', matricula: 'I901', situac: 'Ativo', margemEmp: 'R$ 1.000,00', margemCart: 'R$ 500,00', margemBenefSaque: 'R$ 600,00', margemComp: 'R$ 800,00' },
    { name: 'Joao', tipo: 'Pensionista', cpf: '123.234.345-45', matricula: 'J012', situac: 'Ativo', margemEmp: 'R$ 850,00', margemCart: 'R$ 350,00', margemBenefSaque: 'R$ 450,00', margemComp: 'R$ 950,00' },
    { name: 'Karen', tipo: 'Servidor', cpf: '234.345.456-56', matricula: 'K123', situac: 'Inativo', margemEmp: 'R$ 1.100,00', margemCart: 'R$ 600,00', margemBenefSaque: 'R$ 700,00', margemComp: 'R$ 400,00' },
    { name: 'Lucas', tipo: 'Pensionista', cpf: '345.456.567-67', matricula: 'L234', situac: 'Ativo', margemEmp: 'R$ 920,00', margemCart: 'R$ 320,00', margemBenefSaque: 'R$ 420,00', margemComp: 'R$ 720,00' },
    { name: 'Maria', tipo: 'Servidor', cpf: '456.567.678-78', matricula: 'M345', situac: 'Ativo', margemEmp: 'R$ 1.200,00', margemCart: 'R$ 700,00', margemBenefSaque: 'R$ 800,00', margemComp: 'R$ 500,00' },
    { name: 'Nathan', tipo: 'Pensionista', cpf: '567.678.789-89', matricula: 'N456', situac: 'Inativo', margemEmp: 'R$ 870,00', margemCart: 'R$ 370,00', margemBenefSaque: 'R$ 470,00', margemComp: 'R$ 970,00' },
    { name: 'Olivia', tipo: 'Servidor', cpf: '678.789.890-90', matricula: 'O567', situac: 'Ativo', margemEmp: 'R$ 1.050,00', margemCart: 'R$ 550,00', margemBenefSaque: 'R$ 650,00', margemComp: 'R$ 850,00' },
    { name: 'Paulo', tipo: 'Pensionista', cpf: '789.890.901-01', matricula: 'P678', situac: 'Ativo', margemEmp: 'R$ 880,00', margemCart: 'R$ 380,00', margemBenefSaque: 'R$ 480,00', margemComp: 'R$ 780,00' },
    { name: 'Quezia', tipo: 'Servidor', cpf: '890.901.012-12', matricula: 'Q789', situac: 'Inativo', margemEmp: 'R$ 1.300,00', margemCart: 'R$ 700,00', margemBenefSaque: 'R$ 800,00', margemComp: 'R$ 600,00' },
    { name: 'Raul', tipo: 'Pensionista', cpf: '901.012.123-23', matricula: 'R890', situac: 'Ativo', margemEmp: 'R$ 920,00', margemCart: 'R$ 420,00', margemBenefSaque: 'R$ 520,00', margemComp: 'R$ 820,00' },
    { name: 'Sofia', tipo: 'Servidor', cpf: '012.123.234-34', matricula: 'S901', situac: 'Ativo', margemEmp: 'R$ 1.150,00', margemCart: 'R$ 650,00', margemBenefSaque: 'R$ 750,00', margemComp: 'R$ 950,00' },
    { name: 'Tiago', tipo: 'Pensionista', cpf: '123.234.345-45', matricula: 'T012', situac: 'Inativo', margemEmp: 'R$ 850,00', margemCart: 'R$ 350,00', margemBenefSaque: 'R$ 450,00', margemComp: 'R$ 950,00' }
]);
</script>
<style scoped>
.page {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.filter {
}

.sheet {
    flex: 1;
    padding: 20px;
    background-color: #ffffff;
}
.p-autocomplete .p-autocomplete-dropdown {
    background: red !important;
    border: 1px solid red !important;
    border-radius: 0.375rem;
    box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
