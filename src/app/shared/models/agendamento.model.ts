// src/app/shared/models/agendamento.model.ts
import { Cliente } from './cliente.model';
import { Barbeiro } from './barbeiro.model';

export interface Agendamento {
  id?: string;          // ID opcional (gerado pelo Firestore)
  cliente: Cliente;     // Dados do cliente
  servico: string;      // Tipo de serviço (ex: "Corte Social")
  barbeiro: Barbeiro;   // Barbeiro selecionado
  data: Date;           // Data e hora do agendamento
  duracao: number;      // Duração estimada em minutos
  status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
  criadoEm?: Date;      // Data de criação do registro
  atualizadoEm?: Date;  // Última atualização
}
