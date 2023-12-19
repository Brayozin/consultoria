<template>
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
                        <AutoComplete dropdown v-model="value2" :suggestions="filteredOps" @complete="searchOps($event)" field="text" class="h-12"></AutoComplete>
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
                    <span class="p-input-icon-right">
                        <i class="pi pi-search" v-if="iconPesquisar"></i>
                        <InputText type="search" placeholder="Pesquisar" class="p-2" style="width: 25rem" :value="valuePesquisar" />
                    </span>
                </template>
                <!-- Checkbox to select -->
                <Column selectionMode="multiple" style="width: 3rem" selection="selectedProduct" ></Column>
                <Column field="name" header="Nome" sortable filter-field="nome"  filter> </Column>
                <Column field="tipo" header="Tipo" sortable></Column>
                <Column field="cpf" header="CPF"></Column>
                <Column field="matricula" header="Matricula"></Column>
                <Column field="situac" header="Situação" sortable></Column>
                <Column field="margem" header="Margem Disponível" sortable></Column>
                <!-- whatsapp redict column -->
                <Column header="Whatsapp" class="text-center">
                    <template #body="slotProps">
                        <a href="www.wa.me/41998152523" class="pi pi-whatsapp">
                        </a>
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

interface Filter {
    text: string;
    code: string;
}
interface Operation {
    text: string;
    code: string;
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

const filters = ref<Filter[]>([
    { text: 'Nome', code: 'nome' },
    { text: 'CPF', code: 'cpf' }
]);
const filteredFilters = ref<Filter[]>([]);
const value = ref<string | null>(null);
const valueFilrto = ref<string | null>(null);

const ops = ref<Operation[]>([
    { text: 'Igual', code: 'igual' },
    { text: 'Diferente', code: 'diferente' },
    { text: 'Contendo', code: 'contendo' },
    { text: 'Iniciando com', code: 'iniciandocom' },
    { text: 'Terminando com', code: 'terminandocom' }
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

const searchOps = (event: { query: string }) => {
    const filtered: Operation[] = [];
    const query = event.query.toLowerCase();

    for (let i = 0; i < ops.value.length; i++) {
        const op = ops.value[i];
        if (op.text.toLowerCase().indexOf(query) === 0 || op.code.toLowerCase().indexOf(query) === 0) {
            filtered.push(op);
        }
    }
    filteredOps.value = filtered;
};

const clientes = ref([
    { name: 'Alexandre', tipo: 'Servidor', cpf: '123.456.789-00', matricula: '123456', situac: 'Ativo', margem: 'R$ 1.000,00' },
    { name: 'Barbara', tipo: 'Pensionista', cpf: '123.456.789-00', matricula: '123456', situac: 'Ativo', margem: 'R$ 1.000,00' },
    { name: 'Carlos', tipo: 'Servidor', cpf: '123.456.789-00', matricula: '123456', situac: 'Ativo', margem: 'R$ 500,00' },
    { name: 'Daniel', tipo: 'Pensionista', cpf: '123.456.789-00', matricula: '123456', situac: 'Ativo', margem: 'R$ 500,00' },
    { name: 'Eduardo', tipo: 'Servidor', cpf: '123.456.789-00', matricula: '123456', situac: 'Ativo', margem: 'R$ 900,00' },
    { name: 'Fernanda', tipo: 'Pensionista', cpf: '123.456.789-00', matricula: '123456', situac: 'Ativo', margem: 'R$ 2.300,00' },
    { name: 'Gabriel', tipo: 'Servidor', cpf: '123.456.789-00', matricula: '123456', situac: 'Ativo', margem: 'R$ 1.000,00' },
    { name: 'Hugo', tipo: 'Pensionista', cpf: '123.456.789-00', matricula: '123456', situac: 'Ativo', margem: 'R$ 1.000,00' }
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
