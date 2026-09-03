'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

/** Server action used by the posts page to revalidate after search/refresh. */
export async function refreshPosts(query?: string, page?: string) {
  revalidatePath('/posts');
  revalidateTag('posts');
  return { query: query ?? '', page: page ?? '1' };
}

/** Server action used by post detail to revalidate a single post. */
export async function refreshPost(id: string | number) {
  revalidatePath(`/posts/${id}`);
  revalidateTag(`post-${id}`);
  return { id };
}
