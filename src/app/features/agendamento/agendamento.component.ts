import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../core/auth/services/firebase.service';
import { Barbeiro } from '../../shared/models/barbeiro.model';
import { Agendamento } from '../../shared/models/agendamento.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit {
  agendamentoForm!: FormGroup;
  barbeiros: Barbeiro[] = [];
  horariosDisponiveis: string[] = [];
  carregando = false;

  // Definindo a propriedade servicos
  servicos: string[] = [
    'Corte de Cabelo',
    'Barba',
    'Corte e Barba',
    'Hidratação'
  ];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarBarbeiros();
  }

  private initForm(): void {
    this.agendamentoForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      email: [''],
      servico: ['', Validators.required],
      barbeiro: ['', Validators.required],
      data: ['', Validators.required],
      horario: ['', Validators.required]
    });
  }

  private carregarBarbeiros(): void {
    this.firebaseService.getBarbeiros().subscribe({
      next: (barbeiros) => (this.barbeiros = barbeiros),
      error: () => this.mostrarErro('Erro ao carregar barbeiros')
    });
  }

  onDataSelecionada(): void {
    const data = this.agendamentoForm.get('data')?.value;
    const barbeiroId = this.agendamentoForm.get('barbeiro')?.value;

    if (data && barbeiroId) {
      this.carregando = true;
      this.firebaseService.getHorariosOcupados(barbeiroId, data).subscribe({
        next: (horariosOcupados) => this.gerarHorariosDisponiveis(horariosOcupados),
        error: () => this.mostrarErro('Erro ao carregar horários'),
        complete: () => (this.carregando = false)
      });
    }
  }

  private gerarHorariosDisponiveis(ocupados: string[]): void {
    const horarios = [
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    this.horariosDisponiveis = horarios.filter(h => !ocupados.includes(h));
  }

  private criarAgendamento(): void {
    const formValue = this.agendamentoForm.value;
    const [hora, minuto] = formValue.horario.split(':');
    const data = new Date(formValue.data);
    data.setHours(hora, minuto);

    // Buscar duração do serviço no Firebase
    this.firebaseService.getDuracaoServico(formValue.servico).subscribe({
      next: (duracao) => {
        const agendamento: Agendamento = {
          cliente: {
            nome: formValue.nome,
            telefone: formValue.telefone,
            email: formValue.email || undefined
          },
          servico: formValue.servico,
          barbeiro: this.barbeiros.find(b => b.id === formValue.barbeiro)!,
          data: data,
          duracao: duracao, // Duração vinda do Firebase
          status: 'pendente',
          criadoEm: new Date()
        };

        this.firebaseService.criarAgendamento(agendamento).then(() => {
          this.mostrarSucesso('Agendamento criado com sucesso!');
        }).catch(() => {
          this.mostrarErro('Erro ao criar agendamento.');
        });
      },
      error: () => this.mostrarErro('Erro ao carregar duração do serviço')
    });
  }

  private mostrarErro(mensagem: string): void {
    console.error(mensagem);
  }

  private mostrarSucesso(mensagem: string): void {
    console.log(mensagem);
  }

  onSubmit(): void {
    if (this.agendamentoForm.valid) {
      this.criarAgendamento();
    } else {
      this.mostrarErro('Formulário inválido');
    }
  }
}
