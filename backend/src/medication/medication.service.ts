import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AssignMedicationDto } from './dto/assign-medication.dto';
import ApiResponse from 'src/utils/api.response';
import { CollectMedicationDto } from './dto/collect-medication.dto';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, endOfWeek, startOfWeek } from 'date-fns';
import { CreateMedicationDto } from './dto/create-medication.dto';

@Injectable()
export class MedicationService {


    constructor(private readonly prisma: PrismaService) { }

    async createMedication(dto: CreateMedicationDto) {
        try {
            const existing = await this.prisma.medication.findFirst({
                where: { name: dto.name },
            });

            if (existing) {
                throw new BadRequestException('Medication with this name already exists');
            }

            const medication = await this.prisma.medication.create({
                data: { ...dto },
            });

            return ApiResponse.success('Medication created successfully', medication, 201);
        } catch (error) {
            return ApiResponse.fail('Internal Server Error', error?.message, 500);
        }
    }
    async createManyMedications(dtos: CreateMedicationDto[]) {
        try {
           
            const names = dtos.map(d => d.name);
            const existing = await this.prisma.medication.findMany({
                where: { name: { in: names } },
            });

            const existingNames = existing.map(m => m.name);
            const newMedications = dtos.filter(d => !existingNames.includes(d.name));

            if (newMedications.length === 0) {
                return ApiResponse.fail('All medications already exist', null, 409);
            }

            const created = await this.prisma.medication.createMany({
                data: newMedications,
                skipDuplicates: true,
            });

            return ApiResponse.success(
                'Medications created successfully',
                { count: created.count, created: newMedications },
                201,
            );
        } catch (error) {
            return ApiResponse.fail('Internal Server Error', error?.message, 500);
        }
    }


    async getAllMedications() {
        try {
            const medications = await this.prisma.medication.findMany();
            return ApiResponse.success('Medication retrieved successfully', medications, 200);
        } catch (error) {
            return ApiResponse.fail('Internal Server Error', error?.message, 500);
        }
    }

    async prescribePatient(dto: AssignMedicationDto) {
        try {
            const existingPrescription = await this.prisma.prescription.findFirst({
                where: {
                    medicationId: dto.medicationId,
                    patientId: dto.patientId
                }
            })


            if (existingPrescription) {
                return ApiResponse.fail('This medication has already been prescribed to the patient',409);
            }

            const prescription = await this.prisma.prescription.create({
                data: { ...dto }
            })

            return ApiResponse.success("Successfully prescribed patient", prescription, 201);
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }


    async listAllPrescriptions() {
        try {
            const prescriptions = await this.prisma.prescription.findMany({
                include: {
                    patient: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    },
                    medication: {
                        select: {
                            name: true,
                        }
                    }
                }
            })
            return ApiResponse.success("Successfully retrieved all prescriptions", prescriptions, 200);
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }


    async recordDispensing(dto: CollectMedicationDto) {
        try {
            const prescription = await this.prisma.prescription.findUnique({
                where: {
                    id: dto.assignmentId
                }
            })

            if (!prescription) {
                return ApiResponse.fail('Prescription record not found', 404);
            }

            const now = new Date();

            const query = {
                assignmentId: dto.assignmentId,
                patientId: dto.patientId,
            };

            if (prescription.frequency === "DAILY") {
                query['collectedAt'] = {
                    gte: startOfDay(now),
                    lte: endOfDay(now),
                }
            }

            if (prescription.frequency === "WEEKLY") {
                query['collectedAt'] = {
                    gte: startOfWeek(now),
                    lte: endOfWeek(now),
                }
            }
            if (prescription.frequency === "MONTHLY") {
                query['collectedAt'] = {
                    gte: startOfMonth(now),
                    lte: endOfMonth(now),
                }
            }

            const alreadyDispensed = await this.prisma.dispenseRecord.findFirst({ where: query })

            if (alreadyDispensed) {
                return ApiResponse.fail(
                    `Medication has already been collected for this ${prescription.frequency.toLowerCase()} period`,
                    409
                );
            }

            const dispenseRecord = await this.prisma.dispenseRecord.create({
                data: { ...dto }
            })

            return ApiResponse.success("Dispense Medication Recorded Successfully", dispenseRecord, 201);

        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }

    async listDispingHistory() {
        try {
            const history = await this.prisma.dispenseRecord.findMany({
                include: { patient: true, assignment: true },
            });
            return ApiResponse.success("Dispense Records Retrieved successfully!", history, 200)
        } catch (error) {
            return ApiResponse.fail("Internal Server Error", error?.message, 500)
        }
    }



}
