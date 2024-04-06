import { Query, Resolver, Args, Mutation, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { CreateUserInput } from './dtos/create-user.input';
import { LoginUserInput } from './dtos/user-login.input';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) { }

  @Query(() => [Users])
  user() {
    return this.usersService.findAll();
  }

  @Mutation(() => Boolean)
  async createUsers(@Args('userInput') userInput: CreateUserInput): Promise<boolean> {
    return this.usersService.createUser(userInput);
  }

  @Mutation(() => String)
  async loginUsersTest(@Args('loginInput') loginInput: LoginUserInput) {
    try {

      const token = await this.usersService.loginUserTest(loginInput);

      if (token) {

        return token;
      } else {
        return "";
      }
    } catch (error) {
      console.error('Error en la llamada a loginUsersTest:', error);
      return "";
    }
  }

  @Query(() => String)
  async showInfo(@Context() context) {
    const authorization = context.req.headers.authorization;

    if (!authorization) {
      throw new Error('No se proporcionó un token de autorización.');
    }

    try {
      const decoded = jwt.verify(authorization, 'tu_clave_secreta') as JwtPayload;
      const correo = decoded.correo;

      if (decoded) {
        const result = await this.usersService.showInfo(correo);
        const jsonResult = JSON.stringify(result)
        return jsonResult;
      }
    } catch (error) {
      throw new Error('Token no válido. Verificación fallida.');
    }
  }

  

}


