import * as debug from "debug";
import * as React from "react";
import * as Redux from "redux";

import { appStore } from "./../redux/appStore";
import { ITodoDTO, ITodoActionDTO } from './../redux/IDTOS.class';
import { addTodo, toggleTodo } from "./../redux/actions/todosActions"

const mainDebugger: debug.Debugger = debug
  .debug("react")
  .extend("ReduxComponent");

const ReduxComponent: (props: Record<string, unknown>) => React.ReactElement = (
  props: Record<string, unknown>
) => {
  mainDebugger("ReduxComponent function");

  const [todos, setTodos]: [
    number,
    React.Dispatch<ITodoDTO[]>
  ] = React.useState<ITodoDTO[]>(appStore.getState().todos);

  React.useEffect(() => {
    const unsubscribe : Redux.Unsubscribe = appStore.subscribe( () => {
      setTodos( appStore.getState().todos );
    } );

    return () => {

      /* Clean custom hook subscription */
      mainDebugger( "ReduxComponent clean subscription" );
      unsubscribe();

    };

  }, []);

  function add() {
    appStore.dispatch( addTodo( `${Math.random()} - text`))
  }

  function toggle( position: number ) {
    appStore.dispatch( toggleTodo(position))
  }

  return (
    <div>
      <ul>
        {todos.map((todo: ITodoDTO[], index : number ) => {
          return (
            <li key={todo.text}>
              Hi {todo.text} ({todo.completed.toString()})!! 
              <button onClick={toggle.bind( null, index )}>Toggle</button>
            </li>
          );
        })}
      </ul>
      <button onClick={add}>Add TODO</button>
    </div>
  );
};

export { ReduxComponent };
