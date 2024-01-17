<template>
    <div>
        <div class="card grid my-2 flex-col gap-4">
            <span class="row flex p-0 gap-0">
                <div class="col-8 flex-col p-0">
                    <h1 class="text-3xl font-semibold text-primary-500">{{ cliente.nome }}</h1>
                    <span class="font-semibold text-lg text-primary-300"> {{ cliente.cpf }} </span>
                </div>
                <div class="col-4 flex-col p-0 gap-0 align-items-end justify-end">
                    <p class="font-semibold text-primary-300 p-0 align-items-end justify-end flex">Ultima consulta:</p>
                    <span class="text-sm font-semibold text-primary-300 p-0 justify-end flex"> {{ new Date(cliente.ultimaConsulta).toLocaleString('pt-BR', { timeZone: 'UTC' }) }} </span>
                </div>
            </span>

            <!-- card with margens -->
            <div class="row flex p-0 gap-0">
                <div class="col-5 flex-col p-0 gap-0 justify-end">
                    <div class="drop-down-matricula mt-2">
                        <div class="float-label">
                            <label class="text-primary-300 text-xl font-bold">Matricula</label>

                            <Dropdown dropdown v-model="matriculaValue" :options="matriculasOptions" optionLabel="label" optionValue="value" class="h-10 w-full text-sm">
                                <template #value="{ value, placeholder }">
                                    <span v-if="value" class="flex flex-row justify-start items-center gap-1">
                                        <span class="">{{ value }}</span>
                                    </span>
                                    <span v-else class="flex flex-row justify-start items-center gap-1">
                                        <span>{{ placeholder }}</span>
                                    </span>
                                </template>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row flex p-0 justify-between">
                <div class="col-5 flex-col p-0 gap-0 justify-between">
                    <h1 class="text-xl p-0 font-semibold text-primary-300">Tipo:</h1>
                    <input type="text" disabled class="h-10 w-full mt-1 font-semibold p-2 rounded-md bg-slate-100" :value="matriculaSelecionada.tipo" />
                </div>
                <div class="col-5 flex-col p-0 gap-0 justify-start">
                    <h1 class="text-xl p-0 font-semibold text-primary-300">Situação:</h1>
                    <input type="text" disabled class="h-10 w-full mt-1 font-semibold p-2 rounded-md bg-slate-100" :value="matriculaSelecionada.situacao.split(' ')[0]" />
                </div>
            </div>
            <!-- Table Margens -->
            <div class="card flex-row col-12 p-0">
                <DataTable :value="margensArray" tableStyle="min-width: 50rem" selectionMode="multiple" selection="selectedProduct">
                    <Column field="tipo" header="Tipo" sortable></Column>
                    <Column field="total" header="Total" sortable></Column>
                    <Column field="disponivel" header="Disponível" sortable></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Cliente }  from '../../../models/Cliente';
import { Matricula } from '../../../models/Cliente';
export default defineComponent({
    name: 'DetailClientes',
    props: {
        clienteRow: {
            type: Object as () => Cliente,
            required: true
        }
    },

    watch: {
        clienteRow: {
            handler() {
                this.cliente = this.clienteRow;
                this.matriculasOptions = this.clienteRow.matriculas.map((matricula) => {
                    return { label: matricula.matricula, value: matricula.matricula };
                });
                this.matriculaValue = this.matriculasOptions[0].value;
                this.matriculaSelecionada = this.clienteRow.matriculas[0];
            },
            immediate: true
        },
        matriculaValue: {
            handler() {
                this.matriculaSelecionada = this.clienteRow.matriculas.find((matricula) => matricula.matricula === this.matriculaValue);
                let margensArray: { tipo: string; total: number; disponivel: number }[] = [];

                let margemEmprestimo = this.matriculaSelecionada.margens.emprestimo;
                let margemCartao = this.matriculaSelecionada.margens.cartao;
                let margemsaque = this.matriculaSelecionada.margens.saque;
                let margemcompra = this.matriculaSelecionada.margens.compra;

                margensArray.push({ tipo: 'Empréstimo', total: margemEmprestimo.total, disponivel: margemEmprestimo.disponivel });
                margensArray.push({ tipo: 'Cartão', total: margemCartao.total, disponivel: margemCartao.disponivel });
                margensArray.push({ tipo: 'Saque', total: margemsaque.total, disponivel: margemsaque.disponivel });
                margensArray.push({ tipo: 'Compra', total: margemcompra.total, disponivel: margemcompra.disponivel });
                this.margensArray = margensArray;
            },
            immediate: true
        }
    },

    data() {
        return {
            cliente: {},
            matriculaSelecionada: {},
            matriculasOptions: [],
            matriculaValue: '',
            margensArray: []
        };
    },
    methods: {
        async getCliente() {
            const response = await fetch(`https://api.idealfinanceira.com/getcliente/$this.cliente.cpf`);
            let cliente = await response.json();
            cliente = JSON.parse(cliente);
            this.cliente = new Cliente(cliente.cpf, cliente.nome, cliente.matriculas, cliente.ultimaConsulta);
        }
    },
    setup(props, data) {
        const cliente = ref(props.clienteRow);
        const matriculasOptions = ref([]);
        const matriculaValue = ref('');
        // type matricula
        const matriculaSelecionada = ref({} as Matricula);
        // any array
        const margensArray = ref<{ tipo: string; total: number; disponivel: number }[]>([]);
        return {
            cliente,
            matriculasOptions,
            matriculaValue,
            matriculaSelecionada
        };
    }
});
</script>

<style lang="scss">
.drop-down-matricula .p-dropdown-trigger {
    color: var(--primary-800) !important;
    font-weight: 900 !important;
    background-color: var(--primary-50) !important;
}

.drop-down-matricula .p-dropdown-trigger:hover {
}

.drop-down-matricula .p-dropdown-label {
    border-radius: 0.375rem 0 0 0.375rem !important;
    background-color: var(--primary-50) !important;
}
</style>
