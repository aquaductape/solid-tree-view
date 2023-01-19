import { TTree } from "../../generateTree";

export const getAllDescendants = (tree: TTree, id: number) => {
  const descendants = [id];
  const run = (id: number) => {
    tree[id]?.childIds.forEach((childId) => {
      descendants.push(childId);
      run(childId);
    });
  };

  run(id);
  return descendants;
};
