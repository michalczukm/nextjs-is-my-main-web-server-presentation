import { Comment } from '../types';

export const getComments = async (
  filter: Partial<Comment> = {}
): Promise<readonly Comment[]> => {
  const { default: { comments } } = await import('./comments.json', { with: { type: 'json' } });
  const filters = Object.entries(filter).filter(
    ([_, value]) => value !== undefined
  );

  return comments.filter((comment) =>
    filters.every(([key, value]) => comment[key as keyof Comment] === value)
  );
};

export const getComment = async (
  id: Comment['id']
): Promise<Comment | undefined> => (await getComments({ id })).at(0);
