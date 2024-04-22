import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Users } from './users.entity';
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
        {
          provide: getModelToken(Users.name),
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should return true when deleteUser is called', async () => {
    // Arrange
    const userId = '1';
    jest.spyOn(service, 'deleteUser').mockResolvedValue(true);

    // Act
    const result = await resolver.deleteUser(userId);

    // Assert
    expect(result).toBe(true);
  });

  it('should throw an error if deleteUser method throws an exception', async () => {
    // Arrange
    const userId = '1';
    const errorMessage = 'User deletion failed';
    jest.spyOn(service, 'deleteUser').mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(resolver.deleteUser(userId)).rejects.toThrowError(errorMessage);
  });
});