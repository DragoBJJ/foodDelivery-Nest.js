import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    // return this.appService.getHello();
    return 'Hello World';
  }

  @Get('/user')
  getUser(): { name: string } {
    return { name: 'User' };
  }
}
