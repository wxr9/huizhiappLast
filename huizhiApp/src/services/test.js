module.exports = {
  namespace: 'todo',
  state: [],
  reducers: {
    add(state, { payload: todo }) {
      // 保存数据到 state
      return [...state, todo];
    },
  },
  effects: {
    *save({ payload: todo }, { put }) {
      // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
      // yield call(saveTodoToServer, todo);
      yield put({ type: 'add', payload: todo });
    },
  },
};
