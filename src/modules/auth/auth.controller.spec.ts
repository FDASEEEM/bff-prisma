import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            refresh: jest.fn(),
            logout: jest.fn(),
            me: jest.fn(),
            updateMe: jest.fn(),
            getGoogleAuthUrl: jest.fn(),
            exchangeGoogleCode: jest.fn(),
            getFrontUrl: jest.fn(),
            buildGoogleCallbackRedirect: jest.fn(),
            extractAuthHeader: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should delegate to authService.login', async () => {
      authService.login.mockResolvedValue({ access_token: 'token' });

      const result = await controller.login({ email: 'test@test.com', password: 'password' });

      expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password');
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('register', () => {
    it('should delegate to authService.register', async () => {
      const body = { email: 'test@test.com', password: 'pass', rut: '123', nombreCompleto: 'Test' };
      authService.register.mockResolvedValue({ ok: true });

      const result = await controller.register(body);

      expect(authService.register).toHaveBeenCalledWith(body);
      expect(result).toEqual({ ok: true });
    });
  });

  describe('refresh', () => {
    it('should delegate to authService.refresh', async () => {
      authService.refresh.mockResolvedValue({ access_token: 'new-token' });

      const result = await controller.refresh({ refreshToken: 'refresh-token-123' });

      expect(authService.refresh).toHaveBeenCalledWith('refresh-token-123');
      expect(result).toEqual({ access_token: 'new-token' });
    });
  });

  describe('googleUrl', () => {
    it('should delegate to authService.getGoogleAuthUrl', async () => {
      authService.getGoogleAuthUrl.mockResolvedValue({ url: 'https://google.com/auth', state: 'pkce-state' });

      const result = await controller.googleUrl();

      expect(authService.getGoogleAuthUrl).toHaveBeenCalled();
      expect(result).toEqual({ url: 'https://google.com/auth', state: 'pkce-state' });
    });
  });

  describe('googleCallback', () => {
    it('should exchange code/state and redirect to the front callback', async () => {
      const session = { access_token: 'access', refresh_token: 'refresh', expires_in: 3600, user: { id: '1' } };
      authService.exchangeGoogleCode.mockResolvedValue(session);
      authService.buildGoogleCallbackRedirect.mockReturnValue('http://localhost:3002/auth/callback#access_token=access');
      const res = { redirect: jest.fn() } as any;

      await controller.googleCallback('code', 'state', res);

      expect(authService.exchangeGoogleCode).toHaveBeenCalledWith('code', 'state');
      expect(authService.buildGoogleCallbackRedirect).toHaveBeenCalledWith(session);
      expect(res.redirect).toHaveBeenCalledWith('http://localhost:3002/auth/callback#access_token=access');
    });

    it('should redirect to the front with an error when the exchange fails', async () => {
      authService.exchangeGoogleCode.mockRejectedValue(new Error('Invalid code'));
      authService.getFrontUrl.mockReturnValue('http://localhost:3002');
      const res = { redirect: jest.fn() } as any;

      await controller.googleCallback('bad-code', 'bad-state', res);

      expect(res.redirect).toHaveBeenCalledWith(expect.stringMatching(/^http:\/\/localhost:3002\/auth\/callback#error=/));
    });
  });

  describe('logout', () => {
    it('should extract auth header and delegate to authService.logout', async () => {
      authService.extractAuthHeader.mockReturnValue('Bearer token123');
      authService.logout.mockResolvedValue({ message: 'Logged out' });

      const result = await controller.logout('Bearer token123');

      expect(authService.extractAuthHeader).toHaveBeenCalledWith('Bearer token123');
      expect(authService.logout).toHaveBeenCalledWith('Bearer token123');
      expect(result).toEqual({ message: 'Logged out' });
    });
  });

  describe('me', () => {
    it('should extract auth header and delegate to authService.me', async () => {
      authService.extractAuthHeader.mockReturnValue('Bearer token123');
      authService.me.mockResolvedValue({ id: '1', email: 'test@test.com' });

      const result = await controller.me('Bearer token123');

      expect(authService.extractAuthHeader).toHaveBeenCalledWith('Bearer token123');
      expect(authService.me).toHaveBeenCalledWith('Bearer token123');
      expect(result).toEqual({ id: '1', email: 'test@test.com' });
    });
  });

  describe('updateMe', () => {
    it('should extract auth header and delegate to authService.updateMe', async () => {
      authService.extractAuthHeader.mockReturnValue('Bearer token123');
      authService.updateMe.mockResolvedValue({ updated: true });
      const body = { nombreCompleto: 'Updated' };

      const result = await controller.updateMe('Bearer token123', body);

      expect(authService.extractAuthHeader).toHaveBeenCalledWith('Bearer token123');
      expect(authService.updateMe).toHaveBeenCalledWith('Bearer token123', body);
      expect(result).toEqual({ updated: true });
    });
  });
});
