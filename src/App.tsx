import { createState } from "solid-js";
import generateTree from "./generateTree";
import Node from "./Node/Node";

function App() {
  // originally I wanted to use Redux Toolkit, not the regular unopinionated one,
  // but I don't have a clue on how to connect the store
  // to the App

  // can reconcile play a part here?
  const [state, setState] = createState(generateTree());
  // passing state as props works since components
  // run once, while the jsx output and hooks are the ones that rerender

  // maybe context is better since it's cleaner, but I wanted to see if passing
  // state as props performance wise is okay

  return (
    <div class="App">
      <Node id={0} state={state} setState={setState}></Node>
    </div>
  );
}

export default App;
