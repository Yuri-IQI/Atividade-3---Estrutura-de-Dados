import React, { useState } from 'react';
import { TreeNodeComponent } from './components/TreeNodeComponent';
import type { TreeNode } from './types/TreeNode';
import { BinaryTree } from './components/BinaryTree';
import { handleInsertNode } from './services/treeService';

const App: React.FC = () => {
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);

  const onInsert = (newNode: TreeNode) => {
    handleInsertNode(newNode, rootNode, setRootNode);
  };

  return (
    <main>
      <div id="tree">
        <h2>Binary Tree Visualization</h2>
        <BinaryTree root={rootNode} />
      </div>
      <div id="insertion-menu">
        <h2>Node Insertion Menu</h2>
        <TreeNodeComponent onInsert={onInsert} />
      </div>
    </main>
  );
};

export default App;