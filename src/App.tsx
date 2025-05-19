import React, { useState } from 'react';
import { TreeNodeComponent } from './components/TreeNodeComponent';
import type { TreeNode } from './types/TreeNode';
import { BinaryTree } from './components/BinaryTree';

const App: React.FC = () => {
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);

  const handleInsertNode = (newNode: TreeNode) => {
    if (!rootNode) {
      newNode.id = `N0-${newNode.value}-N`;
      setRootNode(newNode);
    } else {
      const parent = getNodeParent(rootNode, newNode.value);
      if (!parent) {
        alert('A Node with this value already exists');
        return;
      }

      if (newNode.value < parent.value) {
        parent.left = newNode;
        newNode.id = `N${parent.value}-${newNode.value}-L`;
      } else {
        parent.right = newNode;
        newNode.id = `N${parent.value}-${newNode.value}-R`;
      }

      setRootNode({ ...rootNode });
    }
  };

  const getNodeParent = (current: TreeNode, value: number): TreeNode | null => {
    if (value === current.value) {
      return null;
    }

    if (value < current.value) {
      if (!current.left) return current;
      return getNodeParent(current.left, value);
    } else {
      if (!current.right) return current;
      return getNodeParent(current.right, value);
    }
  };

  return (
    <main>
      <div id='tree'>
        <h2>Binary Tree Visualization</h2>
        <BinaryTree root={rootNode} />
      </div>
      <div id='insertion-menu'>
        <h2>Node Insertion Menu</h2>
        <TreeNodeComponent onInsert={handleInsertNode} />
      </div>
    </main>
  );
};

export default App;
