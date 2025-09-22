import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import {
  CommentListQueryDto,
  CreateCommentDto,
} from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('post-comments')
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @Post()
  @Auth()
  create(@Body() dto: CreateCommentDto, @GetUser('userId') userId: number) {
    return this.postCommentsService.create(userId, dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postCommentsService.findById(id);
  }

  // Lista top-level o hijos (si pasas parentId)
  @Get()
  listByPost(@Query() query: CommentListQueryDto) {
    return this.postCommentsService.listByPost(query);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostCommentDto,
    @GetUser('userId') userId: number,
  ) {
    return this.postCommentsService.update(id, userId, dto);
  }

  @Delete(':id')
  @Auth()
  delete(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.postCommentsService.delete(id, userId);
  }
}
