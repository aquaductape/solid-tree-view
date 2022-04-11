import { createMemo, For, useContext } from "solid-js";
import { TreeContext } from "../../context/treeContext";
import { getAllDescendants } from "./utils";

type NodeProps = {
  id: number;
  parentId?: number;
};

const Node = ({ id, parentId }: NodeProps) => {
  const [state, { createNode, decrement, deleteNode, increment }] =
    useContext(TreeContext);
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
      <span class="title-children-amount"> | children: {children}</span>
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

  const hiddenTitleForAria = () => {
    const label = `ID ${id}`;
    const children = getAllChildren();

    if (!children) return label;

    return `${label}. Contains ${
      children === 1 ? "one child" : `${children} children`
    }`;
  };

  return (
    <section class="node">
      <div class="title-bar">
        <div class="title">
          <span class="hidden">{hiddenTitleForAria}</span>
          <span aria-hidden="true">
            ID: {id} {renderChildrenCount}
          </span>
        </div>
        {typeof parentId !== "undefined" && (
          <button
            class="btn btn-remove"
            onClick={handleRemoveClick}
            aria-label={ariaDeleteLabel()}
          >
            x
          </button>
        )}
      </div>
      <div class="content">
        Counter: {state.tree[id].counter}{" "}
        <button
          class="btn btn-counter"
          onClick={handleIncrementClick}
          aria-label={`increment counter of node ID of ${id}`}
        >
          +
        </button>{" "}
        <button
          class="btn btn-counter"
          onClick={handleDecrementClick}
          aria-label={`decrement counter of node ID of ${id}`}
        >
          -
        </button>{" "}
        <ul class="node-children">
          <For each={state.tree[id].childIds}>
            {(childId) => (
              <li class="node-child">
                <Node id={childId} parentId={id} />
              </li>
            )}
          </For>
        </ul>
        <button
          class="btn btn-add-child"
          onClick={handleAddChildClick}
          aria-label={`add child to node ID of ${id}`}
        >
          Add Child
        </button>
      </div>
    </section>
  );
};

export default Node;
