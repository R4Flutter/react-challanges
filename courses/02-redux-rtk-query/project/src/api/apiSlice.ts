import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from './mockServer'
import type { User, Post } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getUsers()
          return { data }
        } catch (err: unknown) {
          return { error: { status: 'CUSTOM_ERROR', error: String(err) } }
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User' as const, id: 'LIST' }]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getPosts()
          return { data }
        } catch (err: unknown) {
          return { error: { status: 'CUSTOM_ERROR', error: String(err) } }
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Post' as const, id: 'LIST' }]
          : [{ type: 'Post' as const, id: 'LIST' }],
    }),
    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (newPost) => {
        try {
          const data = await mockApi.createPost(newPost)
          return { data }
        } catch (err: unknown) {
          return { error: { status: 'CUSTOM_ERROR', error: String(err) } }
        }
      },
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            const optimisticPost: Post = { ...arg, id: Date.now() }
            draft.push(optimisticPost)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const { useGetUsersQuery, useGetPostsQuery, useAddPostMutation } = apiSlice