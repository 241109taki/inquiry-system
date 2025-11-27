import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'タイトルは必須です' } )
  @MaxLength(50, { message: 'タイトルは50文字以内で入力してください'} )
  title: string;

  @IsString()
  @IsNotEmpty({ message: '内容は必須です' })
  @MaxLength(1000, { message: '内容は1000文字以内で入力してください' })
  content: string;
}
