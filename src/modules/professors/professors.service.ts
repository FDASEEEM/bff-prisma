import { Injectable } from '@nestjs/common';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

@Injectable()
export class ProfessorsService {
  constructor(private readonly client: MicroserviceClient) {}

  async findAll(query: any, authToken: string) {
    return this.client.get('adminpanel', '/api/admin/professors', { params: query, authToken });
  }

  async findOne(id: string, authToken: string) {
    return this.client.get('adminpanel', `/api/admin/professors/${id}`, { authToken });
  }

  async create(data: any, authToken: string) {
    return this.client.post('adminpanel', '/api/admin/professors', data, { authToken });
  }

  async update(id: string, data: any, authToken: string) {
    return this.client.patch('adminpanel', `/api/admin/professors/${id}`, data, { authToken });
  }

  async delete(id: string, authToken: string) {
    return this.client.delete('adminpanel', `/api/admin/professors/${id}`, { authToken });
  }
}
