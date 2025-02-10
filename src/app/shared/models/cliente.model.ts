export interface Cliente {
  nome: string;
  telefone: string;
  email?: string;
  fidelidade?: {
    pontos: number;
    ultimaVisita: Date;
  };
}
