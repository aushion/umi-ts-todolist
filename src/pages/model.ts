import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import { getTodoList, addTodoItem, deleteTodoItem, updateTodoItem } from './service';
import { Item } from './data'

export interface IndexModelState {
  data: Item[];
  pageInfo: {
    pageSize: number,
    pageIndex: number,
    total: number,
  }
}

export interface IndexModelType {
  namespace: 'index';
  state: IndexModelState;
  effects: {
    query: Effect;
    add: Effect;
    delete: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<IndexModelState>;
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'index',

  state: {
    data: [],
    pageInfo: {
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },

  effects: {
    *query({ payload }, { call, put, select }) {
      const res = yield call(getTodoList, payload)

      if (res.code === 200) {
        yield put({
          type: 'save',
          payload: {
            data: res.result.data,
            pageInfo: res.result.pageInfo
          }
        })
      }
    },
    *add({ payload }, { call, put, select }) {
      const res = yield call(addTodoItem, payload)
      const { pageInfo } = yield select((state: { index: IndexModelState; }) => state.index)
      const { pageSize, pageIndex } = pageInfo;
      if (res.code === 200) {
        yield put({
          type: 'query', payload: {
            pageSize,
            pageIndex,
          }
        })

      }
    },
    *delete({ payload }, { call, put, select }) {
      const res = yield call(deleteTodoItem, payload.id)
      const { pageInfo } = yield select((state: { index: IndexModelState; }) => state.index)
      const { pageSize, pageIndex } = pageInfo;
      if (res.code === 200) {
        yield put({
          type: 'query', payload: {
            pageSize,
            pageIndex,
          }
        })
      }
    },
    *update({ payload }, { call, put, select }) {
      const res = yield call(updateTodoItem, payload);
      const { pageInfo } = yield select((state: { index: IndexModelState; }) => state.index)
      const { pageSize, pageIndex } = pageInfo;
      if (res.code === 200) {
        yield put({
          type: 'query', payload: {
            pageSize,
            pageIndex,
          }
        })
      }
    }
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({
            type: 'query',
            payload: {
              pageSize: 5,
              pageIndex: 1,
            }
          })
        }
      });
    }
  }
};

export default IndexModel;
