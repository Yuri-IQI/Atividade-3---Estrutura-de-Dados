export type TreeNode = {
  id?: string;
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  height?: number;
  balance?: number;
};