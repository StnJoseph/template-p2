import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DeleteAuthGuard implements CanActivate {
  private readonly validToken = 'mi-token-secreto-2025';

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-api-token'];

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing. Include x-api-token header');
    }

    if (token !== this.validToken) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    return true;
  }
}