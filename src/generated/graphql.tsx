import { DocumentNode } from 'graphql';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Query = {
  __typename?: 'Query';
  node: Node;
  nodes: Array<Node>;
  topics: TopicsConnection;
  topicById: Topic;
  comments: CommentsConnection;
  currentUser: CurrentUser;
  notifications: Array<Notification>;
  notificationsCount: Scalars['Int'];
};


export type QueryNodeArgs = {
  slug: Scalars['String'];
};


export type QueryTopicsArgs = {
  take?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type QueryTopicByIdArgs = {
  id: Scalars['Int'];
};


export type QueryCommentsArgs = {
  topicId: Scalars['Int'];
  take?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  order?: Maybe<Sort_Order>;
};

export type Node = {
  __typename?: 'Node';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  topicsCount: Scalars['Int'];
};


export type TopicsConnection = {
  __typename?: 'TopicsConnection';
  items: Array<Topic>;
  hasNext: Scalars['Boolean'];
  hasPrev: Scalars['Boolean'];
};

export type Topic = {
  __typename?: 'Topic';
  id: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  authorId: Scalars['Int'];
  nodeId: Scalars['Int'];
  /** A url string if the content is a valid URL */
  url?: Maybe<Scalars['String']>;
  /** If this topic content is a url, this field will be filled with the domain name */
  domain?: Maybe<Scalars['String']>;
  author: TopicAuthor;
  html: Scalars['String'];
  commentsCount: Scalars['Int'];
  node: Node;
  likesCount: Scalars['Int'];
  isLiked: Scalars['Boolean'];
};

export type TopicAuthor = {
  __typename?: 'TopicAuthor';
  id: Scalars['Int'];
  username: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
};

export type CommentsConnection = {
  __typename?: 'CommentsConnection';
  items: Array<Comment>;
  hasNext: Scalars['Boolean'];
  hasPrev: Scalars['Boolean'];
  total: Scalars['Int'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  content: Scalars['String'];
  authorId: Scalars['Int'];
  parentId?: Maybe<Scalars['Int']>;
  topicId: Scalars['Int'];
  html: Scalars['String'];
  author: UserPublicInfo;
  parent?: Maybe<Comment>;
  topic: Topic;
  likesCount: Scalars['Int'];
  isLiked: Scalars['Boolean'];
};

export type UserPublicInfo = {
  __typename?: 'UserPublicInfo';
  id: Scalars['Int'];
  username: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
};

export enum Sort_Order {
  Desc = 'DESC',
  Asc = 'ASC'
}

export type CurrentUser = {
  __typename?: 'CurrentUser';
  id: Scalars['Int'];
  email: Scalars['String'];
  username: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  isRead?: Maybe<Scalars['Boolean']>;
  data: Scalars['JSONObject'];
  resolvedData: ResolvedDataUnion;
};


export type ResolvedDataUnion = TopicCommentData | CommentReplyData;

export type TopicCommentData = {
  __typename?: 'TopicCommentData';
  type: Scalars['String'];
  comment: Comment;
};

export type CommentReplyData = {
  __typename?: 'CommentReplyData';
  type: Scalars['String'];
  replyComment: Comment;
};

export type Mutation = {
  __typename?: 'Mutation';
  signup: Scalars['Boolean'];
  login: Scalars['Boolean'];
  createNode: Node;
  createTopic: Topic;
  updateTopic: Topic;
  likeTopic: Scalars['Boolean'];
  createComment: Comment;
  likeComment: Scalars['Boolean'];
  markAllNotificationsAsRead: Scalars['Boolean'];
};


export type MutationCreateNodeArgs = {
  name: Scalars['String'];
  description: Scalars['String'];
  slug: Scalars['String'];
  image?: Maybe<Scalars['String']>;
};


export type MutationCreateTopicArgs = {
  title: Scalars['String'];
  content: Scalars['String'];
  nodeId: Scalars['Int'];
};


export type MutationUpdateTopicArgs = {
  id: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  nodeId?: Maybe<Scalars['Int']>;
};


export type MutationLikeTopicArgs = {
  topicId: Scalars['Int'];
};


export type MutationCreateCommentArgs = {
  topicId: Scalars['Int'];
  content: Scalars['String'];
  parentId?: Maybe<Scalars['Int']>;
};


export type MutationLikeCommentArgs = {
  commentId: Scalars['Int'];
};

export type CommentsQueryVariables = Exact<{
  topicId: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
}>;


export type CommentsQuery = (
  { __typename?: 'Query' }
  & { comments: (
    { __typename?: 'CommentsConnection' }
    & Pick<CommentsConnection, 'total'>
    & { items: Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'createdAt' | 'html' | 'likesCount' | 'isLiked'>
      & { author: (
        { __typename?: 'UserPublicInfo' }
        & Pick<UserPublicInfo, 'username' | 'avatar'>
      ), parent?: Maybe<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'id' | 'html'>
        & { author: (
          { __typename?: 'UserPublicInfo' }
          & Pick<UserPublicInfo, 'username'>
        ) }
      )> }
    )> }
  ) }
);

