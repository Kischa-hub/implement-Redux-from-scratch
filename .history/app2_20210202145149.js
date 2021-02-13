//Reducer
const counter = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};
//createstore without Redux Lib from scratch
const createStore = (reducer) => {
  let state;
  const getState = () => state;
  const dispatch = (action) => {};
  const subscribe = (listener) => {};

  return { getState, dispatch, subscribe };
};

const store = createStore(counter);

const render = () => {
  console.log(store.getState());
};

//store.dispatch({ type: "INCREMENT" });
//store.dispatch({ type: "DECREMENT" });

store.subscribe(() => {
  console.log("Daten werden erfolgreich aktualisiert");
});

render();
