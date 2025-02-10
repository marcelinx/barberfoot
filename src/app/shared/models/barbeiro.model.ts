// src/app/shared/models/barbeiro.model.ts
export interface Barbeiro {
  id: string;
  nome: string;
  fotoUrl: string;  // Nova propriedade (URL da imagem)
  especialidades: string[];
  horarioTrabalho: {
    inicio: string; // Formato HH:mm
    fim: string;
    dias: number[]; // 0 (Domingo) a 6 (Sábado)
  };
  sobre?: string;   // Descrição opcional
}
