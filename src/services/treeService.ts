import type { Dispatch, SetStateAction } from "react";
import type { TreeNode } from "../types/TreeNode";

export const handleInsertNode = (
  newNode: TreeNode,
  root: TreeNode | null,
  setRootNode: Dispatch<SetStateAction<TreeNode | null>>
) => {
  if (!root) {
    newNode.id = `N0-${newNode.value}-N`;
    setRootNode(newNode);
  } else {
    const updatedRoot = insertNode(root, newNode);
    console.log('up', updatedRoot);
    setRootNode({ ...updatedRoot });
  }
};

export const handleRemoveNode = (
  value: number,
  root: TreeNode | null,
  setRootNode: Dispatch<SetStateAction<TreeNode | null>>
) => {
  const updatedRoot = deleteNode(structuredClone(root), value);

  setRootNode(updatedRoot);
};

const insertNode = (node: TreeNode, newNode: TreeNode): TreeNode => {
  if (newNode.value === node.value) {
    alert("Node already exists");
    return node;
  }

  if (newNode.value < node.value) {
    if (!node.left) {
      newNode.id = `N${node.value}-${newNode.value}-L`;
      node.left = newNode;
    } else {
      node.left = insertNode(node.left, newNode);
    }
  } else {
    if (!node.right) {
      newNode.id = `N${node.value}-${newNode.value}-R`;
      node.right = newNode;
    } else {
      node.right = insertNode(node.right, newNode);
    }
  }

  return balance(updateMeta(node));
};

const deleteNode = (node: TreeNode | null, value: number): TreeNode | null => {
  if (!node) return null;

  if (value < node.value) {
    node.left = deleteNode(node.left, value);
  } else if (value > node.value) {
    node.right = deleteNode(node.right, value);
  } else {
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    const successor = findMin(node.right);
    node.value = successor.value;
    node.right = deleteNode(node.right, successor.value);
  }

  return balance(updateMeta(node));
};

const findMin = (node: TreeNode): TreeNode =>
  node.left ? findMin(node.left) : node;

const balance = (node: TreeNode): TreeNode => {
  console.log(node)

  if (node.balance > 1) {
    if ((node.left?.balance ?? 0) < 0) {
      node.left = rotateLeft(node.left!);
    }
    return rotateRight(node);
  }

  if (node.balance < -1) {
    if ((node.right?.balance ?? 0) > 0) {
      node.right = rotateRight(node.right!);
    }
    return rotateLeft(node);
  }

  return node;
};

const rotateLeft = (x: TreeNode): TreeNode => {
  const y = x.right!;
  x.right = y.left;
  y.left = x;
  updateMeta(x);
  return updateMeta(y);
};

const rotateRight = (y: TreeNode): TreeNode => {
  const x = y.left!;
  y.left = x.right;
  x.right = y;
  updateMeta(y);
  return updateMeta(x);
};

const updateMeta = (node: TreeNode): TreeNode => {
  const lh = node.left?.height ?? -1;
  const rh = node.right?.height ?? -1;
  node.height = 1 + Math.max(lh, rh);
  node.balance = lh - rh;
  return node;
};