import { Injectable } from '@nestjs/common';
import FormData from 'form-data';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

type UploadedFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@Injectable()
export class JobsService {
  constructor(private readonly client: MicroserviceClient) {}

  /**
   * Reenvia la subida de un job PACI (multipart) a ms-docs.
   * Contrato ms-docs `/api/jobs/upload`: prompt (req), paciJson?, paciFile?,
   * planningFile (req) -> ver prisma-ms-docs/src/jobs/jobs.controller.ts.
   */
  async uploadJob(
    body: { prompt?: string; paciJson?: string },
    files: { paciFile?: UploadedFile[]; planningFile?: UploadedFile[] },
    authToken: string,
  ) {
    const form = new FormData();

    if (body?.prompt !== undefined) form.append('prompt', body.prompt);
    if (body?.paciJson !== undefined) form.append('paciJson', body.paciJson);

    const paci = files?.paciFile?.[0];
    if (paci) {
      form.append('paciFile', paci.buffer, {
        filename: paci.originalname,
        contentType: paci.mimetype,
      });
    }

    const planning = files?.planningFile?.[0];
    if (planning) {
      form.append('planningFile', planning.buffer, {
        filename: planning.originalname,
        contentType: planning.mimetype,
      });
    }

    return this.client.postMultipart('docs', '/api/jobs/upload', form, { authToken });
  }

  async findAll(query: any, authToken: string) {
    return this.client.get('docs', '/api/jobs', { params: query, authToken });
  }

  async findOne(id: string, authToken: string) {
    return this.client.get('docs', `/api/jobs/${id}`, { authToken });
  }

  async getHistory(authToken: string) {
    return this.client.get('docs', '/api/jobs/history', { authToken });
  }

  async getDownloadUrl(id: string, authToken: string) {
    return this.client.get('docs', `/api/jobs/${id}/download`, { authToken });
  }

  async getColegioStats(colegioId: string, authToken: string) {
    return this.client.get('docs', `/api/jobs/colegio/${colegioId}/stats`, { authToken });
  }

  async getColegioJobs(colegioId: string, query: any, authToken: string) {
    return this.client.get('docs', `/api/jobs/colegio/${colegioId}/jobs`, { params: query, authToken });
  }
}
