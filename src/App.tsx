import { createState } from "solid-js";
import { TreeProvider } from "./context/treeContext";
import generateTree from "./generateTree";
import Node from "./Node/Node";

function App() {
  const { tree, idCount } = generateTree();

  return (
    <div class="App">
      <div className="logo">
        <a href="https://github.com/ryansolid/solid" target="blank">
          <img src="/solid-logo.png" alt="Solid JS" />
        </a>
      </div>
      <TreeProvider tree={tree} nextId={idCount}>
        <Node id={0}></Node>
      </TreeProvider>
    </div>
  );
}

export default App;
