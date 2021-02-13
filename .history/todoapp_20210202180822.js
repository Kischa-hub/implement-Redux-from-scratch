//Reducer TODO

const todo =(state,action)=>{

    switch(action.type){
case "ADD_TODO":
return 
    {
        id: action.id,
        text: action.text,
        completed: false,
      };


default:
    return state;


    }

}







//Reducer for all TODOS
const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
    
      ];

    case "TOGGLE_TODO":
      return state.map((todo) => {
        //if it is not the selected one return it as it is
        if (todo.id !== action.id) {
          return todo;
        }
        return {
          //if it is the selected one then return the Todo and reverse the completed prop
          ...todo,
          completed: !todo.completed,
        };
      });

    default:
      return state;
  }
};
