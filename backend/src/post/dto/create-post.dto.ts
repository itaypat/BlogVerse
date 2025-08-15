import { IsBoolean, IsDateString, IsNumber, IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    title : string;
    
    @IsString()
    content : string;

    @IsBoolean()
    isPublished : boolean;

    @IsNumber()
    authorId : number;
    
    @IsDateString()
    date : string;
}
