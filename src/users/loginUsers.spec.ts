import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

import { Users } from './users.entity';
import { LoginUserInput } from 'src/users/dtos/user-login.input';

import { getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

describe('UsersResolver', () => {
    let resolver: UsersResolver;
    let service: UsersService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [JwtModule],
        providers: [
          UsersResolver,
          UsersService,
          {//buscar esto
            provide: getModelToken(Users.name),
            useValue: {},
          },
        ],
      }).compile();
  
      resolver = module.get<UsersResolver>(UsersResolver);
      service = module.get<UsersService>(UsersService);
    });
  
    it('should be defined', () => {
      expect(resolver).toBeDefined();
    });
  
    describe('loginUsersTest', () => {
      it('should return a token if login is successful', async () => {
        const loginInput: LoginUserInput = {
          mail: 'test@example.com',
          password: 'password123',
        };
  
        const mockToken = 'mockTokenString';
  
        jest.spyOn(service, 'loginUserTest').mockResolvedValue(mockToken);
  
        const result = await resolver.loginUsersTest(loginInput);
  
        expect(result).toBe(mockToken);
      });
  
      it('should return an empty string if login is unsuccessful', async () => {
        const loginInput: LoginUserInput = {
          mail: 'test@example.com',
          password: 'password123',
        };
  
        jest.spyOn(service, 'loginUserTest').mockResolvedValue(null);
  
        const result = await resolver.loginUsersTest(loginInput);
  
        expect(result).toBe('');
      });
  
      it('should return an empty string and log error if an error occurs during login', async () => {
        const loginInput: LoginUserInput = {
          mail: 'test@example.com',
          password: 'password123',
        };
  
        const errorMessage = 'Login failed';
        jest.spyOn(service, 'loginUserTest').mockRejectedValue(new Error(errorMessage));
  
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
        const result = await resolver.loginUsersTest(loginInput);
  
        expect(result).toBe('');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error en la llamada a loginUsersTest:', expect.any(Error));
      });
    });
  });