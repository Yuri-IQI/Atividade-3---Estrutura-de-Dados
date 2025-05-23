import type { TreeNode } from "../types/TreeNode";


export const getNodeHeight = (binaryTree: TreeNode[]): TreeNode[] => {
  const assignHeight = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;

    if (node.left) node.left = assignHeight(node.left);
    if (node.right) node.right = assignHeight(node.right);

    const leftHeight = node.left?.height ?? 0;
    const rightHeight = node.right?.height ?? 0;

    node.height = 1 + Math.max(leftHeight, rightHeight);

    return node;
  };

  return binaryTree.map(root => assignHeight(root)!);
};