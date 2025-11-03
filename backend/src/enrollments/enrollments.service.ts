import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import ApiResponse from 'src/utils/api.response';

@Injectable()
export class EnrollmentsService {

    constructor(private readonly prisma: PrismaService) { }

    async enrollPatient(userId: string, dto: CreateEnrollmentDto) {
        try {

            const patient = await this.prisma.patient.findUnique({
                where: {
                    id: dto.patientId
                }
            });

            if (!patient) return ApiResponse.fail(`Patient With ID: ${dto.patientId} Not Found`, 404);

            const program = await this.prisma.program.findUnique({
                where: {
                    id: dto.programId
                }
            })
            if (!program) return ApiResponse.fail(`Program with ID: ${dto.programId} Not Found`, 404);



            const existing = await this.prisma.enrollment.findFirst({
                where: {
                    patientId: dto.patientId,
                    programId: dto.programId
                }
            })

            if (existing) {
                return ApiResponse.fail('Patient is already enrolled in this program.', null, 409);
            }

            const enrollment = await this.prisma.enrollment.create({
                data: { ...dto, enrolledAt: new Date(), enrolledById: userId },
                include: {
                    patient: { select: { firstName: true, lastName: true } },
                    program: { select: { name: true } },
                },
            })
            return ApiResponse.success("Successfully enrolled patient", enrollment, 201)
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }


    async getEnrolledPatientsInProgram(programId: string) {
        try {
            const enrollments = await this.prisma.enrollment.findMany({
                where: {
                    programId
                },
                include: {
                    patient: {
                        select: {
                            firstName: true,
                            lastName: true,
                            gender: true,
                            dateOfBirth: true,
                            assignedToId: true,
                        }
                    },
                    program: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                    enrolledBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                }
            })

            return ApiResponse.success(
                'Fetched enrolled patients successfully',
                enrollments,
                200,
            );
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }

    async getAllEnrollments(userId: string) {
        try {
            const enrollments = await this.prisma.enrollment.findMany({
                where: { enrolledById: userId },
                include: {
                    patient: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            gender: true,
                            dateOfBirth: true,
                            assignedToId: true,
                        },
                    },
                    program: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            startDate: true,
                            endDate: true,
                            status: true,
                        },
                    },
                    enrolledBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });

            const detailedEnrollments = await Promise.all(
                enrollments.map(async (enrollment) => {
                    const totalSessions = await this.prisma.programSession.count({
                        where: { programId: enrollment.programId },
                    });

                    const attendedSessions = await this.prisma.sessionAttendance.count({
                        where: {
                            patientId: enrollment.patientId, sessionId: {
                                in: (await this.prisma.programSession.findMany({
                                    where: { programId: enrollment.programId }, select: { id: true }
                                })).map(s => s.id)
                            }, status: 'ATTENDED'
                        },
                    });

                    return {
                        ...enrollment,
                        stats: {
                            totalSessions,
                            attendedSessions,
                            attendanceRate: totalSessions ? (attendedSessions / totalSessions) * 100 : 0,
                        },
                    };
                }),
            );

            return ApiResponse.success(
                'All enrollments fetched successfully',
                detailedEnrollments,
                200
            );
        } catch (error) {
            return ApiResponse.fail('Internal Server Error', error?.message, 500);
        }
    }

}
