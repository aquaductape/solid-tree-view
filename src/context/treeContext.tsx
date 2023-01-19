import {
  createContext,
  ComponentProps,
  batch,
  createEffect,
  For,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { TTree } from "../generateTree";
import { getAllDescendants } from "../components/Node/utils";

type TreeState = {
  tree: TTree;
  nextId: number;
};

type TTreeContext = [
  TreeState,
  {
    increment(id: number): void;
    decrement(id: number): void;
    deleteNode({
      parentId,
      childId,
    }: {
      parentId: number;
      childId: number;
    }): void;
    createNode(id: number): void;
  }
];

const deleteMany = (tree: TTree, ids: number[]) => {
  ids.forEach((id) => delete tree[id]);
};

export const TreeContext = createContext<TTreeContext>([
  { tree: {}, nextId: 0 },
  {} as any,
]);

export function TreeProvider(props: TreeState & { children: any }) {
  const [state, setState] = createStore({
    tree: props.tree,
    nextId: props.nextId,
  });

  const store: TTreeContext = [
    state,
    {
      increment(id) {
        setState("tree", id, "counter", (value) => value + 1);
      },
      decrement(id) {
        setState("tree", id, "counter", (value) => value - 1);
      },
      createNode(id) {
        const newId = state.nextId + 1;

        setState(
          produce((s) => {
            // create Node
            s.nextId = newId;
            s.tree[newId] = { id: newId, childIds: [], counter: 0 };
            // add Child
            s.tree[id].childIds.push(newId);
          })
        );
      },
      deleteNode({ parentId, childId }) {
        setState(
          produce((s) => {
            // remove child
            const parentNode = s.tree[parentId];
            const foundChildIdx = parentNode.childIds.findIndex(
              (id) => id === childId
            )!;
            // updates nested list UI
            parentNode.childIds.splice(foundChildIdx, 1);

            // delete Node and all it's descendants
            const ids = getAllDescendants(s.tree, childId);

            // if you COMMENT OUT line 79
            // On the node window that the user clicks "X" to close,
            // it's removed from state.tree, but
            // that node will not be removed on the UI.
            // (if that node has children, the children will be removed in the UI, but
            // the node itself still persists in the UI)
            // At first glance doesn't appear to cause reactive change (update UI).
            // but if you look at seperate group at top where it renders a loop of state.tree ids in a single column,
            // that id from "removed" node window, is correctly removed in that list in the UI.
            // The tree state (state.tree) is updated, where it's child object is removed,
            // but since that removed child ID number still lives in one of the other child's childIds array, it still renders (if access to tree[id] properties are optionally chained `(?.)`)
            deleteMany(s.tree, ids);

            console.log(s.tree);
          })
        );
      },
    },
  ];

  return (
    <TreeContext.Provider value={store}>
      <div class="node" style="width: fit-content;">
        <div class="title-bar">
          <div class="title">Looping object items in state.tree</div>
        </div>

        <div class="content">
          <div>
            <code style="white-space: pre-wrap;">
              {`
<For each={Object.entries(state.tree)}>
  {([key, value]) => <li>{value.id}</li>}
</For>
`}
            </code>
          </div>
          <ul>
            <For each={Object.entries(state.tree)}>
              {([key, value]) => <li> item.id: {value.id}</li>}
            </For>
          </ul>
        </div>
        <div class="node" style="width: fit-content;">
          <div class="title-bar">
            <div class="title">
              Looping array items in state.tree[id].childIds
            </div>
          </div>
          <div class="content">
            <code style="white-space: pre-wrap;">
              {`
<For each={state.tree[id]?.childIds}>
  {(childId) => (
      <Node id={childId} parentId={id} />
  )}
</For>`}
            </code>
            <div style="height: 10px;"></div>
            {props.children}
          </div>
        </div>
      </div>
    </TreeContext.Provider>
  );
}
