import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
//import { JwtPayload } from './interfaces/jwt-payload.interface';
import { getModelToken } from '@nestjs/mongoose';
import { Users } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: getModelToken(Users.name),
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should throw an error if no authorization token is provided', async () => {
    // Arrange
    const context = {
      req: {
        headers: {},
      },
    };

    // Act and Assert
    await expect(resolver.showInfo(context)).rejects.toThrowError('No se proporcionó un token de autorización.');
  });

  it('should throw an error if an invalid token is provided', async () => {
    // Arrange
    const context = {
      req: {
        headers: {
          authorization: 'invalid_token',
        },
      },
    };

    // Act and Assert
    await expect(resolver.showInfo(context)).rejects.toThrowError('Token no válido. Verificación fallida.');
  });

  it('should return user information when a valid token is provided', async () => {
    // Arrange
    const correo = 'john.doe@example.com';
    const token = jwt.sign({ correo }, 'tu_clave_secreta') as string;
    const context = {
      req: {
        headers: {
          authorization: token,
        },
      },
    };
    const mockUser = {
        name: 'John Doe',
        password: 'password123',
        mail: 'john.doe@example.com',
        likes: [],
      } as Users;

    jest.spyOn(service, 'showInfo').mockResolvedValue(mockUser);

    // Act
    const result = await resolver.showInfo(context);

    // Assert
    expect(result).toEqual(JSON.stringify(mockUser));
  });
});