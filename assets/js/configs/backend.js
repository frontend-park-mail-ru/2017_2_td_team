export const BACKEND_URL = 'td-java.herokuapp.com/';
export const buildBackendUrl = (path) =>'https://' + BACKEND_URL.concat(path);
export const buildWebsocketUrl = (path) => 'wss://' + BACKEND_URL.concat(path);

