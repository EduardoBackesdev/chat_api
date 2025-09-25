# Chat API - Sistema de Chat em Tempo Real com NestJS

Chat API é um sistema de chat desenvolvido em NestJS que demonstra o uso avançado de WebSocket para comunicação em tempo real, autenticação JWT e gerenciamento de usuários online.

## 🚀 Características Principais

### WebSocket para Comunicação em Tempo Real
O sistema utiliza WebSocket para comunicação bidirecional instantânea, permitindo:

- **Mensagens privadas** entre usuários específicos via socket ID
- **Chat público** para comunicação global
- **Gerenciamento de usuários online** com atualizações em tempo real
- **Conexões persistentes** com controle automático de desconexões

```typescript
@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private onlineUsers: string[] = []

  @SubscribeMessage('privateMessage')
  handleMessage(@MessageBody() data: dataPrivate){
    const x = data.user
    this.server.to(x).emit('private_message', data.message)
  }

  @SubscribeMessage('free_message')
  handleFreeMessage(@MessageBody() data: dataFree){
    this.server.emit('free_message', data.message)
  }
}
```

### Sistema de Autenticação JWT
Implementação completa de autenticação com:

- **JWT tokens** para autenticação stateless
- **Criptografia de senhas** com bcrypt (salt rounds: 10)
- **Guards de proteção** para rotas sensíveis
- **Validação de dados** com class-validator

```typescript
@Injectable()
export class UsersService {
  async loginUser(user: loginUserDto): Promise<loginInterface> {
    const x = await this.userRepository.findOne({where: {email: user.email}})
    const match = await bcrypt.compare(user.password, x?.password)
    return {
      access_token: await this.jwtService.signAsync({sub: x.id, username: x.name})
    }
  }
}
```

### Sistema de Recuperação de Senha
Sistema robusto de reset de senha com:

- **Geração de tokens seguros** com crypto.randomBytes
- **Envio de emails** via Nodemailer
- **Expiração automática** de tokens (15 minutos)
- **Validação de tokens** antes da alteração

```typescript
async emailResetPass(user: emailResetPassDto): Promise<resetPassInterface>{
  const token = await this.reset.generateResetToken()
  await this.mailService.sendPasswordReset(user.email, token)
  const now = new Date(Date.now() + 15 * 60 * 1000)
  // Salva token no banco com expiração
}
```

## 🛠 Tecnologias Utilizadas

- **NestJS** - Framework Node.js escalável
- **TypeScript** - Tipagem estática
- **Socket.IO** - Implementação de WebSocket
- **TypeORM** - ORM para banco de dados
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Criptografia de senhas
- **Nodemailer** - Envio de emails
- **Class Validator** - Validação de DTOs

## 🔐 Funcionalidades

- **Criação e autenticação** de contas com validação
- **Mensagens privadas** via WebSocket
- **Chat público** em tempo real
- **Sistema de usuários online** com atualizações automáticas
- **Recuperação de senha** via email com tokens seguros
- **Proteção de rotas** com JWT Guards

## 🔄 Sistema de WebSocket

### Eventos Implementados:
- `register` - Registro de usuário online
- `privateMessage` - Mensagens privadas direcionadas
- `free_message` - Mensagens públicas
- `onlineUsers` - Lista de usuários conectados
- `private_message` - Recebimento de mensagens privadas

### Gerenciamento de Conexões:
```typescript
handleConnection(client: Socket, ...args: any[]) {
  this.logger.log(`Client connected: ${client.id}`);
}

handleDisconnect(client: Socket) {
  this.logger.log(`Client disconnected: ${client.id}`);
  this.onlineUsers = this.onlineUsers.filter(id => id != client.id)
  this.server.emit('onlineUsers', this.onlineUsers)
}
```

## 💡 Objetivo do Projeto

Este projeto foi desenvolvido com o propósito de mostrar minhas habilidades em:

- **Comunicação em tempo real** com WebSocket
- **Arquitetura modular** com NestJS
- **Autenticação segura** com JWT
- **Integração de serviços** (Email, Banco de Dados)

⌨️ Desenvolvido com NestJS + WebSocket + TypeScript