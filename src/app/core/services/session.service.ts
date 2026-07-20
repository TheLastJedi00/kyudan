import { Injectable, computed, signal } from '@angular/core';
import { Role, Usuario } from '../models';
import { USUARIOS } from '../data/mock-dataset';

/**
 * Sessão mocada do MVC. Sem Firebase Auth: o "login" é a escolha de uma persona
 * (uma por role) para navegar as diferentes visões do sistema.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  /** Uma persona representativa por role. */
  readonly personas: readonly Usuario[] = USUARIOS;

  readonly currentUser = signal<Usuario>(USUARIOS[0]);
  readonly role = computed<Role>(() => this.currentUser().role);

  /** Contexto extra por persona (aluno/responsável ligados a IDs de domínio). */
  readonly alunoId = computed(() => (this.role() === 'aluno' ? 'a-lucas' : null));
  readonly responsavelId = computed(() => (this.role() === 'responsavel' ? 'r-claudia' : null));
  readonly senseiId = computed(() => (this.role() === 'professor' ? this.currentUser().id : null));

  switchTo(userId: string): void {
    const user = this.personas.find((u) => u.id === userId);
    if (user) this.currentUser.set(user);
  }
}
