export type selectedArticle = {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  author: { 
    profile: { 
      name: string | null 
    } | null
  };
  favoritedBy: {
    id: number;
    userId: number;
    articleId: number;
  }[];
  tags: {
    articleId: number;
    tagId: number;
    tag: { id: number; name: string };
  }[];
};


export type createdArticle = {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  tags: {
  articleId: number;
  tagId: number;
  tag: {
  id: number;
  name: string;
  };
  }[];
};
  