import { Injectable, computed, signal } from '@angular/core';
import { Role, Usuario } from '../models';
import { USUARIOS } from '../data/mock-dataset';

const ROLE_ORDER: Role[] = ['gestao', 'professor', 'aluno', 'responsavel'];
const ROLE_TITULO: Record<Role, string> = {
  gestao: 'Gestão',
  professor: 'Professores',
  aluno: 'Alunos',
  responsavel: 'Responsáveis',
};

export interface PersonaGrupo {
  role: Role;
  titulo: string;
  usuarios: Usuario[];
}

/**
 * Sessão mocada do MVC. Sem Firebase Auth: o "login" é a escolha de uma persona
 * para navegar as visões do sistema. Os ids das personas se alinham às entidades
 * de domínio (persona de aluno = Aluno.id; responsável = responsavelId; sensei = senseiId),
 * então o contexto é derivado do usuário logado — nada hardcoded.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly personas: readonly Usuario[] = USUARIOS;

  readonly currentUser = signal<Usuario>(USUARIOS[0]);
  readonly role = computed<Role>(() => this.currentUser().role);

  /** Personas agrupadas por role (para o seletor com optgroups). */
  readonly personasByRole = computed<PersonaGrupo[]>(() =>
    ROLE_ORDER.map((role) => ({
      role,
      titulo: ROLE_TITULO[role],
      usuarios: this.personas.filter((u) => u.role === role),
    })).filter((g) => g.usuarios.length),
  );

  // Contexto de domínio derivado da persona ativa.
  readonly alunoId = computed(() => (this.role() === 'aluno' ? this.currentUser().id : null));
  readonly responsavelId = computed(() =>
    this.role() === 'responsavel' ? this.currentUser().id : null,
  );
  readonly senseiId = computed(() => (this.role() === 'professor' ? this.currentUser().id : null));

  switchTo(userId: string): void {
    const user = this.personas.find((u) => u.id === userId);
    if (user) this.currentUser.set(user);
  }
}
