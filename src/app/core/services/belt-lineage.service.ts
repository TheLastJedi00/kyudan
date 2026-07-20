import { Injectable } from '@angular/core';
import { Belt, BeltColor } from '../models';

/**
 * Fonte única da verdade para a linhagem de faixas (FCK/CBK).
 * Ordem de progressão: Branca → Amarela → Vermelha → Laranja → Verde → Roxa → Marrom → Preta (Dan).
 */
@Injectable({ providedIn: 'root' })
export class BeltLineageService {
  private readonly belts: readonly Belt[] = [
    { id: 'branca', color: 'white', label: 'Branca', grade: '7º Kyu', order: 0, requiredHours: 40 },
    { id: 'amarela', color: 'yellow', label: 'Amarela', grade: '6º Kyu', order: 1, requiredHours: 60 },
    { id: 'vermelha', color: 'red', label: 'Vermelha', grade: '5º Kyu', order: 2, requiredHours: 80 },
    { id: 'laranja', color: 'orange', label: 'Laranja', grade: '4º Kyu', order: 3, requiredHours: 100 },
    { id: 'verde', color: 'green', label: 'Verde', grade: '3º Kyu', order: 4, requiredHours: 120 },
    { id: 'roxa', color: 'purple', label: 'Roxa', grade: '2º Kyu', order: 5, requiredHours: 160 },
    { id: 'marrom', color: 'brown', label: 'Marrom', grade: '1º Kyu', order: 6, requiredHours: 200 },
    { id: 'preta', color: 'black', label: 'Preta (Dan)', grade: 'Dan', order: 7, requiredHours: 0 },
  ];

  /** Toda a linhagem, em ordem de progressão. */
  get all(): readonly Belt[] {
    return this.belts;
  }

  /** Resolve uma faixa pela cor. */
  byColor(color: BeltColor): Belt {
    return this.belts.find((b) => b.color === color) ?? this.belts[0];
  }

  /** Próxima faixa na progressão, ou `null` se já for a máxima (Dan). */
  next(color: BeltColor): Belt | null {
    const atual = this.byColor(color);
    return this.belts.find((b) => b.order === atual.order + 1) ?? null;
  }

  /** Faixas já conquistadas (inclui a atual), em ordem. */
  conquered(color: BeltColor): Belt[] {
    const atual = this.byColor(color);
    return this.belts.filter((b) => b.order <= atual.order);
  }

  /** Faixas ainda bloqueadas (acima da atual). */
  locked(color: BeltColor): Belt[] {
    const atual = this.byColor(color);
    return this.belts.filter((b) => b.order > atual.order);
  }

  /**
   * Progresso (0..100) rumo à próxima faixa, dado o total de horas acumuladas.
   * Retorna 100 quando já é a faixa máxima.
   */
  progressPercent(color: BeltColor, horasAcumuladas: number): number {
    const atual = this.byColor(color);
    if (atual.requiredHours <= 0) return 100;
    return Math.min(100, Math.round((horasAcumuladas / atual.requiredHours) * 100));
  }
}
