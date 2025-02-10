import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Barbeiro } from '../../../shared/models/barbeiro.model';
import { Agendamento } from '../../../shared/models/agendamento.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  getBarbeiros(): Observable<Barbeiro[]> {
    return this.firestore.collection<Barbeiro>('barbeiros').valueChanges();
  }

  getHorariosOcupados(barbeiroId: string, data: string): Observable<string[]> {
    return this.firestore
      .collection<Agendamento>('agendamentos', ref =>
        ref.where('barbeiro.id', '==', barbeiroId)
           .where('data', '==', data)
      )
      .valueChanges()
      .pipe(map(agendamentos => agendamentos.map(a => this.formatarHorario(a.data))));
  }

  getDuracaoServico(servico: string): Observable<number> {
    return this.firestore
      .collection('servicos', ref => ref.where('nome', '==', servico))
      .valueChanges()
      .pipe(
        map(servicos => servicos.length > 0 ? (servicos[0] as any).duracao : 30) // Padrão 30 min
      );
  }

  criarAgendamento(agendamento: Agendamento): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('agendamentos').doc(id).set({ ...agendamento, id });
  }

  private formatarHorario(data: Date): string {
    const date = new Date(data);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
