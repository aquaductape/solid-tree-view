import { createState, createContext, ComponentProps, batch } from "solid-js";
import { TTree } from "../generateTree";
import { deleteMany, getAllDescendants } from "../Node/utils";

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

export const TreeContext = createContext<TTreeContext>([
  { tree: {}, nextId: 0 },
  {} as any,
]);

export function TreeProvider(props: TreeState & { children: any }) {
  const [state, setState] = createState({
    tree: props.tree,
    nextId: props.nextId,
  });

  const store: TTreeContext = [
    state,
    {
      increment(id) {
        /**
         * this also works at runtime but couldn't find ts solution
         *
         * const path = ["tree", id, "counter"];
         * // @ts-ignore
         * setState(...path, (value) => value + 1);
         */
        setState("tree", id, "counter", (value) => value + 1);
      },
      decrement(id) {
        setState("tree", id, "counter", (value) => value - 1);
      },
      createNode(id) {
        const newId = state.nextId + 1;

        batch(() => {
          // create Node
          setState("nextId", () => newId);
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
      },
      deleteNode({ parentId, childId }) {
        batch(() => {
          // remove child
          setState("tree", parentId!, "childIds", (ids) =>
            ids.filter((id) => id !== childId)
          );

          // delete Node and all it's descendants
          setState("tree", (tree) => {
            const ids = getAllDescendants(tree, childId);

            deleteMany(tree, ids);

            return tree;
          });
        });
      },
    },
  ];

  return (
    <TreeContext.Provider value={store}>{props.children}</TreeContext.Provider>
  );
}
