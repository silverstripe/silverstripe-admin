import { findTreeByPath } from '../TreeDropdownField';
import mockTree from './mockTree';

describe('findTreeByPath()', () => {
  it('should return the root tree with an empty path provided', () => {
    const node = findTreeByPath(mockTree, []);

    expect(node).toBe(mockTree);
  });

  it('should return null with an empty tree', () => {
    const node = findTreeByPath({}, []);

    expect(node).toBe(null);
  });

  it('should give the proper node in the hierarchy', () => {
    const path = [5, 9];
    const node = findTreeByPath(mockTree, path);

    expect(node.id).toBe(9);
    expect(node.title).toBe('page nine');
  });
});
