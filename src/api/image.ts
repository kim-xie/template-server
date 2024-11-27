import instance from './request';
import * as FormData from 'form-data';
import { gateApi, gate } from './config';
// 上传图片
export function uploadImg(file) {
  const formData = new FormData();
  formData.append('file', file.buffer, file.originalname);
  return new Promise((resolve, reject) => {
    instance
      .post(
        `${gate}/cube-data/v1/alioss/upload/nykj/resources?prefix=material/material`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(({ data }) => {
        if (data?.result_code === 1) {
          resolve({
            url: data?.data?.url,
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// 上传数据
export function uploadData(sendData) {
  return new Promise((resolve, reject) => {
    instance
      .post(
        `${gateApi}/advert-api-inside/v1/advert/save_doctor_img`,
        sendData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({ data }) => {
        if (data?.result_code === 1) {
          resolve(true);
        }
        reject(data?.error_msg);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
