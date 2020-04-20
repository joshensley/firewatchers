import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://firewatchers.firebaseio.com/'
});

export default instance;