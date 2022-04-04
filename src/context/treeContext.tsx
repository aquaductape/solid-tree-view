import { createContext, ComponentProps, batch } from "solid-js";
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
        batch(() => {
          setState(
            produce((s) => {
              // remove child
              const parentNode = s.tree[parentId];
              const foundChildIdx = parentNode.childIds.find(
                (id) => id === childId
              )!;
              parentNode.childIds.splice(foundChildIdx, 1);

              // delete Node and all it's descendants
              const ids = getAllDescendants(s.tree, childId);

              deleteMany(s.tree, ids);
            })
          );
        });
      },
    },
  ];

  return (
    <TreeContext.Provider value={store}>{props.children}</TreeContext.Provider>
  );
}
