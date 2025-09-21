import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class Tag {
    @IsUUID()
    id: string;
  
    @ApiProperty({ example: '#javascript', type: String })
    @IsString()
    @MinLength(8)
    @Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim() : value,
    )
    name: string;
  
    @ApiProperty({ example: 'tags creados para temas relacionados con javascript', type: String })
    @IsString()
    @MinLength(5)
    @Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim() : value,
    )
    description?: string;
  
    @ApiProperty({
      example: '2023-06-15T12:00:00Z',
      type: Date,
      description: 'Fecha de creacion de la categoria',
      required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    createdAt: Date | null;
  
  
    @ApiProperty({
      example: '2023-06-16T12:00:00Z',
      type: Date,
      description: 'Fecha de actualización de la categoria',
    })
    @Type(() => Date)
    updatedAt: Date;
  
    @ApiProperty({
      example: '2023-06-17T12:00:00Z',
      type: Date,
      description: 'Fecha de eliminación (si está borrado)',
      required: false,
    })
  
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    deletedAt: Date | null;


  }
