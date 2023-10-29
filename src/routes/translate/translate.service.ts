import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';
import * as pdf from 'pdf-parse';
import * as fs from 'node:fs';
import { Response } from 'express';

@Injectable()
export class TranslateService {

    private async imageExtractorHandler(path: string) {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(path);
      await worker.terminate();
      return ret.data.text
    }

    private async pdfTExtractorHandler(path: string) {
      const fileData = fs.readFileSync(path);
      return pdf(fileData).then(res => res.text)
    }

    async extractor({pdfFiles, imageFiles}: any, fileName: string) {
        if(fileName.endsWith('.pdf')) {
          const targetFile = pdfFiles.pdf.find((eachObj: any) => {
            if (eachObj.file != null) return eachObj.file.find((eachFile: string) => eachFile.includes(fileName))
          })
          const pdfPath = targetFile.file.find((file: any) => file.includes(fileName))
          const text = await this.pdfTExtractorHandler(pdfPath)
          return text
        }
    
        if(fileName.endsWith('.jpg' || '.jpeg' || '.png')) {
          const targetFile = imageFiles.image.find((eachObj: any) => {
            if (eachObj.file != null) return eachObj.file.find((eachFile: string) => eachFile.includes(fileName))
          })
          const imagePath = targetFile.file.find((file: any) => file.includes(fileName))
          const text = await this.imageExtractorHandler(imagePath)
          return text
        }
    }

    async translator(res: Response, text: string, translateFrom: string, translateTo: string) {
      const http = require('http');

      // When you have your own Client ID and secret, put down their values here:
      const clientId = "FREE_TRIAL_ACCOUNT";
      const clientSecret = "PUBLIC_SECRET";

      // TODO: Specify your translation requirements here:
      const jsonPayload = JSON.stringify({
          fromLang: translateFrom,
          toLang: translateTo,
          text: text
      });

      const options = {
          hostname: "api.whatsmate.net",
          port: 80,
          path: "/v1/translation/translate",
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-WM-CLIENT-ID": clientId,
              "X-WM-CLIENT-SECRET": clientSecret,
              "Content-Length": Buffer.byteLength(jsonPayload)
          }
      };

      const request = new http.ClientRequest(options);
      request.end(jsonPayload);

      request.on('response', function (response: any) {
          response.setEncoding('utf8');
          response.on('data', function (chunk: string) {
            res.send(chunk)
          });
      });
    }
}
