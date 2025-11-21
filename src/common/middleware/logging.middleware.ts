import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('API');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    // Registrar cuando la respuesta finaliza
    res.on('finish', () => {
      const { statusCode } = res;
      const endTime = Date.now();
      const processingTime = endTime - startTime;

      this.logger.log(
        `${method} ${originalUrl} - Status: ${statusCode} - Time: ${processingTime}ms`
      );
    });

    next();
  }
}