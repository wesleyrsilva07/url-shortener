import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { CreateUserInput } from '../dtos/create-user.input';
import { UpdateUserInput } from '../dtos/update-user.input';
import { User } from '../entities/user.entity';
import { UserUseCase } from '../usecases/user.usecase';

@ApiTags('users')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userUseCase: UserUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
    type: [User]
  })
  @HttpCode(HttpStatus.OK)
  async users(): Promise<User[]> {
    this.logger.log('GET /users chamado');
    return await this.userUseCase.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @HttpCode(HttpStatus.OK)
  async user(@Param('id') id: string): Promise<User> {
    this.logger.log(`GET /users/${id} chamado`);
    return await this.userUseCase.findUserById(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Busca usuário por email' })
  @ApiParam({ name: 'email', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @HttpCode(HttpStatus.OK)
  async userByEmail(@Param('email') email: string): Promise<User> {
    this.logger.log(`GET /users/email/${email} chamado`);
    return await this.userUseCase.findUserByEmail(email);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({ type: CreateUserInput })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: User
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() data: CreateUserInput): Promise<User> {
    console.log('teste');

    this.logger.log(`POST /users chamado com body: ${JSON.stringify(data)}`);
    return await this.userUseCase.createUser(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuário' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserInput })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    type: User
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserInput
  ): Promise<User> {
    this.logger.log(
      `PUT /users/${id} chamado com body: ${JSON.stringify(data)}`
    );
    return await this.userUseCase.updateUser(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso.',
    type: Boolean
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string): Promise<boolean> {
    this.logger.log(`DELETE /users/${id} chamado`);
    return await this.userUseCase.deleteUser(id);
  }
}
