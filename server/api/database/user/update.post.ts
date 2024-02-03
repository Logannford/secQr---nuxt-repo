import { PrismaClient } from 'prisma/prisma-client';
import { type SupabaseUserSignUp } from '~/stores/userStore';

export default defineEventHandler(async (event) => {
  // new prisma client
  const prisma = new PrismaClient();
  // user details from the body
  const userDetails: SupabaseUserSignUp = await readBody(event);

  // we need the uid in order to update the user
  if (!userDetails.uid)
    throw createError({ statusCode: 400, message: 'User uid not supplied' });

  // get the user that we want to update
  const selectedUser = await prisma.user.findUnique({
    where: {
      uid: userDetails.uid,
    },
  });

  // if the user doesn't exist, throw an error
  if (!selectedUser)
    throw createError({ statusCode: 404, message: 'User not found' });

  // once we know we have the user, we can update their details
  const user = await prisma.user.update({
    where: {
      uid: userDetails.uid,
    },
    data: {
      ...userDetails,
    },
  });

  if (!user)
    throw createError({ statusCode: 500, message: 'User not updated' });
  return user;
});
