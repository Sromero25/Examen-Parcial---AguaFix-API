import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    login(loginDto: LoginDto): Promise<import("./entities/user.entity").User>;
}
