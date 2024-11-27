import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import * as TextToSVG from 'text-to-svg';
import * as sharp from 'sharp';
import { uploadImg, uploadData } from '@src/api/image';
/**
 * sharp 是一款高性能图片处理工具
 * 大多数现代 macOS、Windows 和 Linux 系统不需要任何额外的安装或运行时依赖
 * 底层采用了libvips，调整图片大小通常比使用最快的 ImageMagick 和 GraphicsMagick 设置快 4 到 5 倍
 * GitHub：git@github.com:lovell/sharp.git (fork: 1.3k star: 28.9K)
 * 官网：https://sharp.nodejs.cn/
 */

// 自定义字体库
const FZLTHJWFontPath = path.join(__dirname, 'public/fonts/FZLTHJW.ttf');
const FZLTZHJWFontPath = path.join(__dirname, 'public/fonts/FZLTZHJW.ttf');

// 底图
const inputImagePath = path.join(__dirname, 'public/imgs/bg.png');
// 本地图片输出
const outputPathFn = (filename) =>
  path.join(__dirname, `public/imgs/preview-${filename}.png`);

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor() {}
  // 合成开关
  compositing = false;

  // 原始数据
  rawData = [];

  // 上传成功队列
  uploadSuccessArr = [];

  // 上传失败队列
  uploadFailArr = [];

  // 合成成功队列
  compositeSuccessArr = [];

  // 合成失败队列
  compositeFailArr = [];

  // 入库失败队列
  saveFailArr = [];
  // 删除本地文件
  rmFileFn(filePath) {
    fs.unlink(filePath, (err) => {
      if (err) {
        this.logger.error(`${filePath} deleting error:`, err);
        return;
      }
      this.logger.log(`${filePath} deleted successfully`);
    });
  }

  // 文字生成svg
  textToSvgs(text, options, fontFile) {
    const textToSVGs = fontFile
      ? TextToSVG.loadSync(fontFile, fontFile)
      : TextToSVG.loadSync();
    const svgImage = textToSVGs.getSVG(text, options);
    // Parse the SVG to get the bounding box (width)
    const widthMatch = svgImage.match(/width="([\d.]+)"/);
    return {
      svgInput: Buffer.from(svgImage),
      textWidth: widthMatch
        ? +parseFloat(widthMatch[1]).toFixed(0)
        : options?.fontSize,
    };
  }

  // createTextSvgToImg
  createTextSvgToImg(text, options = {}, fontFile = FZLTHJWFontPath) {
    return this.textToSvgs(
      text,
      { x: 0, y: 50, fontSize: 48, attributes: { fill: '#333' }, ...options },
      fontFile,
    );
  }

  // 医生邀请合成
  doctorInvitation(name) {
    const staticSvg1 = this.createTextSvgToImg('尊敬的');
    const dynamicSvg = this.createTextSvgToImg(
      name,
      {
        fontSize: 60,
        attributes: { fill: '#D79200' },
      },
      FZLTZHJWFontPath,
    );
    const staticSvg2 = this.createTextSvgToImg('医生:');
    return [
      {
        input: staticSvg1.svgInput,
        top: 620,
        left: 99,
      },
      {
        input: dynamicSvg.svgInput,
        top: 622,
        left: 99 + 8 + staticSvg1.textWidth,
      },
      {
        input: staticSvg2.svgInput,
        top: 620,
        left: 99 + 8 + staticSvg1.textWidth + dynamicSvg.textWidth + 8,
      },
    ];
  }

  // 图片合成
  compositeImage({ bgImagePath, name, id, needLocalOutput }) {
    return new Promise<void>((resolve, reject) => {
      // 开启合成
      this.compositing = true;
      // 图片合成
      const doctorInfo = this.doctorInvitation(name);
      const finalImage = sharp(bgImagePath).composite(doctorInfo);

      // 输出到本地
      if (needLocalOutput) {
        finalImage.toFile(outputPathFn(id), (err) => {
          if (err) {
            this.logger.error(`${id} composite image Error:`, err);
            return;
          }
          this.logger.error(`${id} composite image Success`);
        });
      }

      // 上传
      finalImage
        .toBuffer()
        .then((buffer) => {
          // 合成成功队列
          this.compositeSuccessArr.push(id);
          // 图片上传
          uploadImg({ buffer, originalname: `${name}.png` })
            .then(({ url }) => {
              this.logger.log(`uploadImg Success: ${id} ${url}`);
              this.uploadSuccessArr.push({
                doctor_id: id,
                doctor_name: name,
                images: url,
              });
              // 结果通知服务端
              uploadData({
                doctor_id: +id,
                images: url,
              })
                .then((data) => {
                  this.logger.log(`saveData success: ${data}`);
                })
                .catch((err) => {
                  this.logger.error(`saveData error: ${err}`);
                  this.saveFailArr.push({
                    doctor_id: id,
                    doctor_name: name,
                    msg: err,
                  });
                })
                .finally(() => {
                  resolve();
                });
            })
            .catch((err) => {
              this.logger.error(`uploadImg Error: ${id} ${err}`);
              this.uploadFailArr.push(id);
              reject(err);
            });
        })
        .catch((err) => {
          this.logger.error(`${id} composite image Error: ${err}`);
          this.compositeFailArr.push(id);
          reject(err);
        });
    });
  }

  // 合成医生邀请函
  async generateDocImages({
    data,
    needLocalOutput = false,
    bgImagePath = inputImagePath,
  }) {
    // 存在合成中的任务不处理新请求
    if (this.compositing) {
      return;
    }

    // 任务重置
    this.rawData = data || [];

    // 上传成功队列
    this.uploadSuccessArr = [];

    // 上传失败队列
    this.uploadFailArr = [];

    // 合成成功队列
    this.compositeSuccessArr = [];

    // 合成失败队列
    this.compositeFailArr = [];

    // 入库失败重置
    this.saveFailArr = [];

    // 时间记录
    const startTime = new Date().getTime();

    // 获取目标图像的元数据
    // const { width, height } = await sharp(bgImagePath).metadata()

    // 任务列表
    const taskList = [];
    this.rawData.forEach(({ id, name }) => {
      const imagePromise = this.compositeImage({
        bgImagePath,
        name,
        id,
        needLocalOutput,
      });
      taskList.push(imagePromise);
    });

    await Promise.all(taskList)
      .catch((err) => {
        this.logger.error(`taskList err: ${err}`);
      })
      .finally(() => {
        const endTime = new Date().getTime();
        this.logger.log(
          `${this.rawData.length} imgs composite spend time: ${((endTime - startTime) / 1000 / 60).toFixed(2)}m`,
        );

        if (
          this.compositeSuccessArr.length + this.compositeFailArr.length ===
          this.rawData.length
        ) {
          // 全部合成完成
          this.logger.log(
            `composite success count: ${this.compositeSuccessArr.length}`,
          );
          this.logger.warn(
            `composite fail count: ${this.compositeFailArr.length}`,
          );

          this.logger.log(
            `upload success count: ${this.uploadSuccessArr.length}`,
          );
          this.logger.warn(`upload fail count: ${this.uploadFailArr.length}`);

          // 本地删掉生成的图片
          if (needLocalOutput) {
            setTimeout(() => {
              this.compositeSuccessArr.forEach((id) => {
                this.rmFileFn(outputPathFn(id));
              });
            }, 1000 * 5);
          }
          // 合成结束
          this.compositing = false;
        }
      });

    return { uploadSuccess: this.uploadSuccessArr, saveFail: this.saveFailArr };
  }
}
