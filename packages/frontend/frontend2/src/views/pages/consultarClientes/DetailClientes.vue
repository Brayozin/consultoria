<template>
    <div>
        <div class="card my-2 flex-row gap-4">
            <!-- message telegone updated -->
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
            <div class="flex-row flex row col-12 p-0 gap-0 py-2">
                <div class="col-6 p-0 row flex-col py-2 gap-2 justify-end">
                    <div class="col-12 gap-4 flex p-0 flex-row">
                        <div class="col-10 p-0 p-inputgroup h-10 input-group-telefone">
                            <span class="p-inputgroup-addon p-input-start"><a class="pi pi-whatsapp text-2xl text-green-200" :href="'https://api.whatsapp.com/send?phone=55' + telefone" target="_blank" /> </span>
                            <InputMask id="basic" v-model="telefone" mask="(99)99999-9999" placeholder="(99)99999-9999" class="w-3/4">
                                <template #input>
                                    <input type="text" class="h-10 w-full mt-1 font-semibold p-2 rounded-md bg-primary text-sm" />
                                </template>
                            </InputMask>
                        </div>
                        <div class="col-3 p-0 flex justify-end align-baseline">
                            <Button class="h-10 w-full font-semibold px-6 rounded-md bg-primary text-sm flex justify-center" @click="salvaTelefone"> Alterar </Button>
                        </div>
                    </div>
                    <Message severity="success" v-if="telefoneAtualizado"> <span>Telefone atualizado com sucesso!</span> </Message>
                </div>
                <!-- button save phone -->
            </div>
            <!-- card with margens -->
            <div class="row flex justify-between p-0 gap-0 py-2">
                <div class="col-5 flex-row p-0 gap-0 justify-end">
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
                <div class="col-5 flex p-0 justify-end">
                    <div class="mt-1">
                        <h1 class="text-xl p-0 font-semibold text-primary-300">Tipo:</h1>
                        <input type="text" disabled class="h-10 w-full mt-1 font-semibold p-2 rounded-md bg-slate-100" :value="matriculaSelecionada.tipo" />
                    </div>
                </div>
            </div>
            <div class="row flex col-12 p-0 py-2 justify-between">
                <div class="col-5 flex-col p-0 gap-0 justify-start">
                    <h1 class="text-xl p-0 font-semibold text-primary-300">Situação:</h1>
                    <input type="text" disabled class="h-10 w-full mt-1 font-semibold p-2 rounded-md bg-slate-100" :value="matriculaSelecionada.situacao.split(' ')[0]" />
                </div>
                <!-- phone with wpp logo to redirect to wpp -->
            </div>
            <!-- Table Margens -->
            <div class="card flex-row col-12 p-0 py-2">
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
import { Cliente } from '../../../models/Cliente';
import { Matricula } from '../../../models/Cliente';
import axios from 'axios';
import Message from 'primevue/message';

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
                this.telefone = this.clienteRow.telefone;
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
            margensArray: [],
            telefone: '',
            telefoneAtualizado: false
        };
    },
    methods: {
        async getCliente() {
            const response = await fetch(`https://api.idealfinanceira.com/getcliente/$this.cliente.cpf`);
            let cliente = await response.json();
            cliente = JSON.parse(cliente);
            this.cliente = new Cliente(cliente.cpf, cliente.nome, cliente.matriculas, cliente.ultimaConsulta);
        },

        async salvaTelefone() {
            // remove mask
            this.cliente.telefone = this.telefone.replace(/\D/g, '');
            console.log(this.cliente.telefone);
            let request = {
                params: {
                    cpf: this.cliente.cpf,
                    cliente: JSON.stringify(this.cliente)
                }
            };
            await axios.get('https://api.idealfinanceira.com/updateCliente', request).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    this.telefoneAtualizado = true;
                    setTimeout(() => {
                        this.telefoneAtualizado = false;
                    }, 3000);
                }
            });
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
        const telefone = ref('');
        const telefoneAtualizado = ref(false);
        return {
            cliente,
            matriculasOptions,
            matriculaValue,
            matriculaSelecionada,
            margensArray,
            telefone,
            telefoneAtualizado
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

.input-group-telefone .p-inputgroup-addon {
    background-color: rgb(241 245 249);
}
.input-group-telefone .p-inputtext {
    font-size: xx-small !important;
    background-color: rgb(241 245 249);
}
</style>
