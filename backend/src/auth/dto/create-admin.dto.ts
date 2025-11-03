import { IsString } from "class-validator";
import { RegisterDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";




export default class CreateAdminDto extends RegisterDto {

    @IsString()
    @ApiProperty()
    adminCreateCode: string;
}