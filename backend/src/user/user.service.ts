import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from '../auth/dto/create-user.dto';
import { hash } from 'bcrypt';
import ApiResponse from 'src/utils/api.response';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async getAllUsers(){
    try{
      const users = await this.prisma.user.findMany({
        where: {
          role: {
            not: "ADMIN"
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role:true,
          assignedPatients: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })

      return ApiResponse.success("Successfully Retrieved All users", users, 200)
    }catch(error){
      return ApiResponse.fail("Internal Server Error", error?.message, 500)
    }
  }
}
