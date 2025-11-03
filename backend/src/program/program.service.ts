import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import ApiResponse from 'src/utils/api.response';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramService {

    constructor(private readonly prisma: PrismaService){}

    async createProgram(dto: CreateProgramDto){
        try{
            const program = await this.prisma.program.create({
                data: {
                    ...dto
                }
            })
            return ApiResponse.success("Successfully created program: ", program, 201)
        }catch(error){
            return ApiResponse.fail("Internal server error", error?.message, 500)
        }
    }

    async updateProgram(programId: string,dto: UpdateProgramDto){
        try{
            const program = await this.prisma.program.findUnique({
                where: {
                    id: programId
                }
            });

            if(!program) return ApiResponse.fail("Program Not Found!", 404);

            const updateData = Object.fromEntries(
                Object.entries(dto).filter(([_, value]) => value !== undefined && value !== null)
            )

            const updatedProgram = await this.prisma.program.update({
                where: {
                    id: program.id
                },
                data: updateData
            })

            return ApiResponse.success("Successfully updated program", updatedProgram , 200)
        }catch(error){
            return ApiResponse.fail("Internal Server error", error?.message, 500)
        }
    }

    async getAllPrograms(){
        try{
            const programs = await this.prisma.program.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            return ApiResponse.success("Successfully retrieved programs", programs , 200)
        }catch(error){
             return ApiResponse.fail("Internal Server error", error?.message, 500)
        }
    }


    async getProgramById(programId: string){
        try{
            const program = await this.prisma.program.findUnique({
                where: {
                    id: programId
                }
            });

            if(!program){
                return ApiResponse.fail(`Program with ID:  ${programId} Not Found`, 404);
            }
            return ApiResponse.success("Successfully Retrieved Program",program , 200);
        }catch(error){
            return ApiResponse.fail("Internal Server Error", error?.message , 500)
        }
    }

    async getUpcomingPrograms(){
        try{
            const now = new Date();

            const programs = await this.prisma.program.findMany({
                where: {
                    OR: [
                        { startDate: { gte: now } },
                        { endDate: { gte: now } }
                    ],
                },
                orderBy: {
                    startDate: 'asc'
                }
            });

            return ApiResponse.success('Successfully retrieved upcoming programs', programs, 200);
        }catch(error){
            return ApiResponse.fail("Internal Server Error", error?.message, 500);
        }
    }
}
