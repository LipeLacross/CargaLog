import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from '../services/logger.service';
import { AuditLog } from '../../domain/entities/audit-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
