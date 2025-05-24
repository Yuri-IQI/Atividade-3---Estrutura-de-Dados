import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { TreeNode } from '../types/TreeNode';

type BinaryTreeProps = {
  root: TreeNode | null;
};

const width = 600;
const height = 400;

export const BinaryTree: React.FC<BinaryTreeProps> = ({ root }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!root || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const hierarchyData = d3.hierarchy<TreeNode>(root, node => {
      const children: TreeNode[] = [];
      if (node.left) children.push(node.left);
      if (node.right) children.push(node.right);
      return children.length ? children : null;
    });

    const treeLayout = d3.tree<TreeNode>().size([width - 100, height - 100]);
    const treeData = treeLayout(hierarchyData);

    const g = svg
      .append('g')
      .attr('transform', `translate(50, 50)`);

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
      .attr('r', 20)
      .attr('fill', '#5c5252');

    node
      .append('text')
      .text(d => d.data.value)
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white');

  }, [root]);

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};