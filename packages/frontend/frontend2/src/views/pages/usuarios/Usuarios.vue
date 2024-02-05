<template>
    <div>
        <!-- modal -->
        <div class="card">
            <!-- activate modal -->
            <h1 class="text-3xl font-semibold">Gerenciar Usuários</h1>
        </div>
        <div class="card">
            <DataTable :value="users" :paginator="true" :rows="5" :rowsPerPageOptions="[5, 10, 20]">
                <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"></Column>
                <Column header="Ações" bodyStyle="text-align:center">
                    <template #body="slotProps">
                        <div class="flex flex-row justify-around">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editUser(slotProps.data.id)"></Button>
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteUser(slotProps.data.id)"></Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- confirm delete popup -->
        <Dialog header="Confirmação" :visible="displayConfirmation" :modal="true" :style="{ width: '350px' }">
            <div class="flex items-center justify-center">
                <i class="pi pi-exclamation-triangle mr-3 text-red-600" style="font-size: 2rem"></i>
                <span>Tem certeza que deseja excluir este usuário?</span>
            </div>
            <template #footer>
                <div class="flex grid justify-around">
                    <div class="col-4 p-2">
                        <Button @click="displayConfirmation = false" class="py-2 px-1 w-full font-bold justify-center text-center"> Não </Button>
                    </div>
                    <div class="col-4 p-2 justify-center">
                        <Button @click="deleteUserConfirmed(userId)" class="py-2 px-1 w-full bg-red-600 text-white font-bold justify-center text-center">
                            <span class="text-white text-bold justify-center text-center"> Sim </span>
                        </Button>
                    </div>
                </div>
            </template>
        </Dialog>

        <!-- edit user modal -->
        <Dialog header="Editar Usuário" :visible="displayEditUser" :modal="true" :style="{ width: '350px' }" class="columnMatricula">
            <div class="p-fluid">
                <div class="p-field mt-2">
                    <label for="name" class="p-mb-2 font-bold">Nome</label>
                    <InputText id="name" v-model="selectedUser.name" class="shadow-3 p-3 text-primary-800" />
                </div>
                <div class="p-field mt-2">
                    <label for="email" class="p-mb-2 font-bold">E-mail</label>
                    <InputText id="email" v-model="selectedUser.email" class="shadow-3 p-3 text-primary-800" />
                </div>
                <div class="p-field mt-2">
                    <label for="role" class="p-mb-2 font-bold">Função</label>
                    <Dropdown id="role" v-model="selectedUser.role" :options="funcoes" optionLabel="label" optionValue="value" placeholder="Selecione uma função" class="p-1 h-10 shadow-3" />
                </div>
            </div>
            <template #footer>
                <div class="flex grid justify-around">
                    <div class="col-5 p-2 ">
                        <Button @click="displayEditUser = false" class=" py-2 px-1 w-full font-bold justify-center text-center "> Cancelar </Button>
                    </div>
                    <div class="col-5 p-2 justify-center">
                        <Button @click="saveUser(userId)" class="py-2 px-1 w-full bg-primary-600 text-white font-bold justify-center text-center">
                            <span class="text-white text-bold justify-center text-center"> Salvar </span>
                        </Button>
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            users: [
                { id: 1, name: 'João Silva', email: 'joao@gmail.com', role: 'Admin' },
                { id: 2, name: 'Maria Doe', email: 'mariadoe@gmail.com', role: 'Vendedor' },
                { id: 3, name: 'José Santos', email: 'joseSant@gmail.com', role: 'Vendedor' },
                { id: 4, name: 'Ana Oliveira', email: 'anaoliveira@gmail.com', role: 'Supervisor' },
                { id: 5, name: 'Pedro Souza', email: 'pedrosouza@gmail.com', role: 'Vendedor' },
                { id: 6, name: 'Mariana Costa', email: 'marianacosta@gmail.com', role: 'Supervisor' },
                { id: 7, name: 'Lucas Pereira', email: 'lucaspereira@gmail.com', role: 'Vendedor' },
                { id: 8, name: 'Carolina Santos', email: 'carolinasantos@gmail.com', role: 'Supervisor' },
                { id: 9, name: 'Rafaela Lima', email: 'rafaelalima@gmail.com', role: 'Vendedor' },
                { id: 10, name: 'Gustavo Almeida', email: 'gustavoalmeida@gmail.com', role: 'Supervisor' },
                { id: 11, name: 'Fernanda Oliveira', email: 'fernandaoliveira@gmail.com', role: 'Vendedor' },
                { id: 12, name: 'Rodrigo Silva', email: 'rodrigosilva@gmail.com', role: 'Supervisor' }
            ],
            columns: [
                { field: 'name', header: 'Nome' },
                { field: 'email', header: 'E-mail' },
                { field: 'role', header: 'Função' }
            ],
            funcoes: [
                { value: 'Admin', label: 'Admin' },
                { value: 'Vendedor', label: 'Vendedor' },
                { value: 'Supervisor', label: 'Supervisor' }
            ],

            displayConfirmation: false,
            userId: null,
            displayEditUser: false,
            selectedUser: {}
        };
    },

    methods: {
        saveUser() {
            // Implement save user logic here
            this.displayEditUser = false;
        },

        editUser(userId) {
            console.log('edit user', userId);
            this.selectedUser = JSON.parse(JSON.stringify(this.users.find((user) => user.id === userId)));
            console.log('selectedUser', this.selectedUser);
            this.displayEditUser = true;
        },
        deleteUserConfirmed(userId) {
            // Implement delete user logic here
            this.displayConfirmation = false;
        },
        deleteUser(userId) {
            this.userId = userId;
            this.displayConfirmation = true;
        }
    }
};
</script>

<style>
.columnMatricula .p-dropdown .p-dropdown-label {
    border: none !important;
    border-radius: 0.25rem 0 0 0.25rem !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.columnMatricula .p-dropdown .p-inputtext {
    border: none !important;
    box-shadow: none !important;
}

.columnMatricula .p-dropdown .p-dropdown-trigger {
    color: var(--primary-300);
}

/* input */
.columnMatricula .p-inputtext {
    border: none !important;
    border-radius: 0 0.25rem 0.25rem 0 !important;
    padding: 0.5rem 0.75rem !important;
    width: 100% !important;
    height: 2.5rem !important;
    background-color: var(--slate-100) !important;
    color: var(--slate-800) !important;
}
</style>
