//Reducer TODO

const todo = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return { id: action.id, text: action.text, completed: false };

    case "TOGGLE_TODO":
      //if it is not the selected one return it as it is
      if (state.id !== action.id) {
        return state;
      }
      return {
        //if it is the selected one then return the Todo and reverse the completed prop
        ...state,
        completed: !state.completed,
      };

    default:
      return state;
  }
};

//Reducer for all TODOS
const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];

    // case "DELETE_TODO":
    // return [...state.slice(0,state.)]
    //fruits.slice(0, 3).concat(fruits.slice(4));

    case "TOGGLE_TODO":
      return state.map((t) => todo(t, action));

    default:
      return state;
  }
};

//Reducer Filter

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

//combine Reducer
const combineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
};

//const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter,
});

// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.SET_VISIBILITY_FILTER, action),
//   };
// };

//Store with redux

const { createStore } = Redux;
const store = createStore(todoApp);

const render = () => {
  console.log(store.getState());
};

const addtodo = (todotext) => {
  store.dispatch({
    type: "ADD_TODO",
    id: Date.now(),
    text: todotext,
  });
};

const toggletodo = (todoid) => {
  store.dispatch({ type: "TOGGLE_TODO", id: todoid });
};

const showCompleted = () => {
  store.dispatch({ type: "SET_VISIBILITY_FILTER", filter: "SHOW_COMPLETED" });
};

store.subscribe(() => {
  console.log("Daten werden erfolgreich aktualisiert");
});

// const createStore = (reducer) => {
//     let state=[];
//     let listeners = [];
//     const getState = () => state;
//     const dispatch = (action) => {
//       state = reducer(state, action);
//       listeners.forEach((listener) => listener());
//     };
//     const subscribe = (listener) => {
//       listeners.push(listener);
//       return () => {
//         //not understand this line
//         listeners = listeners.filter((l) => l !== listener);
//       };
//     };

//     dispatch({});

//     return { getState, dispatch, subscribe };
//   };
