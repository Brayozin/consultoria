<script setup lang="ts">
import { onMounted, reactive, ref, watch, onUnmounted, computed } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Avatar from 'primevue/avatar';
import Paginator from 'primevue/paginator';
import InputGroup from 'primevue/';
import ClientsTable from '../components/Dashboard/ClientesTable/ClientsTable.vue';

const { isDarkTheme } = useLayout();

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const handleResize = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

components: {
    TabView;
    TabPanel;
    Avatar;
    Paginator;
    ClientsTable;
}
class seller {
    id: number;
    nome: string;
    email: string;
    qtdClientes: number;
    qtdClientesTrabalhados: number;
    qtdClientesNaoEra: number;
    qtdeClientesSemContato: number;
    qtdClientesFechados: number;
    text: string;
    code: string;
}
const vendedores = ref<seller[]>([]);
const valueSearchSellers = ref(null);

vendedores.value = [
    {
        id: 1,
        nome: 'Júlio Albuquerque',
        email: 'julio@hotmail.com',
        qtdClientes: 100,
        qtdClientesTrabalhados: 60,
        qtdClientesNaoEra: 15,
        qtdeClientesSemContato: 10,
        qtdClientesFechados: 15,
        text: '',
        code: ''
    },
    {
        id: 2,
        nome: 'Almeida Júnior',
        email: 'almeida@gmail.com',
        qtdClientes: 100,
        qtdClientesTrabalhados: 60,
        qtdeClientesSemContato: 33,
        qtdClientesFechados: 15,
        qtdClientesNaoEra: 24,
        text: '',
        code: ''
    },
    {
        id: 3,
        nome: 'João da Silva',
        email: 'joao.silva@gmail.com',
        qtdClientes: 140,
        qtdClientesTrabalhados: 140,
        qtdClientesNaoEra: 20,
        qtdeClientesSemContato: 30,
        qtdClientesFechados: 10,
        text: '',
        code: ''
    },
    {
        id: 4,
        nome: 'Maria da Silva',
        email: 'maria@gmail.com',
        qtdClientes: 200,
        qtdClientesTrabalhados: 180,
        qtdClientesNaoEra: 10,
        qtdeClientesSemContato: 22,
        qtdClientesFechados: 90,
        text: '',
        code: ''
    },
    {
        id: 5,
        nome: 'José da Silva',
        email: 'jose@gmail.com',
        qtdClientes: 200,
        qtdClientesTrabalhados: 110,
        qtdeClientesSemContato: 20,
        qtdClientesFechados: 15,
        qtdClientesNaoEra: 21,
        text: '',
        code: ''
    },
    {
        id: 6,
        nome: 'Gilberto Felipe',
        email: 'gilberto@gmail.com',
        qtdClientes: 200,
        qtdClientesTrabalhados: 110,
        qtdeClientesSemContato: 29,
        qtdClientesFechados: 15,
        qtdClientesNaoEra: 26,
        text: '',
        code: ''
    }
];

const filteredSellers = ref<seller[]>([]);
filteredSellers.value = vendedores.value;
watch(valueSearchSellers, (newValue, oldValue) => {
    if (newValue == null || newValue == '') {
        filteredSellers.value = vendedores.value;
    }
});
const search = (event: { query: string }) => {
    console.log('query: ', event.query);
    const filtered: seller[] = [];
    const query = event.query.toLowerCase();

    if (query.length === 0) {
        filteredSellers.value = vendedores.value;
        return;
    }

    for (let i = 0; i < vendedores.value.length; i++) {
        const vendedor = vendedores.value[i];
        if (vendedor.nome.toLowerCase().indexOf(query) === 0 || vendedor.email.toLowerCase().indexOf(query) === 0) {
            vendedor.text = vendedor.nome + ' - ' + vendedor.email;
            vendedor.code = vendedor.nome + ' - ' + vendedor.email;
            filtered.push(vendedor);
        }
    }
    filteredSellers.value = filtered;
};

