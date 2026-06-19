import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: jest.Mocked<AdminService>;
  const authorization = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getDashboardSummary: jest.fn(),
            getMe: jest.fn(),
            getUsersStats: jest.fn(),
            getUsers: jest.fn(),
            createUser: jest.fn(),
            updateUserRole: jest.fn(),
            setUserActive: jest.fn(),
            resetUserPassword: jest.fn(),
            getTickets: jest.fn(),
            getTicketsByRequester: jest.fn(),
            getTicket: jest.fn(),
            createTicket: jest.fn(),
            updateTicket: jest.fn(),
            deleteTicket: jest.fn(),
            getResources: jest.fn(),
            createResource: jest.fn(),
            updateResource: jest.fn(),
            deleteResource: jest.fn(),
            getAnnouncements: jest.fn(),
            getActiveAnnouncements: jest.fn(),
            createAnnouncement: jest.fn(),
            updateAnnouncement: jest.fn(),
            deleteAnnouncement: jest.fn(),
            getAuditLogs: jest.fn(),
            getActiveSessions: jest.fn(),
            getHistoricalSessions: jest.fn(),
            getBlockedSessions: jest.fn(),
            getSessionsByUser: jest.fn(),
            blockSession: jest.fn(),
            unblockSession: jest.fn(),
            terminateSession: jest.fn(),
            getNotifications: jest.fn(),
            getUnreadNotifications: jest.fn(),
            markNotificationRead: jest.fn(),
            getColegioProfessorsStats: jest.fn(),
            getColegioConsumoStats: jest.fn(),
            getColegioFullStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getSummary should delegate to adminService.getDashboardSummary', async () => {
    adminService.getDashboardSummary.mockResolvedValue({ ok: true });
    const result = await controller.getSummary(authorization);
    expect(adminService.getDashboardSummary).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ ok: true });
  });

  it('getMe should delegate to adminService.getMe', async () => {
    adminService.getMe.mockResolvedValue({ id: '1' });
    const result = await controller.getMe(authorization);
    expect(adminService.getMe).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ id: '1' });
  });

  it('getUsersStats should delegate to adminService.getUsersStats', async () => {
    adminService.getUsersStats.mockResolvedValue({ total: 10 });
    const result = await controller.getUsersStats(authorization);
    expect(adminService.getUsersStats).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ total: 10 });
  });

  it('getUsers should delegate to adminService.getUsers', async () => {
    adminService.getUsers.mockResolvedValue({ data: [] });
    const result = await controller.getUsers(authorization);
    expect(adminService.getUsers).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ data: [] });
  });

  it('createUser should delegate to adminService.createUser', async () => {
    const body = { email: 'test@test.com' };
    adminService.createUser.mockResolvedValue({ id: 'u1' });
    const result = await controller.createUser(body, authorization);
    expect(adminService.createUser).toHaveBeenCalledWith(body, authorization);
    expect(result).toEqual({ id: 'u1' });
  });

  it('updateUserRole should delegate to adminService.updateUserRole', async () => {
    const body = { role: 'admin' };
    adminService.updateUserRole.mockResolvedValue({ updated: true });
    const result = await controller.updateUserRole('u1', body, authorization);
    expect(adminService.updateUserRole).toHaveBeenCalledWith('u1', body, authorization);
    expect(result).toEqual({ updated: true });
  });

  it('setUserActive should delegate to adminService.setUserActive', async () => {
    const body = { active: false };
    adminService.setUserActive.mockResolvedValue({ updated: true });
    const result = await controller.setUserActive('u1', body, authorization);
    expect(adminService.setUserActive).toHaveBeenCalledWith('u1', body, authorization);
    expect(result).toEqual({ updated: true });
  });

  it('resetUserPassword should delegate to adminService.resetUserPassword', async () => {
    const body = { newPassword: 'newpass' };
    adminService.resetUserPassword.mockResolvedValue({ ok: true });
    const result = await controller.resetUserPassword('u1', body, authorization);
    expect(adminService.resetUserPassword).toHaveBeenCalledWith('u1', body, authorization);
    expect(result).toEqual({ ok: true });
  });

  it('getTickets should delegate to adminService.getTickets', async () => {
    const query = { page: '1' };
    adminService.getTickets.mockResolvedValue({ data: [] });
    const result = await controller.getTickets(query, authorization);
    expect(adminService.getTickets).toHaveBeenCalledWith(query, authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getTicketsByRequester should delegate to adminService.getTicketsByRequester', async () => {
    adminService.getTicketsByRequester.mockResolvedValue({ data: [] });
    const result = await controller.getTicketsByRequester('req1', authorization);
    expect(adminService.getTicketsByRequester).toHaveBeenCalledWith('req1', authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getTicket should delegate to adminService.getTicket', async () => {
    adminService.getTicket.mockResolvedValue({ id: 't1' });
    const result = await controller.getTicket('t1', authorization);
    expect(adminService.getTicket).toHaveBeenCalledWith('t1', authorization);
    expect(result).toEqual({ id: 't1' });
  });

  it('createTicket should delegate to adminService.createTicket', async () => {
    const body = { title: 'Test' };
    adminService.createTicket.mockResolvedValue({ id: 't1' });
    const result = await controller.createTicket(body, authorization);
    expect(adminService.createTicket).toHaveBeenCalledWith(body, authorization);
    expect(result).toEqual({ id: 't1' });
  });

  it('updateTicket should delegate to adminService.updateTicket', async () => {
    const body = { title: 'Updated' };
    adminService.updateTicket.mockResolvedValue({ updated: true });
    const result = await controller.updateTicket('t1', body, authorization);
    expect(adminService.updateTicket).toHaveBeenCalledWith('t1', body, authorization);
    expect(result).toEqual({ updated: true });
  });

  it('deleteTicket should delegate to adminService.deleteTicket', async () => {
    adminService.deleteTicket.mockResolvedValue({ deleted: true });
    const result = await controller.deleteTicket('t1', authorization);
    expect(adminService.deleteTicket).toHaveBeenCalledWith('t1', authorization);
    expect(result).toEqual({ deleted: true });
  });

  it('getResources should delegate to adminService.getResources', async () => {
    const query = { page: '1' };
    adminService.getResources.mockResolvedValue({ data: [] });
    const result = await controller.getResources(query, authorization);
    expect(adminService.getResources).toHaveBeenCalledWith(query, authorization);
    expect(result).toEqual({ data: [] });
  });

  it('createResource should delegate to adminService.createResource', async () => {
    const body = { name: 'Resource' };
    adminService.createResource.mockResolvedValue({ id: 'r1' });
    const result = await controller.createResource(body, authorization);
    expect(adminService.createResource).toHaveBeenCalledWith(body, authorization);
    expect(result).toEqual({ id: 'r1' });
  });

  it('updateResource should delegate to adminService.updateResource', async () => {
    const body = { name: 'Updated' };
    adminService.updateResource.mockResolvedValue({ updated: true });
    const result = await controller.updateResource('r1', body, authorization);
    expect(adminService.updateResource).toHaveBeenCalledWith('r1', body, authorization);
    expect(result).toEqual({ updated: true });
  });

  it('deleteResource should delegate to adminService.deleteResource', async () => {
    adminService.deleteResource.mockResolvedValue({ deleted: true });
    const result = await controller.deleteResource('r1', authorization);
    expect(adminService.deleteResource).toHaveBeenCalledWith('r1', authorization);
    expect(result).toEqual({ deleted: true });
  });

  it('getAnnouncements should delegate to adminService.getAnnouncements', async () => {
    const query = { page: '1' };
    adminService.getAnnouncements.mockResolvedValue({ data: [] });
    const result = await controller.getAnnouncements(query, authorization);
    expect(adminService.getAnnouncements).toHaveBeenCalledWith(query, authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getActiveAnnouncements should delegate to adminService.getActiveAnnouncements', async () => {
    adminService.getActiveAnnouncements.mockResolvedValue({ data: [] });
    const result = await controller.getActiveAnnouncements(authorization);
    expect(adminService.getActiveAnnouncements).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ data: [] });
  });

  it('createAnnouncement should delegate to adminService.createAnnouncement', async () => {
    const body = { title: 'Announcement' };
    adminService.createAnnouncement.mockResolvedValue({ id: 'a1' });
    const result = await controller.createAnnouncement(body, authorization);
    expect(adminService.createAnnouncement).toHaveBeenCalledWith(body, authorization);
    expect(result).toEqual({ id: 'a1' });
  });

  it('updateAnnouncement should delegate to adminService.updateAnnouncement', async () => {
    const body = { title: 'Updated' };
    adminService.updateAnnouncement.mockResolvedValue({ updated: true });
    const result = await controller.updateAnnouncement('a1', body, authorization);
    expect(adminService.updateAnnouncement).toHaveBeenCalledWith('a1', body, authorization);
    expect(result).toEqual({ updated: true });
  });

  it('deleteAnnouncement should delegate to adminService.deleteAnnouncement', async () => {
    adminService.deleteAnnouncement.mockResolvedValue({ deleted: true });
    const result = await controller.deleteAnnouncement('a1', authorization);
    expect(adminService.deleteAnnouncement).toHaveBeenCalledWith('a1', authorization);
    expect(result).toEqual({ deleted: true });
  });

  it('getAuditLogs should delegate to adminService.getAuditLogs', async () => {
    const query = { page: '1' };
    adminService.getAuditLogs.mockResolvedValue({ data: [] });
    const result = await controller.getAuditLogs(query, authorization);
    expect(adminService.getAuditLogs).toHaveBeenCalledWith(query, authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getActiveSessions should delegate to adminService.getActiveSessions', async () => {
    adminService.getActiveSessions.mockResolvedValue({ data: [] });
    const result = await controller.getActiveSessions(authorization);
    expect(adminService.getActiveSessions).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getHistoricalSessions should delegate to adminService.getHistoricalSessions', async () => {
    adminService.getHistoricalSessions.mockResolvedValue({ data: [] });
    const result = await controller.getHistoricalSessions(authorization);
    expect(adminService.getHistoricalSessions).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getBlockedSessions should delegate to adminService.getBlockedSessions', async () => {
    adminService.getBlockedSessions.mockResolvedValue({ data: [] });
    const result = await controller.getBlockedSessions(authorization);
    expect(adminService.getBlockedSessions).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getSessionsByUser should delegate to adminService.getSessionsByUser', async () => {
    adminService.getSessionsByUser.mockResolvedValue({ data: [] });
    const result = await controller.getSessionsByUser('u1', authorization);
    expect(adminService.getSessionsByUser).toHaveBeenCalledWith('u1', authorization);
    expect(result).toEqual({ data: [] });
  });

  it('blockSession should delegate to adminService.blockSession', async () => {
    adminService.blockSession.mockResolvedValue({ blocked: true });
    const result = await controller.blockSession('s1', authorization);
    expect(adminService.blockSession).toHaveBeenCalledWith('s1', authorization);
    expect(result).toEqual({ blocked: true });
  });

  it('unblockSession should delegate to adminService.unblockSession', async () => {
    adminService.unblockSession.mockResolvedValue({ blocked: false });
    const result = await controller.unblockSession('s1', authorization);
    expect(adminService.unblockSession).toHaveBeenCalledWith('s1', authorization);
    expect(result).toEqual({ blocked: false });
  });

  it('terminateSession should delegate to adminService.terminateSession', async () => {
    adminService.terminateSession.mockResolvedValue({ terminated: true });
    const result = await controller.terminateSession('s1', authorization);
    expect(adminService.terminateSession).toHaveBeenCalledWith('s1', authorization);
    expect(result).toEqual({ terminated: true });
  });

  it('getNotifications should delegate to adminService.getNotifications', async () => {
    adminService.getNotifications.mockResolvedValue({ data: [] });
    const result = await controller.getNotifications('u1', authorization);
    expect(adminService.getNotifications).toHaveBeenCalledWith('u1', authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getUnreadNotifications should delegate to adminService.getUnreadNotifications', async () => {
    adminService.getUnreadNotifications.mockResolvedValue({ data: [] });
    const result = await controller.getUnreadNotifications('u1', authorization);
    expect(adminService.getUnreadNotifications).toHaveBeenCalledWith('u1', authorization);
    expect(result).toEqual({ data: [] });
  });

  it('markNotificationRead should delegate to adminService.markNotificationRead', async () => {
    adminService.markNotificationRead.mockResolvedValue({ read: true });
    const result = await controller.markNotificationRead('n1', authorization);
    expect(adminService.markNotificationRead).toHaveBeenCalledWith('n1', authorization);
    expect(result).toEqual({ read: true });
  });

  it('getColegioProfessorsStats should delegate to adminService.getColegioProfessorsStats', async () => {
    adminService.getColegioProfessorsStats.mockResolvedValue({ total: 5 });
    const result = await controller.getColegioProfessorsStats('c1', authorization);
    expect(adminService.getColegioProfessorsStats).toHaveBeenCalledWith('c1', authorization);
    expect(result).toEqual({ total: 5 });
  });

  it('getColegioConsumoStats should delegate to adminService.getColegioConsumoStats', async () => {
    adminService.getColegioConsumoStats.mockResolvedValue({ total: 5 });
    const result = await controller.getColegioConsumoStats('c1', authorization);
    expect(adminService.getColegioConsumoStats).toHaveBeenCalledWith('c1', authorization);
    expect(result).toEqual({ total: 5 });
  });

  it('getColegioFullStats should delegate to adminService.getColegioFullStats', async () => {
    adminService.getColegioFullStats.mockResolvedValue({ total: 5 });
    const result = await controller.getColegioFullStats('c1', authorization);
    expect(adminService.getColegioFullStats).toHaveBeenCalledWith('c1', authorization);
    expect(result).toEqual({ total: 5 });
  });
});
