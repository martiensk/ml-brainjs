import Vue from 'vue';
import Main from './_components/main.vue';

export default (context) => {
    const app = new Vue({render: (h) => { return h(Main); }});
    return app;
};