export type CreateCommentMutationVariables = Exact<{
  topicId: Scalars['Int'];
  content: Scalars['String'];
  parentId?: Maybe<Scalars['Int']>;
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment: (
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'html'>
  ) }
);

export type CreateNodeMutationVariables = Exact<{
  name: Scalars['String'];
  description: Scalars['String'];
  slug: Scalars['String'];
  image?: Maybe<Scalars['String']>;
}>;


export type CreateNodeMutation = (
  { __typename?: 'Mutation' }
  & { createNode: (
    { __typename?: 'Node' }
    & Pick<Node, 'id' | 'slug'>
  ) }
);

export type CreateTopicMutationVariables = Exact<{
  title: Scalars['String'];
  content: Scalars['String'];
  nodeId: Scalars['Int'];
}>;


export type CreateTopicMutation = (
  { __typename?: 'Mutation' }
  & { createTopic: (
    { __typename?: 'Topic' }
    & Pick<Topic, 'id'>
  ) }
);

export type LikeCommentMutationVariables = Exact<{
  commentId: Scalars['Int'];
}>;


export type LikeCommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'likeComment'>
);

export type LikeTopicMutationVariables = Exact<{
  topicId: Scalars['Int'];
}>;


export type LikeTopicMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'likeTopic'>
);

export type MarkAllNotificationsAsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsAsReadMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'markAllNotificationsAsRead'>
);

export type NodesForNewTopicQueryVariables = Exact<{ [key: string]: never; }>;


export type NodesForNewTopicQuery = (
  { __typename?: 'Query' }
  & { nodes: Array<(
    { __typename?: 'Node' }
    & Pick<Node, 'id' | 'slug' | 'name'>
  )> }
);

export type NotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsQuery = (
  { __typename?: 'Query' }
  & { notifications: Array<(
    { __typename?: 'Notification' }
    & Pick<Notification, 'id' | 'createdAt'>
    & { resolvedData: (
      { __typename?: 'TopicCommentData' }
      & Pick<TopicCommentData, 'type'>
      & { comment: (
        { __typename?: 'Comment' }
        & Pick<Comment, 'id' | 'html'>
        & { author: (
          { __typename?: 'UserPublicInfo' }
          & Pick<UserPublicInfo, 'username'>
        ), topic: (
          { __typename?: 'Topic' }
          & Pick<Topic, 'id' | 'title' | 'authorId'>
        ) }
      ) }
    ) | (
      { __typename?: 'CommentReplyData' }
      & Pick<CommentReplyData, 'type'>
      & { replyComment: (
        { __typename?: 'Comment' }
        & Pick<Comment, 'id' | 'html'>
        & { author: (
          { __typename?: 'UserPublicInfo' }
          & Pick<UserPublicInfo, 'username'>
        ), topic: (
          { __typename?: 'Topic' }
          & Pick<Topic, 'id' | 'title'>
        ) }
      ) }
    ) }
  )> }
);

export type NotificationsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsCountQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'notificationsCount'>
);

export type TopicQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TopicQuery = (
  { __typename?: 'Query' }
  & { topicById: (
    { __typename?: 'Topic' }
    & Pick<Topic, 'id' | 'title' | 'html' | 'createdAt' | 'likesCount' | 'isLiked'>
    & { node: (
      { __typename?: 'Node' }
      & Pick<Node, 'id' | 'name' | 'slug'>
    ), author: (
      { __typename?: 'TopicAuthor' }
      & Pick<TopicAuthor, 'id' | 'username' | 'avatar'>
    ) }
  ) }
);

export type TopicForEditQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TopicForEditQuery = (
  { __typename?: 'Query' }
  & { topicById: (
    { __typename?: 'Topic' }
    & Pick<Topic, 'id' | 'title' | 'content' | 'nodeId'>
    & { author: (
      { __typename?: 'TopicAuthor' }
      & Pick<TopicAuthor, 'id'>
    ) }
  ) }
);

