import { PickType } from "@nestjs/mapped-types";
import { PostEntity } from "../entities/post.entity";

export class CreatePostDto extends PickType(PostEntity,[
    'title',
    'slug',
    'summary',
    'content',
    'category',
    'tags',
    'status',
    'visibility',
    'coverImageUrl'
]) {}
