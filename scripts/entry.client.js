import Vue from 'vue';
import Main from './_components/main';
import '../styles/critical.scss';

const app = new Vue({render: (h) => { return h(Main); }});
app.$mount('#app');
