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
  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const newTicket = this.ticketsRepository.create(createTicketDto);
    return await this.ticketsRepository.save(newTicket);
  }

  // 全件取得（作成日が新しい順）
  async findAll(): Promise<Ticket[]> {
    return await this.ticketsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // IDで1件取得
  async findOne(id: string): Promise<Ticket | null> {
    return await this.ticketsRepository.findOneBy({ id });
  }

  // 更新
  async update(id: string, updateTicketDto: UpdateTicketDto) {
    return await this.ticketsRepository.update(id, updateTicketDto);
  }

  // 削除
  async remove(id: string) {
    return await this.ticketsRepository.delete(id);
  }
}