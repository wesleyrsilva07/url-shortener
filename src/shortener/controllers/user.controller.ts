import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { CreateUserInput } from '../dtos/user/create-user.input';
import { UpdateUserInput } from '../dtos/user/update-user.input';
import { User } from '../entities/user.entity';
import { CreateUserOutput } from '../dtos/user/create-user.output';
import {
  UserIdParamsDto,
  UserEmailParamsDto
} from '../dtos/user/user-params.dto';
import { UserUseCase } from '../usecases/user.usecase';
import { ApiResponseClass } from '../shared/dtos/api-response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userUseCase: UserUseCase) {}

  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
    type: [User]
  })
  @HttpCode(HttpStatus.OK)
  async users(): Promise<User[]> {
    return await this.userUseCase.findAllUsers();
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @HttpCode(HttpStatus.OK)
  async user(@Param() params: UserIdParamsDto): Promise<User> {
    return await this.userUseCase.findUserById(params.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('email/:email')
  @ApiOperation({ summary: 'Busca usuário por email' })
  @ApiParam({ name: 'email', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @HttpCode(HttpStatus.OK)
  async userByEmail(@Param() params: UserEmailParamsDto): Promise<User> {
    return await this.userUseCase.findUserByEmail(params.email);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({ type: CreateUserInput })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: CreateUserOutput
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() data: CreateUserInput
  ): Promise<ApiResponseClass<CreateUserOutput>> {
    const user = await this.userUseCase.createUser(data);
    // return {
    //   name: user.name,
    //   email: user.email
    // };
    return ApiResponseClass.success({ name: user.name, email: user.email });
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza parcialmente um usuário' })
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
    @Param() params: UserIdParamsDto,
    @Body() data: UpdateUserInput
  ): Promise<User> {
    return await this.userUseCase.updateUser(params.id, data);
  }

  @ApiBearerAuth('JWT-auth')
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
  async deleteUser(@Param() params: UserIdParamsDto): Promise<boolean> {
    return await this.userUseCase.deleteUser(params.id);
  }
}
