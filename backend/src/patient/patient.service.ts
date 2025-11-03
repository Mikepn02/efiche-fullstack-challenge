import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import ApiResponse from 'src/utils/api.response';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PatientService {


    constructor(private readonly prisma: PrismaService) { }

    async createPatient(dto: CreatePatientDto) {
        try {
            const patient = await this.prisma.patient.create({
                data: {...dto, dateOfBirth: new Date(dto.dateOfBirth)}
            })

            return ApiResponse.success("Successfully Created Patient", patient, 200);
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }

    async getAllPatients() {
        try {
            const patients = await this.prisma.patient.findMany({
                include: {
                    assignedTo: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
            return ApiResponse.success("Successfully Retrieved All Patients", patients, 200);
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }

    async getPatientById(patientId: string){
        try{
            const patient = await this.prisma.patient.findUnique({
                where: {
                    id: patientId
                }
            })
            return ApiResponse.success("Successfully Retrieved Patient", patient, 200);
        }catch(error){
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }


    async getPatientAssignedTo(assignedToId: string){
        try{
            const patients = await this.prisma.patient.findMany({
                where: {
                    assignedToId
                },
            })
            return ApiResponse.success("Successfully Retrieved Patients", patients, 200);
        }catch(error){
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }
}
