import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Users } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { UpdateUserInput } from './dtos/update-user.input';

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

  it('should return true when updateUser is called', async () => {
    // Arrange
    const userId = '1';
    const updateInput: UpdateUserInput = {
      name: 'John Doe',
      password: 'newpassword123',
      mail: 'john.doe@example.com',
    };
    jest.spyOn(service, 'updateUser').mockResolvedValue(true);

    // Act
    const result = await resolver.updateUser(userId, updateInput);

    // Assert
    expect(result).toBe(true);
  });

  it('should throw an error if updateUser method throws an exception', async () => {
    // Arrange
    const userId = '1';
    const updateInput: UpdateUserInput = {
      name: 'John Doe',
      password: 'newpassword123',
      mail: 'john.doe@example.com',
    };
    const errorMessage = 'User update failed';
    jest.spyOn(service, 'updateUser').mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(resolver.updateUser(userId, updateInput)).rejects.toThrowError(errorMessage);
  });
});