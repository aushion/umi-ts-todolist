import { request } from 'umi';

const apiUrl = process.env.apiUrl;

type TodoItem = {
    id?: string;
    title: string;
    detail: string;
    status: number;
};

type id = string;

type PageParams = {
    pageIndex: number;
    pageSize: number;
}

export function getTodoList(params: PageParams): Promise<any> {
    return request(apiUrl + '/todolist',{
        method: 'get',
        params: {
            ...params
        }
    });
}

export function addTodoItem(parmas: TodoItem): Promise<any> {
    return request(apiUrl + '/todolist', {
        method: 'post',
        data: {
            ...parmas,
        },
    });
}

export function updateTodoItem(params: TodoItem): Promise<any> {
    const { id } = params;
    return request(apiUrl + `/todolist/${id}`, {
        method: 'put',
        data: {
            ...params,
        },
    });
}

export function deleteTodoItem(params: id): Promise<any> {
    return request(apiUrl + `/todolist/${params}`, {
        method: 'delete',
    });
}
