export const BACKEND_URL = 'tdgame.pw/api';
export const buildBackendUrl = (path) => 'https://' + BACKEND_URL.concat(path);
export const buildWebsocketUrl = (path) => 'wss://' + BACKEND_URL.concat(path);
