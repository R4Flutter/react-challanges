'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Post {
  id: number;
  title: string;
  body: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
      providesTags: ['Post'],
    }),
    getPost: builder.query<Post, number>({
      query: (id) => `posts/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Post', id }],
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: 'posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation<Post, Partial<Post> & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Post', id }],
    }),
    deletePost: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _err, id) => [{ type: 'Post', id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = apiSlice;
