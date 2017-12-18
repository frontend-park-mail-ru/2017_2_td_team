export const BACKEND_URL = 'localhost:8080/api';
export const buildBackendUrl = (path) =>'http://' + BACKEND_URL.concat(path);
export const buildWebsocketUrl = (path) => 'ws://' + BACKEND_URL.concat(path);

