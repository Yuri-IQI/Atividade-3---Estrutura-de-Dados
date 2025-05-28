import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { TreeNode } from '../types/TreeNode';

type BinaryTreeProps = {
  root: TreeNode | null;
};

export const BinaryTree: React.FC<BinaryTreeProps> = ({ root }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    if (!root || !svgRef.current) return;

    const { width, height } = dimensions;

    const hierarchyData = d3.hierarchy<TreeNode>(root, node => {
        const children: TreeNode[] = [];
        if (node.left) children.push(node.left);
        if (node.right) children.push(node.right);
        return children.length ? children : null;
    });

    const treeLayout = d3.tree<TreeNode>().size([width - 200, height - 200]);
    const treeData = treeLayout(hierarchyData);

    const spacing = 100;
    treeData.each(d => {
        if (d.parent) {
            const isLeft = d.parent.data.left === d.data;
            if (d.parent.children?.length === 1) d.x = d.parent.x + (isLeft ? -spacing : spacing);
        }
    });

    const g = svg.append('g').attr('transform', `translate(100, -50)`);

    g.selectAll('.link')
        .data(treeData.links())
        .join('line')
        .attr('class', 'link')
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    const node = g
        .selectAll('.node')
        .data(treeData.descendants())
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`);

    node
        .append('circle')
        .attr('r', 24)
        .attr('fill', '#5c5252');

    node
        .append('text')
        .text(d => d.data.value)
        .attr('dy', 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white');
    }, [root, dimensions]);

    return (
        <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            style={{ display: 'block', width: '100%', height: '100vh' }}
        />
    );
};