/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
    content: [],
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

    theme: {
        screen: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1920px',
            '1xl': '1280px',
            '2xl': '1440px',
            '3xl': '1920px'
        },
        extend: {
            colors: {
                primary: '#4F46E5',
                secondary: '#FFC700'
            }
        }
    },
    plugins: [],
    prefix: ''
};
