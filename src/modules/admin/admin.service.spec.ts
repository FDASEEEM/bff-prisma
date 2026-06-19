import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

describe('AdminService', () => {
  let service: AdminService;
  let client: jest.Mocked<MicroserviceClient>;
  const authToken = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: MicroserviceClient,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    client = module.get(MicroserviceClient) as jest.Mocked<MicroserviceClient>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getDashboardSummary should call client.get', async () => {
    client.get.mockResolvedValue({ ok: true });
    await service.getDashboardSummary(authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/dashboard/summary', { authToken });
  });

  it('getMe should call client.get', async () => {
    client.get.mockResolvedValue({ id: '1' });
    await service.getMe(authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/me', { authToken });
  });

  it('getTickets should call client.get with query', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getTickets({ page: '1' }, authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/tickets', { params: { page: '1' }, authToken });
  });

  it('getTicket should call client.get with id', async () => {
    client.get.mockResolvedValue({ id: 't1' });
    await service.getTicket('t1', authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/tickets/t1', { authToken });
  });

  it('getTicketsByRequester should call client.get with requesterId', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getTicketsByRequester('req1', authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/tickets/by-requester/req1', { authToken });
  });

  it('createTicket should call client.post with data', async () => {
    const data = { title: 'Test' };
    client.post.mockResolvedValue({ id: 't1' });
    await service.createTicket(data, authToken);
    expect(client.post).toHaveBeenCalledWith('adminpanel', '/api/admin/tickets', data, { authToken });
  });

  it('updateTicket should call client.patch with id and data', async () => {
    const data = { title: 'Updated' };
    client.patch.mockResolvedValue({ updated: true });
    await service.updateTicket('t1', data, authToken);
    expect(client.patch).toHaveBeenCalledWith('adminpanel', '/api/admin/tickets/t1', data, { authToken });
  });

  it('deleteTicket should call client.delete with id', async () => {
    client.delete.mockResolvedValue({ deleted: true });
    await service.deleteTicket('t1', authToken);
    expect(client.delete).toHaveBeenCalledWith('adminpanel', '/api/admin/tickets/t1', { authToken });
  });

  it('getResources should call client.get with query', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getResources({ page: '1' }, authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/resources', { params: { page: '1' }, authToken });
  });

  it('createResource should call client.post with data', async () => {
    const data = { name: 'Resource' };
    client.post.mockResolvedValue({ id: 'r1' });
    await service.createResource(data, authToken);
    expect(client.post).toHaveBeenCalledWith('adminpanel', '/api/admin/resources', data, { authToken });
  });

  it('updateResource should call client.patch with id and data', async () => {
    const data = { name: 'Updated' };
    client.patch.mockResolvedValue({ updated: true });
    await service.updateResource('r1', data, authToken);
    expect(client.patch).toHaveBeenCalledWith('adminpanel', '/api/admin/resources/r1', data, { authToken });
  });

  it('deleteResource should call client.delete with id', async () => {
    client.delete.mockResolvedValue({ deleted: true });
    await service.deleteResource('r1', authToken);
    expect(client.delete).toHaveBeenCalledWith('adminpanel', '/api/admin/resources/r1', { authToken });
  });

  it('getAnnouncements should call client.get with query', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getAnnouncements({ page: '1' }, authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/announcements', { params: { page: '1' }, authToken });
  });

  it('getActiveAnnouncements should call client.get', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getActiveAnnouncements(authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/announcements/active', { authToken });
  });

  it('createAnnouncement should call client.post with data', async () => {
    const data = { title: 'Announcement' };
    client.post.mockResolvedValue({ id: 'a1' });
    await service.createAnnouncement(data, authToken);
    expect(client.post).toHaveBeenCalledWith('adminpanel', '/api/admin/announcements', data, { authToken });
  });

  it('updateAnnouncement should call client.patch with id and data', async () => {
    const data = { title: 'Updated' };
    client.patch.mockResolvedValue({ updated: true });
    await service.updateAnnouncement('a1', data, authToken);
    expect(client.patch).toHaveBeenCalledWith('adminpanel', '/api/admin/announcements/a1', data, { authToken });
  });

  it('deleteAnnouncement should call client.delete with id', async () => {
    client.delete.mockResolvedValue({ deleted: true });
    await service.deleteAnnouncement('a1', authToken);
    expect(client.delete).toHaveBeenCalledWith('adminpanel', '/api/admin/announcements/a1', { authToken });
  });

  it('getAuditLogs should call client.get with query', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getAuditLogs({ page: '1' }, authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/audit-logs', { params: { page: '1' }, authToken });
  });

  it('getActiveSessions should call client.get', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getActiveSessions(authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/sessions/active', { authToken });
  });

  it('getHistoricalSessions should call client.get', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getHistoricalSessions(authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/sessions/historical', { authToken });
  });

  it('getBlockedSessions should call client.get', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getBlockedSessions(authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/sessions/blocked', { authToken });
  });

  it('getSessionsByUser should call client.get with userId', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getSessionsByUser('u1', authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/sessions/user/u1', { authToken });
  });

  it('blockSession should call client.put with id', async () => {
    client.put.mockResolvedValue({ blocked: true });
    await service.blockSession('s1', authToken);
    expect(client.put).toHaveBeenCalledWith('adminpanel', '/api/admin/sessions/s1/block', undefined, { authToken });
  });

  it('unblockSession should call client.put with id', async () => {
    client.put.mockResolvedValue({ blocked: false });
    await service.unblockSession('s1', authToken);
    expect(client.put).toHaveBeenCalledWith('adminpanel', '/api/admin/sessions/s1/unblock', undefined, { authToken });
  });

  it('terminateSession should call client.put with id', async () => {
    client.put.mockResolvedValue({ terminated: true });
    await service.terminateSession('s1', authToken);
    expect(client.put).toHaveBeenCalledWith('adminpanel', '/api/admin/sessions/s1/terminate', undefined, { authToken });
  });

  it('getNotifications should call client.get with userId', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getNotifications('u1', authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/notifications?userId=u1', { authToken });
  });

  it('getUnreadNotifications should call client.get with userId', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getUnreadNotifications('u1', authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/notifications/unread?userId=u1', { authToken });
  });

  it('markNotificationRead should call client.patch with id', async () => {
    client.patch.mockResolvedValue({ read: true });
    await service.markNotificationRead('n1', authToken);
    expect(client.patch).toHaveBeenCalledWith('adminpanel', '/api/admin/notifications/n1/read', undefined, { authToken });
  });

  it('getUsers should call client.get', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getUsers(authToken);
    expect(client.get).toHaveBeenCalledWith('users', '/api/admin/users', { authToken });
  });

  it('createUser should call client.post with data', async () => {
    const data = { email: 'test@test.com' };
    client.post.mockResolvedValue({ id: 'u1' });
    await service.createUser(data, authToken);
    expect(client.post).toHaveBeenCalledWith('users', '/api/admin/users', data, { authToken });
  });

  it('updateUserRole should call client.patch with id and data', async () => {
    const data = { role: 'admin' };
    client.patch.mockResolvedValue({ updated: true });
    await service.updateUserRole('u1', data, authToken);
    expect(client.patch).toHaveBeenCalledWith('users', '/api/admin/users/u1/role', data, { authToken });
  });

  it('setUserActive should call client.patch with id and data', async () => {
    const data = { active: false };
    client.patch.mockResolvedValue({ updated: true });
    await service.setUserActive('u1', data, authToken);
    expect(client.patch).toHaveBeenCalledWith('users', '/api/admin/users/u1/active', data, { authToken });
  });

  it('resetUserPassword should call client.post with id and data', async () => {
    const data = { newPassword: 'newpass' };
    client.post.mockResolvedValue({ ok: true });
    await service.resetUserPassword('u1', data, authToken);
    expect(client.post).toHaveBeenCalledWith('users', '/api/admin/users/u1/reset-password', data, { authToken });
  });

  it('getUsersStats should call client.get', async () => {
    client.get.mockResolvedValue({ total: 10 });
    await service.getUsersStats(authToken);
    expect(client.get).toHaveBeenCalledWith('users', '/api/admin/users/stats', { authToken });
  });

  it('getColegioProfessorsStats should call client.get with colegioId', async () => {
    client.get.mockResolvedValue({ total: 5 });
    await service.getColegioProfessorsStats('c1', authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/colegio-stats/c1/professors', { authToken });
  });

  it('getColegioConsumoStats should call client.get with colegioId', async () => {
    client.get.mockResolvedValue({ total: 5 });
    await service.getColegioConsumoStats('c1', authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/colegio-stats/c1/consumo', { authToken });
  });

  it('getColegioFullStats should call client.get with colegioId', async () => {
    client.get.mockResolvedValue({ total: 5 });
    await service.getColegioFullStats('c1', authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/colegio-stats/c1/full', { authToken });
  });
});
