import { Injectable } from '@nestjs/common';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

@Injectable()
export class JobsService {
  constructor(private readonly client: MicroserviceClient) {}

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