const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});

const lineOptions = ref(null);

onMounted(() => {});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);

const dialogSeller = ref(false);
const sellerDialog = ref<seller | null>({
    id: 0,
    nome: '',
    email: '',
    qtdClientes: 0,
    qtdClientesTrabalhados: 0,
    text: '',
    code: ''
});

const openDialogSeller = (id: number) => {
    console.log('id: ', id);
    dialogSeller.value = true;
    sellerDialog.value = vendedores.value.find((vendedor) => vendedor.id === id);
    console.log('sellerDialog: ', sellerDialog.value);
};
</script>

<template>

    <!-- Client list Dialog -->
    <Dialog class="dialog custom-dialog" v-model="dialogClientList" modal :header="typeClients" style="width: 50%;">
        <template #header class="">
            <div class="flex flex-col w-4/5">
                <span class="text-900 font-bold text-xl text-white">{{ typeClients }}</span>
                <span class="text-300 font-medium text-md justify-center w-full">{{ sellerDialog.nome }}</span>
            </div>
        </template>
        
    
    </Dialog>




    <!-- Dialog vendedor -->
    <Dialog class="dialog custom-dialog" v-model:visible="dialogSeller" modal :header="sellerDialog.nome" style="width: 30%">
        <template #header class="">
            <div class="flex flex-col w-4/5">
                <span class="text-900 font-bold text-xl text-white">{{ sellerDialog.nome }}</span>
                <span class="text-300 font-medium text-md justify-center w-full">{{ sellerDialog.email }}</span>
            </div>
        </template>
        <div class="flex flex-col">
            <div class="flex flex-col mt-3">
                <div class="flex flex-col flex-wrap justify-content-center">
                    <span class="text-500 font-medium text-xl text-primary-500">{{ sellerDialog.qtdClientes }} Clientes</span>
                    <div class="surface-300 border-round overflow-hidden w-full h-4">
                        <div class="bg-primary-300 h-full" :style="'width:' + (sellerDialog.qtdClientesTrabalhados / sellerDialog.qtdClientes) * 100 + '%'">
                            <!-- It was not the client bar inside the bar -->
                            
                            <div class="bg-orange-300 h-full" :style="'width:' + (sellerDialog.qtdeClientesSemContato / sellerDialog.qtdClientesTrabalhados) * 100 + '%'">
                                <div class="bg-red-600 h-full" :style="'width:' + (sellerDialog.qtdClientesNaoEra  / sellerDialog.qtdClientesTrabalhados) * 100 + '%'"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 mt-2 ">
                    <span @click="openClientList(0)" class="text-gray-600 ml-0 font-medium text-md cursor-pointer"> {{ ((100-(sellerDialog.qtdClientesTrabalhados / sellerDialog.qtdClientes) * 100).toFixed(0)) + '%' }} dos clientes não trabalhados ({{sellerDialog.qtdClientes - sellerDialog.qtdClientesTrabalhados }}) <i class="pi pi-external-link text-blue-600"></i> </span>
                    <span @click="openClientList(1)" class="text-primary-500 ml-0 font-medium text-md cursor-pointer">{{ ((sellerDialog.qtdClientesTrabalhados / sellerDialog.qtdClientes) * 100).toFixed(0) + '%' }} dos clientes trabalhados ({{ sellerDialog.qtdClientesTrabalhados }}) <i class="pi pi-external-link text-blue-600"></i>   </span>
                    <span @click="openClientList(2)" class="text-red-500 ml-0 font-medium text-md cursor-pointer"> <i class="pi pi-chevron-right text-primary-500"></i>{{ ((sellerDialog.qtdClientesNaoEra / sellerDialog.qtdClientes) * 100).toFixed(0) + '%' }} não era o cliente ({{sellerDialog.qtdClientesTrabalhados - 45  }}) <i class="pi pi-external-link text-blue-600"></i> </span>
                    <span @click="openClientList(3)" class="text-orange-500 ml-0 font-medium text-md cursor-pointer"> <i class="pi pi-chevron-right text-primary-500"></i> {{ ((sellerDialog.qtdeClientesSemContato / sellerDialog.qtdClientes) * 100).toFixed(0) + '%' }} sem contato ({{ (sellerDialog.qtdClientesTrabalhados * 0.30) }}) <i class="pi pi-external-link text-blue-600"></i></span>
                    <span @click="openClientList(4)" class="text-green-500 ml-0 font-medium text-md cursor-pointer"> <i class="pi pi-chevron-right text-primary-500"></i> {{ ((sellerDialog.qtdClientesFechados / sellerDialog.qtdClientes) * 100).toFixed(0) + '%' }} fechados ({{ sellerDialog.qtdClientesFechados }}) <i class="pi pi-external-link text-blue-600"></i></span>
                    </div>
                </div>
            </div>

            <!-- Last Client -->
            <div class="flex flex-col mt-2">
                <span class="text-500 font-medium text-lg text-primary-500">Último cliente trabalhado em: </span>
                <span class="text-600 font-medium text-md align-bottom"> 30/11/2021</span>
            </div>
            <!-- Add more clients to the seller -->
            <div class="flex flex-row justify-start mt-5 gap-2">
                <div class="col-8 p-0">
                    <Button label="Adicionar mais clientes" class="p-button p-2 w-full bg-primary-600 font-normal text-white shadow-primary" @click="addClientsToSeller(sellerDialog.id, sellerDialog.qtdClientes)" />
                </div>
                <div class="col-4 p-0">
                    <InputNumber
                        v-model="sellerDialog.qtdClientes"
                        mode="decimal"
                        :min="0"
                        :max="200"
                        :step="10"
                        :showButtons="true"
                        :decrementButtonClass="sellerDialog.qtdClientes == 0 ? 'p-disabled bg-primary-300' : 'bg-primary'"
                        :incrementButtonClass="sellerDialog.qtdClientes == 200 ? 'p-disabled bg-primary-300' : 'bg-primary'"
                        class="input-number-clients h-full"
                    />
                </div>
            </div>
            <!-- Number of clients to add -->
        </div>
    </Dialog>

    <div class="grid flex flex-row">
        <!-- Cards -->
        <div class="col-12 flex flex-row flex-wrap row p-0">
            <!-- Card Atualizar -->
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card h-full w-full mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Última atualização</span>
                            <div class="text-900 font-medium text-xl">30/11/2023</div>
                            <div class="text-500">15:54</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-refresh text-red-500 text-xl"></i>
                        </div>
                    </div>
                    <Button label="Atualizar" class="p-button p-2 w-full bg-blue-500 font-normal text-white" />
                </div>
            </div>
            <!-- Card  -->
            <div class="col-6 lg:col-6 xl:col-3">
                <div class="card h-full mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Revenue</span>
                            <div class="text-900 font-medium text-xl">$2.100</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                        </div>
                    </div>
                    <span class="text-green-500 font-medium">%52+ </span>
                    <span class="text-500">since last week</span>
                </div>
            </div>

            <!-- Card update actual percentage -->

            <div class="col-6">
                <div class="card h-full mb-0 flex flex-col">
                    <div class="flex justify-content-between mb-3">
                        <span class="block text-900 text-2xl mb-3">Atualizando Clientes...</span>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-spin pi-refresh text-blue-500 text-xl"></i>
                        </div>
                    </div>
                    <div class="mb-0 w-full">
                        <span class="text-500 font-medium mb-5">65963 clientes atualizados</span>
                    </div>

                    <div class="mt-2 w-full h-full md:mt-0 flex flex-row">
                        <div class="surface-300 border-round overflow-hidden w-full h-3">
                            <div class="bg-blue-500 h-full" style="width: 60%"></div>
                        </div>
                        <span class="text-blue-500 ml-3 font-medium">%60</span>
                    </div>

                    <span class="font-medium text-md w-full flex justify-end text-orange-400"> 33:45min restantes</span>
                </div>
            </div>
        </div>

        <!-- seller dialog -->

        <!-- Tabs Vendors and client -->
        <div class="col-12 flex flex-row flex-wrap row">
            <div class="card col-12">
                <!-- tab seller -->
                <TabView>
                    <TabPanel class="p-0">
                        <template #header>
                            <i class="pi pi-dollar"></i>
                            <span class="ml-2">Vendedores</span>
                        </template>
                        <!-- search sellers -->
                        <div class="flex flex-row w-full col-12">
                            <div class="col-4">
                                <span class="p-float-label autocomplete-custom w-full" style="width: 100% !important">
                                    <AutoComplete v-model="valueSearchSellers" :suggestions="filteredSellers" @complete="search($event)" field="text" class="h-12 w-full" style="width: 100% !important"></AutoComplete>
                                    <label for="autocomplete" class="text-blue-200 text-md font-bold">Pesquisar vendedor</label>
                                </span>
                            </div>
                        </div>

                        <div class="flex flex-row flex-wrap w-full h-full col-12">
                            <div :class="[windowWidth > 1400 ? 'col-3' : 'col-4']" v-for="vendedor in filteredSellers" :key="vendedor.id" @click="openDialogSeller(vendedor.id)">
                                <!-- Card with avatar and infos about sellers -->

                                <div class="card">
                                    <!-- Avatar -->
                                    <div class="flex flex flex-col justify-content-center gap-y-2">
                                        <div class="flex flex-row justify-content-center">
                                            <Avatar icon="pi pi-user" class="col-10" size="xlarge" style="background-color: var(--primary-color); color: #ffffff; width: 6rem; height: 6rem" shape="circle" />
                                        </div>
                                        <div class="flex flex-col flex-wrap justify-content-center">
                                            <span class="text-500 font-medium text-xl text-center">{{ vendedor.nome }}</span>
                                            <span class="text-400 text-center">{{ vendedor.email }}</span>
                                        </div>
                                        <div class="flex flex-col flex-wrap justify-content-center">
                                            <span class="text-500 font-medium text-xl text-center">{{ vendedor.qtdClientes }}</span>
                                            <span class="text-500 text-center">Clientes</span>
                                        </div>
                                        <div class="flex flex-col flex-wrap justify-content-center">
                                            <span class="text-500 font-medium text-xl text-center">{{ vendedor.qtdClientesTrabalhados }}</span>
                                            <span class="text-500 text-center">Clientes Trabalhados</span>
                                        </div>
                                        <!-- Categorias (cliente sem contato, não é o cliente, cliente fechado) -->

                                        <!-- percent bar -->
                                        <div class="flex flex-col flex-wrap justify-content-center">
                                            <div class="surface-300 border-round overflow-hidden w-full h-3">
                                                <div class="bg-primary h-full" :style="'width:' + (vendedor.qtdClientesTrabalhados / vendedor.qtdClientes) * 100 + '%'"></div>
                                            </div>
                                            <span class="text-blue-500 ml-0 font-medium">{{ ((vendedor.qtdClientesTrabalhados / vendedor.qtdClientes) * 100).toFixed(0) + '%' }}</span>
                                        </div>
                                        <!-- end percent bar -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <template #header>
                            <i class="pi pi-users"></i>
                            <span class="ml-2">Clientes</span>
                        </template>
                        <ClientsTable />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.autocomplete-custom .p-autocomplete .p-autocomplete-input {
    width: 100% !important;
}

.custom-dialog .p-dialog-header {
    background-color: var(--primary-color);
    color: #ffffff;
}

.input-number-clients .p-inputtext {
    width: 20% !important;
}
</style>
