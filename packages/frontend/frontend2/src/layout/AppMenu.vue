<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    // {
    //     label: 'Home',
    //     items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    // },

    {
        label: 'Vendedores',
        items: [
            // {
            //     label: 'Clientes',
            //     icon: 'pi pi-fw pi-money-bill',
            //     to: '/pages/clientes'
            // },
            // {
            //     label: 'Submenu 2',
            //     icon: 'pi pi-fw pi-bookmark',
            //     items: [
            //         {
            //             label: 'Submenu 2.1',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                 { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2.2',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //         }
            //     ]
            // },
            {
                label: 'Consultar Cliente',
                icon: 'pi pi-fw pi-search',
                to: '/consultar-clientes'
            }
        ]
    },

]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        
    </ul>
</template>

<style lang="scss" scoped></style>
