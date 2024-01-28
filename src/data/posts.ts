import { Post } from '@mm/types';

export const getPosts = async (
  filter: Partial<Post> = {}
): Promise<readonly Post[]> => {
  const { posts } = await import('./posts.json');

  const filters = Object.entries(filter).filter(
    ([_, value]) => value !== undefined
  );

  return posts.filter((post) => {
    return filters.every(([key, value]) => {
      if (key === 'tags') {
        return (value as Post['tags']).every((tag) => post.tags.includes(tag));
      }
      return post[key as keyof Post] === value;
    });
  });
};

export const getPost = async (id: Post['id']): Promise<Post | undefined> =>
  (await getPosts({ id })).at(0);
