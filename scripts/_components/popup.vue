<template>
    <section>
        <div>
            <h2>I think it was...</h2>
            <h1 class="result">{{result}}</h1>
            <span><i>Trump: {{trump}}% likeliness, Obama: {{obama}}% likeliness</i></span>
            <div v-if="either">
                <strong>Was I right?</strong>
                <button @click="train(result === 'trump' ? 'trump' : 'obama')">Yes</button>
                <button @click="train(result === 'trump' ? 'obama' : 'trump')">No</button>
            </div>
            <div v-if="!either">
                <strong>Give me a hint?</strong>
                <button @click="train('trump')">Trump</button>
                <button @click="train('obama')">Obama</button>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'PopUp',
    props: ['trump', 'obama', 'result'],
    computed: {
        either () {
            return this.result === 'trump' || this.result === 'obama';
        }
    },
    methods: {
        train (data) {
            this.$emit('train', data);
        }
    }
};
</script>
<style lang="scss" scoped>
    section {
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;

        > div {
            background: #e7eef3;
            padding: 30px;
            display: block;
            border-radius: 5px;
            border: 2px solid darken(#e7eef3, 30%);
        }
    }

    h2 {
        color: #401f20;
        margin: 0;
    }

    button {
        display: inline-block;
        margin: 0;

        &:first-of-type {
            margin-right: 40px;
        }
    }

    strong {
        display: block;
        margin: 30px auto 10px auto;
    }
</style>