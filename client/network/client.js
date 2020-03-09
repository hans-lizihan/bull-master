import axios from 'axios';

// TODO: add customized header logic here
const client = axios.create({
  baseURL: `${window.basePath}/api`,
});

export default client;
