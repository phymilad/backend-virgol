import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET))
  const {PORT} = process.env
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
  });
}
bootstrap(); 
