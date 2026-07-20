/** Papéis (roles) do sistema. */
export type Role = 'aluno' | 'professor' | 'responsavel' | 'gestao';

/** Status de uma filiação/anuidade federativa. */
export type FiliacaoStatus = 'regular' | 'vencendo' | 'vencido';

/** Filiações do praticante (Associação local + federação/confederação). */
export interface Filiacoes {
  abk: FiliacaoStatus;
  fck: FiliacaoStatus;
  cbk: FiliacaoStatus;
}

/** Usuário autenticado (mocado no MVC). */
export interface Usuario {
  id: string;
  nome: string;
  role: Role;
  avatarUrl?: string;
}
