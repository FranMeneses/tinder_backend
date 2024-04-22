/*import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CreateUserInput } from './dtos/create-user.input';
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

  it('should throw an error if createUser method throws an exception', async () => {
    const createUserInput: CreateUserInput = {
      name: 'John Doe',
      password: 'password123',
      mail: 'john.doe@example.com',
    };

    const errorMessage = 'User creation failed';
    jest.spyOn(service, 'createUser').mockRejectedValue(new Error(errorMessage));

    try {
      await resolver.createUsers(createUserInput);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(errorMessage);
    }
  });

  it('should create a new user with default values if some properties are missing in input', async () => {
    const createUserInput = {
      name: 'John Doe',
      password: 'password123',
      // mail es omitido a propósito
    } as CreateUserInput; // Utilizamos "as CreateUserInput" para indicar a TypeScript que el objeto es de tipo CreateUserInput
  
    // Creamos un mock para el método createUser del servicio
    jest.spyOn(service, 'createUser').mockImplementation(async (input: CreateUserInput) => {
      // Aseguramos que la entrada recibida por el servicio coincida con la entrada esperada
      expect(input.name).toEqual(createUserInput.name);
      expect(input.password).toEqual(createUserInput.password);
      expect(input.mail).toEqual(undefined); // Mail debería estar presente
      return true;
    });
  
    // Llamamos a la mutación con el objeto createUserInput que falta la propiedad 'mail'
    const result = await resolver.createUsers(createUserInput);
    expect(result).toEqual(true);
  });
});*/
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CreateUserInput } from './dtos/create-user.input';
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

  it('should throw an error if createUser method throws an exception', async () => {
    const createUserInput: CreateUserInput = {
      name: 'John Doe',
      password: 'password123',
      mail: 'john.doe@example.com',
    };

    const errorMessage = 'User creation failed';
    jest.spyOn(service, 'createUser').mockRejectedValue(new Error(errorMessage));

    try {
      await resolver.createUsers(createUserInput);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(errorMessage);
    }
  });

  it('should create a new user with default values if some properties are missing in input', async () => {
    const createUserInput: CreateUserInput = {
      name: 'John Doe',
      password: 'password123',
      // mail se omite a propósito
    }as CreateUserInput;

    const expectedInput: CreateUserInput = {
      name: 'John Doe',
      password: 'password123',
      mail: undefined,
    };

    jest.spyOn(service, 'createUser').mockImplementation(async (input: CreateUserInput) => {
      // Aseguramos que la entrada recibida por el servicio coincida con la entrada esperada
      expect(input).toEqual(expectedInput);
      return true;
    });
  
    // Llamamos a la mutación con el objeto createUserInput que falta la propiedad 'mail'
    const result = await resolver.createUsers(createUserInput);
    expect(result).toEqual(true);
  });
});