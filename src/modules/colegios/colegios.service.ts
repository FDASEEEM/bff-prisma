import { Injectable } from '@nestjs/common';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

@Injectable()
export class ColegiosService {
  constructor(private readonly client: MicroserviceClient) {}

  // Proxy methods
  async findAll(query: any, authToken: string) {
    return this.client.get('users', '/api/superadmin/colegios', { params: query, authToken });
  }

  async findOne(id: string, authToken: string) {
    return this.client.get('users', `/api/superadmin/colegios/${id}`, { authToken });
  }

  async create(data: any, authToken: string) {
    return this.client.post('users', '/api/superadmin/colegios', data, { authToken });
  }

  async update(id: string, data: any, authToken: string) {
    return this.client.patch('users', `/api/superadmin/colegios/${id}`, data, { authToken });
  }

  async deactivate(id: string, authToken: string) {
    return this.client.delete('users', `/api/superadmin/colegios/${id}`, { authToken });
  }

  async getStats(id: string, authToken: string) {
    return this.client.get('users', `/api/superadmin/colegios/${id}/stats`, { authToken });
  }

  async getProfessors(id: string, query: any, authToken: string) {
    return this.client.get('users', `/api/superadmin/colegios/${id}/professors`, { params: query, authToken });
  }

  async getAdmins(id: string, authToken: string) {
    return this.client.get('users', `/api/superadmin/colegios/${id}/admins`, { authToken });
  }
}
