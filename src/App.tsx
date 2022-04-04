import { TreeProvider } from "./context/treeContext";
import generateTree from "../src/generateTree";
import Node from "./components/Node/Node";
import SolidJSImg from "./assets/solid-logo.png";

function App() {
  const { tree, idCount } = generateTree();

  return (
    <div class="App">
      <div className="logo">
        <a href="https://github.com/ryansolid/solid" target="blank">
          <img src={SolidJSImg} alt="Solid JS" />
        </a>
      </div>
      <TreeProvider tree={tree} nextId={idCount}>
        <Node id={0}></Node>
      </TreeProvider>
    </div>
  );
}

export default App;
