import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class MSessionGuard implements CanActivate {
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if(request.session.email !== undefined) {
        return true;
    } else {
        throw new UnauthorizedException({message: 'invalid request! you must login first'});
    }
  }
}