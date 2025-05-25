import React, { useState } from 'react';
import type { TreeNode } from './types/TreeNode';
import { BinaryTree } from './components/BinaryTree';
import { handleInsertNode, handleRemoveNode } from './services/treeService';
import { InsertNodeMenu } from './components/InsertNodeMenu';
import { RemoveNodeMenu } from './components/RemoveNodeMenu';

const App: React.FC = () => {
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);

  const onInsert = (newNode: TreeNode) => {
    handleInsertNode(newNode, rootNode, setRootNode);
  };

  const onRemove = (node: TreeNode) => {
    handleRemoveNode(node.value, rootNode, setRootNode);
  }

  return (
    <main>
      <div id="tree">
        <h2>Binary Tree Visualization</h2>
        <BinaryTree root={rootNode} />
      </div>
      <div id='menu'>
        <div className="menu">
          <h2>Node Insertion Menu</h2>
          <InsertNodeMenu onInsert={onInsert} />
        </div>
        <div className="menu">
          <h2>Node Remove Menu</h2>
          <RemoveNodeMenu onRemove={onRemove} />
        </div>
      </div>
    </main>
  );
};

export default App;