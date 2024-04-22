import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

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
  
    it('should return a user when getUserById is called', async () => {
      // Arrange
      const mockUser = {
        name: 'John Doe',
        password: 'password123',
        mail: 'john.doe@example.com',
        likes: [],
      } as Users;
      jest.spyOn(service, 'findUserById').mockResolvedValue(mockUser);
  
      // Act
      const result = await resolver.getUserById('1');
  
      // Assert
      expect(result).toEqual(mockUser);
    });
  
    it('should return null when getUserById is called with an invalid user id', async () => {
      // Arrange
      jest.spyOn(service, 'findUserById').mockResolvedValue(null);
  
      // Act
      const result = await resolver.getUserById('invalid_id');
  
      // Assert
      expect(result).toBeNull();
    });
  });