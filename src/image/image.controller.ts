import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';

@ApiTags('图片模块')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('docsvipinvite')
  @ApiOperation({ summary: '批量生成 svip 医生邀请函' })
  @ApiResponse({
    status: 200,
    description: '批量生成 svip 医生邀请函成功',
  })
  async generateBatchDocSvipInvite(@Body() docsInfo: any[]) {
    return await this.imageService.generateDocImages({ data: docsInfo });
  }

  @Get('docsvipinvite/:id/:name')
  @ApiOperation({ summary: '生成单个 svip 医生邀请函' })
  @ApiResponse({
    status: 200,
    description: '生成单个 svip 医生邀请函成功',
  })
  async generateDocSvipInvite(
    @Param('id') id: string,
    @Param('name') name: string,
  ) {
    return await this.imageService.generateDocImages({ data: [{ id, name }] });
  }
}
