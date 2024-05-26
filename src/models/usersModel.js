import prisma from '../prisma.js';

function findUserOrCreate(user,provider) {
  return prisma.users.upsert({
    where: {
      email: user.email,
    },
    update: {},
    create: {
      email: user.email,
      name: user.name,
      password: 'test',
      provider: provider,
      status: 'ACTIVE',
      email_verified_at: new Date(),
    },
  });
}



export default { findUserOrCreate };