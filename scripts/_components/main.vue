<template>
    <section>
        <h1>Trump or Obama?</h1>
        <i>Post a tweet below and I will tell you who said it.</i>
        <textarea v-model="tweet"></textarea>
        <button @click="assess">Let's see</button>
        <pop-up v-if="popped" :trump="trump" :obama="obama" :result="result" @train="train"></pop-up>
    </section>
</template>

<script>
import PopUp from './popup';

export default {
    name: 'Main',
    components: {PopUp},
    data () {
        return {
            tweet: '',
            lasttweet: '',
            trump: 0,
            obama: 0,
            result: '',
            popped: false
        };
    },
    methods: {
        assess () {
            this.lasttweet = this.tweet;
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/assess');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    const result = JSON.parse(xhr.response);
                    this.trump = Math.round(result.trump * 100);
                    this.obama = Math.round(result.obama * 100);
                    this.result = result.trump > result.obama ? 'trump' : 'obama';
                    if (Math.abs(result.trump - result.obama) < 0.1) {
                        this.result = 'neither';
                    }
                    this.popped = true;
                }
            };
            xhr.send('tweet=' + this.tweet);
        },
        train (data) {
            this.popped = false;
            this.result = '';
            this.tweet = '';
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/train');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send('tweet=' + this.lasttweet + '&who=' + data);
        }
    }
};
</script>
<style lang="scss">
    section {
        display: inline-block;
        vertical-align: middle;
    }

    h1 {
        margin: 0;
        font-size: 35px;
        color: #401f20;
    }

    i {
        color: #8a7261;
    }

    textarea {
        color: #52583d;
        border: 1px solid #52583d;
        border-radius: 5px;
        display: block;
        margin: 0 auto;
        width: 80%;
        min-height: 80px;
    }

    button {
        color: #401f20;
        border: 1px solid #401f20;
        padding: 5px;
        font-size: 16px;
        margin: 20px auto;
        border-radius: 3px;
        display: block;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0);
        box-shadow: 1px 2px 5px transparent;
        min-width: 80px;
        transition: background-color 0.4s, box-shadow 0.4s;

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
            box-shadow: 1px 2px 5px #000;
        }
    }
    .result {
        text-transform: capitalize;
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>