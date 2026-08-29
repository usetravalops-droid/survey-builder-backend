import { prisma } from "../../lib/prisma.js";

export class AuthRepository {

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  
  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }


  async createUser(
    email: string,
    passwordHash: string,
  ) {
    return prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });
  }


  async verifyEmail(id: string) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        emailVerified: true,
      },
    });
  }

 
  async updateVersion(id: string) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
      select: {
        id: true,
        email: true,
        tokenVersion: true,
      },
    });
  }

  async getTokenVersion(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        tokenVersion: true,
      },
    });
  }
}