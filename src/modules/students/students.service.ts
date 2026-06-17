import { Injectable } from '@nestjs/common';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

@Injectable()
export class StudentsService {
  constructor(private readonly client: MicroserviceClient) {}

  async findAll(authToken: string) {
    return this.client.get('perfil', '/students', { authToken });
  }

  async findOne(id: string, authToken: string) {
    return this.client.get('perfil', `/students/${id}`, { authToken });
  }

  async create(data: any, authToken: string) {
    return this.client.post('perfil', '/students', data, { authToken });
  }

  async update(id: string, data: any, authToken: string) {
    return this.client.patch('perfil', `/students/${id}`, data, { authToken });
  }

  async delete(id: string, authToken: string) {
    return this.client.delete('perfil', `/students/${id}`, { authToken });
  }

  async findMe(authToken: string) {
    return this.client.get('perfil', '/students/me', { authToken });
  }

  async findPaciProfiles(query: any, authToken: string) {
    return this.client.get('perfil', '/paci-profiles', { params: query, authToken });
  }

  async createPaciProfile(data: any, authToken: string) {
    return this.client.post('perfil', '/paci-profiles', data, { authToken });
  }

  async getPaciProfile(id: string, authToken: string) {
    return this.client.get('perfil', `/paci-profiles/${id}`, { authToken });
  }

  async updatePaciProfile(id: string, data: any, authToken: string) {
    return this.client.patch('perfil', `/paci-profiles/${id}`, data, { authToken });
  }

  async deletePaciProfile(id: string, authToken: string) {
    return this.client.delete('perfil', `/paci-profiles/${id}`, { authToken });
  }
}
