import { post } from "../../generated/prisma/client";
import { postWhereInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

// createPost
const createPost = async (data: Omit<post, "id" | "createdAt" | "updatedAt" | "authorId">, userId: string) => {
  const result = await prisma.post.create({
    data:{
      ...data,
      authorId: userId
    }
  })
  return result;
}


// getPost
const getAllPost = async({
  search,
  tags
}: {
  search: string | undefined,
  tags: string[] | []
}) => {
  const andCondition:postWhereInput[] = [];

  if(search){
    andCondition.push(
      {OR: [
         {title: {
        contains:search as string,
        mode: 'insensitive'
      }
    },
       {content: {
        contains: search as string,
        mode: 'insensitive'
      }
    },

      {
        tags:{
          has: search as string
        }
      }
      ]}
    )
  }

if(tags && tags.length > 0){
  andCondition.push(
    {tags: {
        hasSome:tags
      }}
  )
}

  const allPost = await prisma.post.findMany({
where: andCondition.length > 0 ? { AND: andCondition } : {},

  });
  return allPost;
}




export const postService = {
  createPost,
  getAllPost
}


