import React, { useState } from 'react';
import type { TreeNode } from '../types/TreeNode';

type TreeNodeComponentProps = {
    onInsert: (node: TreeNode) => void;
};

export const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({ onInsert }) => {
    const [value, setValue] = useState<number | ''>('');

    const handleSubmit = () => {
        if (value === '') return;

        const newNode: TreeNode = {
            value,
        };

        onInsert(newNode);
        setValue('');
    };

    return (
        <div>
            <label htmlFor="node-value">Enter Node Value:</label>
            <input
                id="node-value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            />
            <button onClick={handleSubmit}>Insert Node</button>
        </div>
    );
};