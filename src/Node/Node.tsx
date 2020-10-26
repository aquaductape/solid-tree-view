import { batch, For, SetStateFunction, State } from "solid-js";
import { TTree } from "../generateTree";
import { deleteMany, getAllDescendants } from "./utils";

type NodeProps = {
  id: number;
  parentId?: number;
  state: State<{
    tree: TTree;
    idCount: number;
  }>;
  setState: SetStateFunction<{
    tree: TTree;
    idCount: number;
  }>;
};

const Node = ({ id, parentId, state, setState }: NodeProps) => {
  const handleIncrementClick = () => {
    setState("tree", id, "counter", (value) => value + 1);

    /**
     * this also works at runtime but couldn't find ts solution
     *
     * const path = ["tree", id, "counter"];
     * // @ts-ignore
     * setState(...path, (value) => value + 1);
     */
  };

  const handleDecrementClick = () => {
    setState("tree", id, "counter", (value) => value && value - 1);
  };

  const handleAddChildClick = () => {
    const newId = state.idCount + 1;

    batch(() => {
      // create Node
      setState("idCount", () => newId);
      setState("tree", (tree) => {
        tree[newId] = { id: newId, childIds: [], counter: 0 };
        return tree;
      });

      // add Child
      setState("tree", id, "childIds", (ids) => {
        ids.push(newId);
        return [...ids];
      });
    });
  };

  const handleRemoveClick = () => {
    batch(() => {
      // remove child
      setState("tree", parentId!, "childIds", (ids) =>
        ids.filter((childId) => childId !== id)
      );

      // delete Node
      setState("tree", (tree) => {
        const ids = getAllDescendants(tree, id);

        deleteMany(tree, ids);

        return tree;
      });
    });
  };

  const renderChildrenCount = () => {
    const children = getAllDescendants(state.tree, id).length - 1;

    return children ? (
      <span className="title-children-amount"> | children: {children}</span>
    ) : null;
  };

  return (
    <div className="node">
      <nav className="navbar">
        <div className="title">
          ID: {id} {renderChildrenCount}
        </div>
        {typeof parentId !== "undefined" && (
          <button
            className="btn btn-remove"
            onClick={handleRemoveClick}
            aria-label="remove node including its children"
          >
            x
          </button>
        )}
      </nav>
      <section className="content">
        {/* is there any way to set up a getter where you can pass a parameter such as id. That way I can derive the counter value in shorter line of code? */}
        Counter: {state.tree[id].counter}{" "}
        <button
          className="btn btn-counter"
          onClick={handleIncrementClick}
          aria-label="increment node counter"
        >
          +
        </button>{" "}
        <button
          className="btn btn-counter"
          onClick={handleDecrementClick}
          aria-label="decrement node counter"
        >
          -
        </button>{" "}
        <div className="node-children">
          <For each={state.tree[id].childIds}>
            {(childId) => (
              <Node
                id={childId}
                parentId={id}
                state={state}
                setState={setState}
              />
            )}
          </For>
          {/* <For each={childIds}>{(childId) => renderChild({ id, childId })}</For> */}
          {/* {childIds.map((childId) => renderChild(childId, id))} */}
        </div>
        <button
          className="btn btn-add-child"
          onClick={handleAddChildClick}
          aria-label="add child to node"
        >
          Add Child
        </button>
      </section>
    </div>
  );
};

export default Node;
