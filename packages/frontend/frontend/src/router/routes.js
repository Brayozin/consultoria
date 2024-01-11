const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: {
            title: 'Home'
        }
    },
    {
        path: '/clients',
        name: 'clients',
        component: () => import('../views/Clients.vue'),
        meta: {
            title: 'Clientes'
        }    
    }

];
