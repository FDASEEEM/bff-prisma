import { Injectable } from '@nestjs/common';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

@Injectable()
export class AdminService {
  constructor(private readonly client: MicroserviceClient) {}

  async getDashboardSummary(authToken: string) {
    return this.client.get('adminpanel', '/api/admin/dashboard/summary', { authToken });
  }

  async getMe(authToken: string) {
    return this.client.get('adminpanel', '/api/admin/me', { authToken });
  }

  // Tickets
  async getTickets(query: any, authToken: string) {
    return this.client.get('adminpanel', '/api/admin/tickets', { params: query, authToken });
  }

  async getTicket(id: string, authToken: string) {
    return this.client.get('adminpanel', `/api/admin/tickets/${id}`, { authToken });
  }

  async getTicketsByRequester(requesterId: string, authToken: string) {
    return this.client.get('adminpanel', `/api/admin/tickets/by-requester/${requesterId}`, { authToken });
  }

  async createTicket(data: any, authToken: string) {
    return this.client.post('adminpanel', '/api/admin/tickets', data, { authToken });
  }

  async updateTicket(id: string, data: any, authToken: string) {
    return this.client.patch('adminpanel', `/api/admin/tickets/${id}`, data, { authToken });
  }

  async deleteTicket(id: string, authToken: string) {
    return this.client.delete('adminpanel', `/api/admin/tickets/${id}`, { authToken });
  }

  // Resources
  async getResources(query: any, authToken: string) {
    return this.client.get('adminpanel', '/api/admin/resources', { params: query, authToken });
  }

  async createResource(data: any, authToken: string) {
    return this.client.post('adminpanel', '/api/admin/resources', data, { authToken });
  }

  async updateResource(id: string, data: any, authToken: string) {
    return this.client.patch('adminpanel', `/api/admin/resources/${id}`, data, { authToken });
  }

  async deleteResource(id: string, authToken: string) {
    return this.client.delete('adminpanel', `/api/admin/resources/${id}`, { authToken });
  }

  // Announcements
  async getAnnouncements(query: any, authToken: string) {
    return this.client.get('adminpanel', '/api/admin/announcements', { params: query, authToken });
  }

  async getActiveAnnouncements(authToken: string) {
    return this.client.get('adminpanel', '/api/admin/announcements/active', { authToken });
  }

  async createAnnouncement(data: any, authToken: string) {
    return this.client.post('adminpanel', '/api/admin/announcements', data, { authToken });
  }

  async updateAnnouncement(id: string, data: any, authToken: string) {
    return this.client.patch('adminpanel', `/api/admin/announcements/${id}`, data, { authToken });
  }

  async deleteAnnouncement(id: string, authToken: string) {
    return this.client.delete('adminpanel', `/api/admin/announcements/${id}`, { authToken });
  }

  // Audit Logs
  async getAuditLogs(query: any, authToken: string) {
    return this.client.get('adminpanel', '/api/admin/audit-logs', { params: query, authToken });
  }

  // Sessions
  async getActiveSessions(authToken: string) {
    return this.client.get('adminpanel', '/api/admin/sessions/active', { authToken });
  }

  async getHistoricalSessions(authToken: string) {
    return this.client.get('adminpanel', '/api/admin/sessions/historical', { authToken });
  }

  async getBlockedSessions(authToken: string) {
    return this.client.get('adminpanel', '/api/admin/sessions/blocked', { authToken });
  }

  async getSessionsByUser(userId: string, authToken: string) {
    return this.client.get('adminpanel', `/api/admin/sessions/user/${userId}`, { authToken });
  }

  async blockSession(id: string, authToken: string) {
    return this.client.put('adminpanel', `/api/admin/sessions/${id}/block`, undefined, { authToken });
  }

  async unblockSession(id: string, authToken: string) {
    return this.client.put('adminpanel', `/api/admin/sessions/${id}/unblock`, undefined, { authToken });
  }

  async terminateSession(id: string, authToken: string) {
    return this.client.put('adminpanel', `/api/admin/sessions/${id}/terminate`, undefined, { authToken });
  }

  // Notifications
  async getNotifications(userId: string, authToken: string) {
    return this.client.get('adminpanel', `/api/admin/notifications?userId=${userId}`, { authToken });
  }

  async getUnreadNotifications(userId: string, authToken: string) {
    return this.client.get('adminpanel', `/api/admin/notifications/unread?userId=${userId}`, { authToken });
  }

  async markNotificationRead(id: string, authToken: string) {
    return this.client.patch('adminpanel', `/api/admin/notifications/${id}/read`, undefined, { authToken });
  }

  // Users
  async getUsers(authToken: string) {
    return this.client.get('users', '/api/admin/users', { authToken });
  }

  async createUser(data: any, authToken: string) {
    return this.client.post('users', '/api/admin/users', data, { authToken });
  }

  async updateUserRole(id: string, data: any, authToken: string) {
    return this.client.patch('users', `/api/admin/users/${id}/role`, data, { authToken });
  }

  async getUsersStats(authToken: string) {
    return this.client.get('users', '/api/admin/users/stats', { authToken });
  }

  // Colegio Stats
  async getColegioProfessorsStats(colegioId: string, authToken: string) {
    return this.client.get('adminpanel', `/api/admin/colegio-stats/${colegioId}/professors`, { authToken });
  }

  async getColegioConsumoStats(colegioId: string, authToken: string) {
    return this.client.get('adminpanel', `/api/admin/colegio-stats/${colegioId}/consumo`, { authToken });
  }

  async getColegioFullStats(colegioId: string, authToken: string) {
    return this.client.get('adminpanel', `/api/admin/colegio-stats/${colegioId}/full`, { authToken });
  }
}
