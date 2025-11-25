import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  // チケット作成
  create(createTicketDto: CreateTicketDto) {
    const newTicket = this.ticketsRepository.create(createTicketDto);
    return this.ticketsRepository.save(newTicket);
  }

  // 全件取得（作成日が新しい順）
  findAll() {
    return this.ticketsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // IDで1件取得
  findOne(id: string) {
    return this.ticketsRepository.findOneBy({ id });
  }

  // 更新
  update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.ticketsRepository.update(id, updateTicketDto);
  }

  // 削除
  remove(id: string) {
    return this.ticketsRepository.delete(id);
  }
}