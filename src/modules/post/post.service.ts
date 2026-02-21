import { post } from "../../../generated/prisma/client";
import { postWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

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
  tags,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}: {
  search: string | undefined,
  tags: string[] | [],
  page: number,
  limit: number,
  skip: number,
  sortBy: string,
  sortOrder: string 
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
  take: limit,
  skip,
where:andCondition.length > 0 ? { AND: andCondition } : {},
orderBy:{
  [sortBy]: sortOrder
} 

  });

  const total = await prisma.post.count({
where:andCondition.length > 0 ? { AND: andCondition } : {},
  })

  return {
    data: allPost,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total/limit)
    }
  };
}

// getPostById
const getPostById = async (postId: string) => {
return await prisma.$transaction(async(tx)=>{
   await tx.post.update({
    where:{
      id: postId
    },
    data: {
      views: {
        increment: 1
      }
    }
  })
  const postData =  await tx.post.findUnique({
    where: {
      id: postId
    }
  })
  return postData
})
}


export const postService = {
  createPost,
  getAllPost,
  getPostById
}


