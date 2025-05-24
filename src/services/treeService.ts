import type { Dispatch, SetStateAction } from "react";
import type { TreeNode } from "../types/TreeNode";

export const handleInsertNode = (
  newNode: TreeNode,
  rootNode: TreeNode | null,
  setRootNode: Dispatch<SetStateAction<TreeNode | null>>
) => {
  if (!rootNode) {
    newNode.id = `N0-${newNode.value}-N`;
    setRootNode(newNode);
    return;
  }

  const path: TreeNode[] = [];
  let current: TreeNode | null = rootNode;

  while (current) {
    path.push(current);
    if (newNode.value === current.value) {
      alert("A Node with this value already exists");
      return;
    }

    if (newNode.value < current.value) {
      if (!current.left) {
        current.left = newNode;
        newNode.id = `N${current.value}-${newNode.value}-L`;
        break;
      }
      current = current.left;
    } else {
      if (!current.right) {
        current.right = newNode;
        newNode.id = `N${current.value}-${newNode.value}-R`;
        break;
      }
      current = current.right;
    }
  }

  let updatedTree;
  updatedTree = getNodeHeight(rootNode);
  updatedTree = getNodeBalance(updatedTree);

  const pivot = findPivotFromPath(path);
  const balancedSubTree = pivot ? balanceTree(pivot) : updatedTree;

  const newRoot = reinsertSubtree(updatedTree, balancedSubTree, pivot);

  setRootNode({ ...newRoot });
};

const findPivotFromPath = (path: TreeNode[]): TreeNode | null => {
  for (let i = path.length - 1; i >= 0; i--) {
    const node = path[i];
    const balanceFactor = getBalanceFactor(node);
    if (Math.abs(balanceFactor) > 1) {
      return node;
    }
  }
  return null;
};

const getBalanceFactor = (node: TreeNode): number => {
  const left = node.left?.height ?? 0;
  const right = node.right?.height ?? 0;
  return left - right;
};

const reinsertSubtree = (
  tree: TreeNode,
  subTree: TreeNode,
  pivot: TreeNode | null
): TreeNode => {
  if (!pivot || tree === pivot) return subTree;

  const traverse = (node: TreeNode): TreeNode => {
    if (!node) return node;
    if (node.left === pivot) {
      node.left = subTree;
    } else if (node.right === pivot) {
      node.right = subTree;
    } else {
      if (pivot.value < node.value && node.left) {
        node.left = traverse(node.left);
      } else if (pivot.value > node.value && node.right) {
        node.right = traverse(node.right);
      }
    }
    return node;
  };

  return traverse(tree);
};

const balanceTree = (tree: TreeNode): TreeNode => {
  const unbalancedNode = detectUnbalancedNode(tree);
  if (!unbalancedNode) return tree;

  const balance = unbalancedNode.balance ?? 0;
  const isLeftHeavy = balance > 1;
  const isRightHeavy = balance < -1;

  if (isLeftHeavy) {
    const child = unbalancedNode.left!;
    if ((child.balance ?? 0) >= 0) {
      return rotateRight(unbalancedNode);
    } else {
      unbalancedNode.left = rotateLeft(child);
      return rotateRight(unbalancedNode);
    }
  } else if (isRightHeavy) {
    const child = unbalancedNode.right!;
    if ((child.balance ?? 0) <= 0) {
      return rotateLeft(unbalancedNode);
    } else {
      unbalancedNode.right = rotateRight(child);
      return rotateLeft(unbalancedNode);
    }
  }

  return tree;
};

const rotateLeft = (node: TreeNode): TreeNode => {
  const newRoot = node.right!;
  node.right = newRoot.left;
  newRoot.left = node;

  updateNodeMeta(node);
  updateNodeMeta(newRoot);

  return newRoot;
};

const rotateRight = (node: TreeNode): TreeNode => {
  const newRoot = node.left!;
  node.left = newRoot.right;
  newRoot.right = node;

  updateNodeMeta(node);
  updateNodeMeta(newRoot);

  return newRoot;
};

const updateNodeMeta = (node: TreeNode) => {
  getNodeHeight(node);
  getNodeBalance(node);
};

const detectUnbalancedNode = (tree: TreeNode): TreeNode | null => {
  let unbalanced: TreeNode | null = null;

  traverseTree(tree, (node, left, right) => {
    const leftHeight = left?.height ?? 0;
    const rightHeight = right?.height ?? 0;
    node.height = 1 + Math.max(leftHeight, rightHeight);
    node.balance = leftHeight - rightHeight;

    if (unbalanced === null && Math.abs(node.balance) > 1) {
      unbalanced = node;
    }
  });

  return unbalanced;
};

const traverseTree = (
  node: TreeNode | null,
  callback: (node: TreeNode, left: TreeNode | null, right: TreeNode | null) => void
): TreeNode | null => {
  if (!node) return null;

  if (node.left) node.left = traverseTree(node.left, callback);
  if (node.right) node.right = traverseTree(node.right, callback);

  callback(node, node.left ?? null, node.right ?? null);

  return node;
};

const getNodeHeight = (tree: TreeNode): TreeNode => {
  return traverseTree(tree, (node, left, right) => {
    const leftHeight = left?.height ?? 0;
    const rightHeight = right?.height ?? 0;
    node.height = 1 + Math.max(leftHeight, rightHeight);
  })!;
};

const getNodeBalance = (tree: TreeNode): TreeNode => {
  return traverseTree(tree, (node, left, right) => {
    const leftHeight = left?.height ?? 0;
    const rightHeight = right?.height ?? 0;
    node.balance = leftHeight - rightHeight;
  })!;
};