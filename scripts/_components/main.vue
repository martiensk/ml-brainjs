<template>
    <section>
        <h1>Trump or Obama?</h1>
        <i>Post a tweet below and I will tell you who said it.</i>
        <textarea v-model="tweet"></textarea>
        <button @click="assess">Let's see</button>
        <span>Trump: {{trump}}</span> - OR - <span>Obama: {{obama}}</span>
    </section>
</template>

<script>
export default {
    name: 'Main',
    data () {
        return {
            tweet: '',
            trump: '',
            obama: ''
        };
    },
    methods: {
        assess () {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/assess');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    const result = JSON.parse(xhr.response);
                    this.trump = result.trump;
                    this.obama = result.obama;
                }
            };
            xhr.send('tweet=' + this.tweet);
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
        transition: background-color 0.4s;

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }
    span {
        display: block;
        margin: 0 auto;
    }
</style>