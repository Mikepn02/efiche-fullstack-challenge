import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import ApiResponse from 'src/utils/api.response';
import { CreateSessionAttendanceDto } from './dto/create-patient-session.dto';

@Injectable()
export class SessionsService {

    constructor(private readonly prisma: PrismaService) { }

    async createProgramSession(dto: CreateSessionDto) {
        try {


            const program = await this.prisma.program.findUnique({
                where: { id: dto.programId },
            });

            if (!program) {
                return ApiResponse.fail(
                    `Program with ID: ${dto.programId} Not Found`,
                    404
                );
            }

            const sessionDate = new Date(dto.date);
            const programStart = new Date(program.startDate);
            const programEnd = new Date(program.endDate);


            if (sessionDate < programStart || sessionDate > programEnd) {
                return ApiResponse.fail(
                    `Session date must be within program dates (${program.startDate} - ${program.endDate})`,
                    400
                );
            }

            const session = await this.prisma.programSession.create({
                data: dto,
            });

            return ApiResponse.success("Successfully Created Session", session, 201);
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error.message);
        }
    }

    async createProgramSessionsBulk(dtos: CreateSessionDto[]) {
        try {
            if (!dtos || dtos.length === 0) {
                return ApiResponse.fail("No sessions provided", 400);
            }

            // Get unique program IDs
            const programIds = [...new Set(dtos.map(dto => dto.programId))];

            // Fetch programs from DB
            const programs = await this.prisma.program.findMany({
                where: { id: { in: programIds } },
                select: { id: true, startDate: true, endDate: true },
            });

            const existingProgramIds = programs.map((p) => p.id);

            // Check for invalid program IDs
            const invalidIds = programIds.filter((id) => !existingProgramIds.includes(id));
            if (invalidIds.length > 0) {
                return ApiResponse.fail(`Programs not found: ${invalidIds.join(", ")}`, 404);
            }

            // Map programs by ID for easy lookup
            const programMap = programs.reduce((acc, program) => {
                acc[program.id] = program;
                return acc;
            }, {} as Record<string, { startDate: Date; endDate: Date }>);

            // Validate each session date
            const invalidSessions = dtos.filter((dto) => {
                const program = programMap[dto.programId];
                const sessionDate = new Date(dto.date);
                return sessionDate < new Date(program.startDate) || sessionDate > new Date(program.endDate);
            });

            if (invalidSessions.length > 0) {
                const messages = invalidSessions.map(
                    (s) =>
                        `Session for program ${s.programId} with date ${s.date} is out of program range`
                );
                return ApiResponse.fail(messages.join("; "), 400);
            }

            // Create all valid sessions
            const sessions = await this.prisma.programSession.createMany({
                data: dtos,
                skipDuplicates: true,
            });

            return ApiResponse.success("Successfully Created Sessions", sessions, 201);
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error.message);
        }
    }


    async getAllProgramSessions() {
        try {
            const programSessions = await this.prisma.programSession.findMany({})
            return ApiResponse.success("Successfully retrieved program sessions", programSessions, 200)
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error.message);
        }
    }

    async recordAttendance(userId: string, dto: CreateSessionAttendanceDto) {
        try {
            const session = await this.prisma.programSession.findUnique({
                where: {
                    id: dto.sessionId
                }
            });
            if (!session) return ApiResponse.fail(`Session with ID: ${dto.sessionId} Not Found!`, 404);

            const patient = await this.prisma.patient.findUnique({
                where: {
                    id: dto.patientId
                }
            })

            if (!patient) return ApiResponse.fail("Patient not found!", 404);

            const programSession = await this.prisma.programSession.findUnique({
                where: { id: dto.sessionId },
                select: { id: true, programId: true },
            });

            if (!programSession) {
                return ApiResponse.fail('Program session not found', null, 404);
            }

            const enrollment = await this.prisma.enrollment.findFirst({
                where: {
                    patientId: dto.patientId,
                    programId: programSession.programId
                }
            });

            if (!enrollment) {
                return ApiResponse.fail(
                    'Patient is not enrolled in the program for this session',
                    null,
                    400,
                );
            }

            const existingSession = await this.prisma.sessionAttendance.findFirst({
                where: {
                    patientId: dto.patientId,
                    sessionId: dto.sessionId,
                },
            });
            if (existingSession) {
                return ApiResponse.fail('Patient session already exists', null, 409);
            }

            const now = new Date();

            const AttendanceSession = await this.prisma.sessionAttendance.create({
                data: { ...dto, attendedAt: now, attendanceMarkedById: userId }
            })

            return ApiResponse.success("Patient session successfully created", AttendanceSession, 201)
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error.message);
        }
    }

    async cancelSession(sessionId: string, reason: string) {
        try {
            const session = await this.prisma.sessionAttendance.findUnique({
                where: {
                    id: sessionId
                }
            })
            if (!session) return ApiResponse.fail(`Session with ID: ${sessionId} Not Found`, 404);

            const cancelSession = await this.prisma.sessionAttendance.update({
                where: {
                    id: session.id
                },
                data: {
                    status: "CANCELED"
                }
            })

            return ApiResponse.success("Successfully Cancelled Session", cancelSession, 200);
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }


    async getProgramSessions(programId: string) {
        try {

            const sessions = await this.prisma.programSession.findMany({
                where: {
                    programId
                }
            })

            return ApiResponse.success("Successfully Retrieved Program sessions", sessions, 200)
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error.message);
        }
    }

    async getSesssionById(sessionId: string) {
        try {
            const session = await this.prisma.programSession.findUnique({
                where: {
                    id: sessionId
                }
            })
            return ApiResponse.success("Successfully Retrieved Session", session, 200);
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error.message);
        }
    }

    async getPatientAttendedSessions(patientId: string) {
        try {
            const sessions = await this.prisma.sessionAttendance.findMany({
                where: {
                    patientId
                }
            })

            return ApiResponse.success("Patient sessions retrieved successfully", sessions, 200);
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message)
        }
    }

    async getAllSessionAttendance() {
        try {
            const attendances = await this.prisma.sessionAttendance.findMany({
                include: {

                    patient: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    programSession: {
                        select: {
                            date: true,
                            sessionType: true,
                            programs: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },

                    attendanceMarkedBy: {
                        select: {
                            name: true
                        }
                    }


                },
            });


            const formatted = attendances.map(a => ({
                id: a.id,
                sessionStatus: a.status,
                cancelReason: a.cancelReason,
                attendedAt: a.attendedAt,
                patientName: `${a.patient.firstName} ${a.patient.lastName}`,
                programName: a.programSession?.programs?.name ?? null,
                sessionType: a.programSession?.sessionType ?? null,
                schelduredDate: a.programSession?.date ?? null,
                attendanceMarkedBy: a.attendanceMarkedBy?.name ?? null

            }));

            return ApiResponse.success(
                "Retrieved All Session Attendances",
                formatted,
                200
            );

        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message)
        }
    }
}
