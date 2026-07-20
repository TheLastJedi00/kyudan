/**
 * Seed do Firestore (projeto kyudan-da348) com o dataset mocado da ABK.
 *
 * Uso (o dev roda localmente — já possui Firebase CLI autenticado):
 *   npm run seed
 * ou
 *   npx tsx scripts/seed.ts
 *
 * Reutiliza a MESMA fonte de dados do app (src/.../mock-dataset.ts), garantindo
 * paridade entre o Firestore e o fallback in-memory.
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, writeBatch } from 'firebase/firestore';
import { environment } from '../src/environments/environment';
import {
  ALUNOS,
  CAMPEONATOS,
  EXAMES,
  FATURAS,
  FREQUENCIAS,
  INDICACOES,
  INVENTARIO,
  POLOS,
  SPLITS,
  TURMAS,
  USUARIOS,
} from '../src/app/core/data/mock-dataset';

const app = initializeApp(environment.firebase);
const db = getFirestore(app);

async function seedCollection<T>(nome: string, itens: T[], idOf: (item: T) => string) {
  const batch = writeBatch(db);
  for (const item of itens) {
    batch.set(doc(db, nome, idOf(item)), item as Record<string, unknown>);
  }
  await batch.commit();
  console.log(`  ✓ ${nome}: ${itens.length} documentos`);
}

async function main() {
  console.log(`Populando Firestore do projeto "${environment.firebase.projectId}"...`);

  await seedCollection('usuarios', USUARIOS, (u) => u.id);
  await seedCollection('polos', POLOS, (p) => p.id);
  await seedCollection('turmas', TURMAS, (t) => t.id);
  await seedCollection('alunos', ALUNOS, (a) => a.id);
  await seedCollection('exames', EXAMES, (e) => e.id);
  await seedCollection('campeonatos', CAMPEONATOS, (c) => c.id);
  await seedCollection('indicacoes', INDICACOES, (i) => `${i.exameId}_${i.alunoId}`);
  await seedCollection('faturas', FATURAS, (f) => f.id);
  await seedCollection('splits', SPLITS, (s) => s.poloId);
  await seedCollection('inventario', INVENTARIO, (i) => i.id);
  await seedCollection('frequencias', FREQUENCIAS, (f) => `${f.turmaId}_${f.data}_${f.alunoId}`);

  console.log('Seed concluído.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Falha no seed:', err);
  process.exit(1);
});
