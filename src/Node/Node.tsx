import { createMemo, For, useContext } from "solid-js";
import { TreeContext } from "../context/treeContext";
import { getAllDescendants } from "./utils";

type NodeProps = {
  id: number;
  parentId?: number;
};

const Node = ({ id, parentId }: NodeProps) => {
  const [state, { createNode, decrement, deleteNode, increment }] = useContext(
    TreeContext
  );
  const getAllChildren = createMemo(
    () => getAllDescendants(state.tree, id).length - 1
  );

  const handleIncrementClick = () => increment(id);

  const handleDecrementClick = () => decrement(id);

  const handleAddChildClick = () => createNode(id);

  const handleRemoveClick = () => {
    deleteNode({ parentId: parentId!, childId: id });
  };

  const renderChildrenCount = () => {
    const children = getAllChildren();

    return children ? (
      <span className="title-children-amount"> | children: {children}</span>
    ) : null;
  };

  const ariaDeleteLabel = () => {
    const label = `remove node of ID ${id}`;
    const children = getAllChildren();

    if (!children) return label;

    return `${label} and its ${
      children === 1 ? "one child" : `${children} children`
    } `;
  };

  return (
    <div className="node">
      <nav className="navbar">
        <div className="title">
          ID: {id} {renderChildrenCount()}
        </div>
        {typeof parentId !== "undefined" && (
          <button
            className="btn btn-remove"
            onClick={handleRemoveClick}
            aria-label={ariaDeleteLabel()}
          >
            x
          </button>
        )}
      </nav>
      <section className="content">
        {/* is there any way to set up a getter where you can pass a parameter such as id. */}
        Counter: {state.tree[id].counter}{" "}
        <button
          className="btn btn-counter"
          onClick={handleIncrementClick}
          aria-label={`increment counter of node ID of ${id}`}
        >
          +
        </button>{" "}
        <button
          className="btn btn-counter"
          onClick={handleDecrementClick}
          aria-label={`decrement counter of node ID of ${id}`}
        >
          -
        </button>{" "}
        <div className="node-children">
          <For each={state.tree[id].childIds}>
            {(childId) => <Node id={childId} parentId={id} />}
          </For>
        </div>
        <button
          className="btn btn-add-child"
          onClick={handleAddChildClick}
          aria-label={`add child to node ID of ${id}`}
        >
          Add Child
        </button>
      </section>
    </div>
  );
};

export default Node;
