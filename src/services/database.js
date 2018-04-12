import request from './index';

export function testDatabase (params) {
    return request.post('/api/data_manage/test', params);
};

export function saveDatabase (params) {
    return request.post('/api/data_manage/save', params);
};

export function getDatabaseList (params) {
    return request.get('/api/data_manage/list');
}

export function deleteDatabase (params) {
    return request.delete('/api/data_manage/delete', {params});
}