export type TopicsQueryVariables = Exact<{
  page: Scalars['Int'];
}>;


export type TopicsQuery = (
  { __typename?: 'Query' }
  & { topics: (
    { __typename?: 'TopicsConnection' }
    & Pick<TopicsConnection, 'hasNext'>
    & { items: Array<(
      { __typename?: 'Topic' }
      & Pick<Topic, 'id' | 'createdAt' | 'title' | 'commentsCount' | 'likesCount' | 'url' | 'domain'>
      & { node: (
        { __typename?: 'Node' }
        & Pick<Node, 'id' | 'slug' | 'name'>
      ), author: (
        { __typename?: 'TopicAuthor' }
        & Pick<TopicAuthor, 'id' | 'username' | 'avatar'>
      ) }
    )> }
  ) }
);

export type UpdateTopicMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  nodeId?: Maybe<Scalars['Int']>;
}>;


export type UpdateTopicMutation = (
  { __typename?: 'Mutation' }
  & { updateTopic: (
    { __typename?: 'Topic' }
    & Pick<Topic, 'id'>
  ) }
);


export const CommentsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"comments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"topicId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"html"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLiked"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"html"}}]}}]}}]}}]}}]};

export function useCommentsQuery(options: Omit<Urql.UseQueryArgs<CommentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CommentsQuery>({ query: CommentsDocument, ...options });
};
export const CreateCommentDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"topicId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"html"}}]}}]}}]};

export function useCreateCommentMutation() {
  return Urql.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument);
};
export const CreateNodeDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createNode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]};

export function useCreateNodeMutation() {
  return Urql.useMutation<CreateNodeMutation, CreateNodeMutationVariables>(CreateNodeDocument);
};
export const CreateTopicDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTopic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTopic"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"nodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]};

export function useCreateTopicMutation() {
  return Urql.useMutation<CreateTopicMutation, CreateTopicMutationVariables>(CreateTopicDocument);
};
export const LikeCommentDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"likeComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likeComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}]}]}}]};

export function useLikeCommentMutation() {
  return Urql.useMutation<LikeCommentMutation, LikeCommentMutationVariables>(LikeCommentDocument);
};
export const LikeTopicDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"likeTopic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likeTopic"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"topicId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}}}]}]}}]};

export function useLikeTopicMutation() {
  return Urql.useMutation<LikeTopicMutation, LikeTopicMutationVariables>(LikeTopicDocument);
};
export const MarkAllNotificationsAsReadDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"markAllNotificationsAsRead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markAllNotificationsAsRead"}}]}}]};

export function useMarkAllNotificationsAsReadMutation() {
  return Urql.useMutation<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>(MarkAllNotificationsAsReadDocument);
};
export const NodesForNewTopicDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nodesForNewTopic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]};

export function useNodesForNewTopicQuery(options: Omit<Urql.UseQueryArgs<NodesForNewTopicQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NodesForNewTopicQuery>({ query: NodesForNewTopicDocument, ...options });
};
export const NotificationsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommentReplyData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"replyComment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"html"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TopicCommentData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"html"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}}]}}]}}]}}]}}]}}]}}]};

export function useNotificationsQuery(options: Omit<Urql.UseQueryArgs<NotificationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NotificationsQuery>({ query: NotificationsDocument, ...options });
};
export const NotificationsCountDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notificationsCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationsCount"}}]}}]};

export function useNotificationsCountQuery(options: Omit<Urql.UseQueryArgs<NotificationsCountQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NotificationsCountQuery>({ query: NotificationsCountDocument, ...options });
};
export const TopicDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"topic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topicById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"html"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLiked"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]};

export function useTopicQuery(options: Omit<Urql.UseQueryArgs<TopicQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TopicQuery>({ query: TopicDocument, ...options });
};
export const TopicForEditDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"topicForEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topicById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]};

export function useTopicForEditQuery(options: Omit<Urql.UseQueryArgs<TopicForEditQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TopicForEditQuery>({ query: TopicForEditDocument, ...options });
};
export const TopicsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"topics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNext"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"commentsCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]};

export function useTopicsQuery(options: Omit<Urql.UseQueryArgs<TopicsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TopicsQuery>({ query: TopicsDocument, ...options });
};
export const UpdateTopicDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTopic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTopic"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"nodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]};

export function useUpdateTopicMutation() {
  return Urql.useMutation<UpdateTopicMutation, UpdateTopicMutationVariables>(UpdateTopicDocument);
};