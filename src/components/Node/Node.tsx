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
  const getAllChildrenCount = createMemo(
    () => getAllDescendants(state.tree, id).length - 1
  );

  const handleIncrementClick = () => increment(id);

  const handleDecrementClick = () => decrement(id);

  const handleAddChildClick = () => createNode(id);

  const handleRemoveClick = () => {
    deleteNode({ parentId: parentId!, childId: id });
  };

  const renderChildrenCount = () => {
    const childrenCount = getAllChildrenCount();

    return childrenCount ? (
      <span class="title-children-amount"> | children: {childrenCount}</span>
    ) : null;
  };

  const ariaDeleteLabel = () => {
    const label = `remove node of ID ${id}`;
    const childrenCount = getAllChildrenCount();

    if (!childrenCount) return label;

    return `${label} and its ${
      childrenCount === 1 ? "one child" : `${childrenCount} children`
    } `;
  };

  const hiddenTitleForAria = () => {
    const label = `ID ${id}`;
    const childrenCount = getAllChildrenCount();

    if (!childrenCount) return label;

    return `${label}. Contains ${
      childrenCount === 1 ? "one child" : `${childrenCount} children`
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
