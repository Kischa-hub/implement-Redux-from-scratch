//Reducer TODO

const todo =(state,action)=>{

    switch(action.type){
    case "ADD_TODO":
        return 
        {
            id: action.id,
            text: action.text,
            completed: false
        };

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
      return [
        ...state,
    todo(undefined,action)
      ];

    case "TOGGLE_TODO":
      return state.map(t=>todo(t,action));

    default:
      return state;
  }
};
