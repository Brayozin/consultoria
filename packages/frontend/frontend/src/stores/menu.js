
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    // Define your menu variable here
    menu: true,
    }),
    
    actions: {
        // Define your menu actions here
        toggleMenu() {
            console.log('toggleMenu');
            this.menu = !this.menu;
        },
    },
});
