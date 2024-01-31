import { Post } from '../types';
import { posts } from './posts.json'

const IN_MEMORY: Post[] = posts;

const getEntities = async () => {
  return IN_MEMORY;
};

export const getPosts = async (
  filter: Partial<Post> = {}
): Promise<readonly Post[]> => {
  const posts = await getEntities();

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

export const createPost = async (post: Omit<Post, "id">): Promise<Post> => {
  const posts = await getPosts();
  const newPost = { ...post, id: posts.length + 1 };

  IN_MEMORY.push(newPost);

  return newPost;
};

export const updatePost = async (id: Post['id'], post: Post): Promise<Post | undefined> => {
  const posts = await getPosts();
  const storedPost = posts.find(p => p.id === id);

  const index = storedPost && IN_MEMORY.indexOf(storedPost);
  if (index !== undefined && index !== -1) {
    IN_MEMORY[index] = post;
    return post;
  }

  return undefined
};
