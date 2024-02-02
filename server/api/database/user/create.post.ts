import { PrismaClient, Prisma } from 'prisma/prisma-client';
import { type SupabaseUserSignUp } from '~/stores/userStore';

export default defineEventHandler(async (event) => {
  // create the prisma client
  const prisma = new PrismaClient();
  // get the user details out from the body
  const userDetails: SupabaseUserSignUp = await readBody(event);

  if (!userDetails.uid || !userDetails.email)
    throw createError({ statusCode: 400, message: 'Bad Request' });

  await prisma.user.create({
    data: {
      uid: userDetails.uid,
      email: userDetails.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
});
