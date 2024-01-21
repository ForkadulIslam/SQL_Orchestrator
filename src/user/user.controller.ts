import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Post('addMultiple')
    async addMultiple(@Body() userData: [number, string, string, number | null]): Promise<any>{
        const results = await this.userService.addMultiple(userData);
        return results;
    }
}
