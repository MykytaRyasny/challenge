import { NestFactory } from '@nestjs/core'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`,
            ),
          ),
        }),
      ],
    }),
  })
  await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
