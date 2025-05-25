import React, { useState } from 'react';
import type { TreeNode } from '../types/TreeNode';

type InsertNodeMenuProps = {
    onInsert: (node: TreeNode) => void;
};

export const InsertNodeMenu: React.FC<InsertNodeMenuProps> = ({ onInsert }) => {
    const [value, setValue] = useState<number | ''>('');

    const handleSubmit = () => {
        if (value === '') return;

        const newNode: TreeNode = {
            value,
            left: null,
            right: null,
            height: 0,
            balance: 0
        };

        onInsert(newNode);
        setValue('');
    };

    return (
        <div>
            <span>
                <label htmlFor="node-value">Enter Node Value:</label>
                <input
                    id="node-value"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                />
            </span>
            <button onClick={handleSubmit}>Insert Node</button>
        </div>
    );
};