export interface Post {
  readonly id: number;
  readonly title: string;
  readonly content: string;
  readonly author: string;
  readonly tags: readonly string[];
}

export interface Comment {
  readonly id: number;
  readonly postId: number;
  readonly content: string;
  readonly author: string;
}