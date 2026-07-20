import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ALUNOS_SERVICE,
  EXAMES_SERVICE,
  FINANCEIRO_SERVICE,
  FREQUENCIA_SERVICE,
  POLOS_SERVICE,
} from '../contracts/data-contracts';
import {
  MockAlunosService,
  MockExamesService,
  MockFinanceiroService,
  MockFrequenciaService,
  MockPolosService,
} from './mock-data.services';
import {
  FirebaseAlunosService,
  FirebaseExamesService,
  FirebaseFinanceiroService,
  FirebaseFrequenciaService,
  FirebasePolosService,
} from '../firebase/firebase-data.services';

/**
 * Liga cada contrato (`*_SERVICE`) à implementação escolhida em `environment.dataSource`.
 * Este é o ÚNICO ponto de troca entre Firebase e Mock — no futuro, um `ApiXService`
 * (NestJS) entra aqui sem tocar em componentes.
 */
export function provideData(): Provider[] {
  const useFirebase = environment.dataSource === 'firebase';
  return [
    { provide: ALUNOS_SERVICE, useClass: useFirebase ? FirebaseAlunosService : MockAlunosService },
    { provide: POLOS_SERVICE, useClass: useFirebase ? FirebasePolosService : MockPolosService },
    { provide: EXAMES_SERVICE, useClass: useFirebase ? FirebaseExamesService : MockExamesService },
    {
      provide: FINANCEIRO_SERVICE,
      useClass: useFirebase ? FirebaseFinanceiroService : MockFinanceiroService,
    },
    {
      provide: FREQUENCIA_SERVICE,
      useClass: useFirebase ? FirebaseFrequenciaService : MockFrequenciaService,
    },
  ];
}
