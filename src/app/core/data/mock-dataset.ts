import {
  Aluno,
  Campeonato,
  Exame,
  Fatura,
  Filiacoes,
  Frequencia,
  IndicacaoExame,
  ItemInventario,
  Polo,
  RegraSplit,
  Turma,
  Usuario,
} from '../models';

/**
 * Dataset mocado da ABK — fonte única usada tanto pelo seed do Firestore
 * quanto pela implementação in-memory dos repositórios (fallback do MVC).
 * Datas fixas (sem Date.now) para builds determinísticos.
 */

const reg: Filiacoes = { abk: 'regular', fck: 'regular', cbk: 'regular' };
const venc: Filiacoes = { abk: 'regular', fck: 'vencido', cbk: 'regular' };
const vcto: Filiacoes = { abk: 'regular', fck: 'vencendo', cbk: 'regular' };

function kihon(nome: string, dominado = false) {
  return { id: `k-${nome}`, categoria: 'kihon' as const, nome, dominado };
}
function kata(nome: string, dominado = false) {
  return { id: `t-${nome}`, categoria: 'kata' as const, nome, dominado };
}
function kumite(nome: string, dominado = false) {
  return { id: `u-${nome}`, categoria: 'kumite' as const, nome, dominado };
}

export const USUARIOS: Usuario[] = [
  { id: 'u-gestao', nome: 'Diretoria ABK', role: 'gestao' },
  { id: 's-tanaka', nome: 'Sensei Tanaka', role: 'professor' },
  { id: 's-marina', nome: 'Sensei Marina', role: 'professor' },
  { id: 'a-lucas', nome: 'Lucas Hillesheim', role: 'aluno' },
  { id: 'r-claudia', nome: 'Cláudia Souza', role: 'responsavel' },
];

export const POLOS: Polo[] = [
  {
    id: 'p-fundacao',
    nome: 'Fundação Fritz Müller',
    endereco: 'Rua XV de Novembro, 1200 — Centro, Blumenau',
    capacidadeMaxima: 60,
    senseiIds: ['s-tanaka'],
    crescimentoMes: 8,
  },
  {
    id: 'p-sesc',
    nome: 'SESC Blumenau',
    endereco: 'Rua Sete de Setembro, 800 — Centro, Blumenau',
    capacidadeMaxima: 45,
    senseiIds: ['s-marina'],
    crescimentoMes: 3,
  },
  {
    id: 'p-garcia',
    nome: 'Clube Garcia',
    endereco: 'Rua Amazonas, 55 — Garcia, Blumenau',
    capacidadeMaxima: 40,
    senseiIds: ['s-tanaka', 's-marina'],
    crescimentoMes: -4,
  },
];

export const TURMAS: Turma[] = [
  {
    id: 't-fund-inf',
    poloId: 'p-fundacao',
    senseiId: 's-tanaka',
    nome: 'Infantil (Base)',
    horarios: [
      { diaSemana: 1, inicio: '18:00', fim: '19:00' },
      { diaSemana: 3, inicio: '18:00', fim: '19:00' },
    ],
    alunoIds: ['a-bruno', 'a-sofia', 'a-pedro'],
  },
  {
    id: 't-fund-adt',
    poloId: 'p-fundacao',
    senseiId: 's-tanaka',
    nome: 'Adulto / Rendimento',
    horarios: [
      { diaSemana: 1, inicio: '19:30', fim: '21:00' },
      { diaSemana: 4, inicio: '19:30', fim: '21:00' },
    ],
    alunoIds: ['a-lucas', 'a-marina-al', 'a-rafael'],
  },
  {
    id: 't-sesc-mix',
    poloId: 'p-sesc',
    senseiId: 's-marina',
    nome: 'Misto Iniciante',
    horarios: [
      { diaSemana: 2, inicio: '18:30', fim: '19:30' },
      { diaSemana: 5, inicio: '18:30', fim: '19:30' },
    ],
    alunoIds: ['a-julia', 'a-enzo', 'a-carla'],
  },
  {
    id: 't-garcia-mix',
    poloId: 'p-garcia',
    senseiId: 's-marina',
    nome: 'Misto Avançado',
    horarios: [{ diaSemana: 6, inicio: '10:00', fim: '11:30' }],
    alunoIds: ['a-diego', 'a-helena', 'a-otavio'],
  },
];

function mkAluno(a: Partial<Aluno> & Pick<Aluno, 'id' | 'nome' | 'poloId' | 'turmaId' | 'beltColor'>): Aluno {
  return {
    dataNascimento: '2000-01-01',
    horasAcumuladas: 0,
    filiacoes: reg,
    perfilAtleta: false,
    alertas: [],
    curriculo: [],
    graduacoes: [],
    competicoes: [],
    ocorrencias: [],
    ...a,
  };
}

export const ALUNOS: Aluno[] = [
  // Turma infantil (Base) — dependentes de responsáveis
  mkAluno({
    id: 'a-bruno',
    nome: 'Bruno Souza',
    poloId: 'p-fundacao',
    turmaId: 't-fund-inf',
    beltColor: 'yellow',
    dataNascimento: '2016-04-12',
    horasAcumuladas: 42,
    responsavelId: 'r-claudia',
    alertas: ['mensalidade'],
    curriculo: [kihon('Zuki (soco)', true), kihon('Gedan Barai', true), kata('Heian Shodan', false)],
    graduacoes: [{ beltColor: 'white', data: '2023-06-10', senseiNome: 'Sensei Tanaka' }],
    ocorrencias: [
      { id: 'o1', data: '2026-06-01', autorNome: 'Sensei Tanaka', tag: 'destaque', texto: 'Ótimo foco no treino.' },
    ],
  }),
  mkAluno({
    id: 'a-sofia',
    nome: 'Sofia Souza',
    poloId: 'p-fundacao',
    turmaId: 't-fund-inf',
    beltColor: 'white',
    dataNascimento: '2018-09-30',
    horasAcumuladas: 18,
    responsavelId: 'r-claudia',
    curriculo: [kihon('Postura Zenkutsu', true), kihon('Age Uke', false)],
  }),
  mkAluno({
    id: 'a-pedro',
    nome: 'Pedro Lima',
    poloId: 'p-fundacao',
    turmaId: 't-fund-inf',
    beltColor: 'white',
    dataNascimento: '2017-02-20',
    horasAcumuladas: 35,
    alertas: ['medico'],
    curriculo: [kihon('Zuki (soco)', true), kihon('Gedan Barai', false)],
  }),

  // Turma adulto / rendimento
  mkAluno({
    id: 'a-lucas',
    nome: 'Lucas Hillesheim',
    poloId: 'p-fundacao',
    turmaId: 't-fund-adt',
    beltColor: 'brown',
    dataNascimento: '1995-11-05',
    horasAcumuladas: 150,
    perfilAtleta: true,
    curriculo: [
      kihon('Kihon combinado', true),
      kata('Bassai Dai', true),
      kata('Kanku Dai', false),
      kumite('Jiyu Kumite', true),
    ],
    graduacoes: [
      { beltColor: 'white', data: '2018-03-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'yellow', data: '2019-04-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'red', data: '2020-05-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'orange', data: '2021-06-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'green', data: '2022-08-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'purple', data: '2024-03-01', senseiNome: 'Sensei Tanaka' },
    ],
    competicoes: [
      { id: 'c1', evento: 'JASC 2024', data: '2024-11-10', colocacao: '1º', medalha: 'ouro' },
      { id: 'c2', evento: 'Estadual FCK 2025', data: '2025-05-18', colocacao: '3º', medalha: 'bronze' },
    ],
  }),
  mkAluno({
    id: 'a-marina-al',
    nome: 'Marina Costa',
    poloId: 'p-fundacao',
    turmaId: 't-fund-adt',
    beltColor: 'green',
    dataNascimento: '1999-07-22',
    horasAcumuladas: 95,
    filiacoes: vcto,
    perfilAtleta: true,
    alertas: ['fck'],
    curriculo: [kata('Heian Godan', true), kata('Tekki Shodan', false), kumite('Kihon Ippon', true)],
  }),
  mkAluno({
    id: 'a-rafael',
    nome: 'Rafael Nunes',
    poloId: 'p-fundacao',
    turmaId: 't-fund-adt',
    beltColor: 'red',
    dataNascimento: '2001-01-14',
    horasAcumuladas: 78,
    filiacoes: venc,
    alertas: ['fck', 'mensalidade'],
    curriculo: [kata('Heian Nidan', true), kihon('Mae Geri', true)],
  }),

  // SESC iniciante
  mkAluno({ id: 'a-julia', nome: 'Júlia Fernandes', poloId: 'p-sesc', turmaId: 't-sesc-mix', beltColor: 'white', horasAcumuladas: 22 }),
  mkAluno({ id: 'a-enzo', nome: 'Enzo Ribeiro', poloId: 'p-sesc', turmaId: 't-sesc-mix', beltColor: 'yellow', horasAcumuladas: 55, filiacoes: vcto, alertas: ['fck'] }),
  mkAluno({ id: 'a-carla', nome: 'Carla Menezes', poloId: 'p-sesc', turmaId: 't-sesc-mix', beltColor: 'white', horasAcumuladas: 30 }),

  // Garcia avançado
  mkAluno({ id: 'a-diego', nome: 'Diego Alves', poloId: 'p-garcia', turmaId: 't-garcia-mix', beltColor: 'purple', horasAcumuladas: 140, perfilAtleta: true }),
  mkAluno({ id: 'a-helena', nome: 'Helena Prado', poloId: 'p-garcia', turmaId: 't-garcia-mix', beltColor: 'orange', horasAcumuladas: 88, alertas: ['mensalidade'] }),
  mkAluno({ id: 'a-otavio', nome: 'Otávio Dias', poloId: 'p-garcia', turmaId: 't-garcia-mix', beltColor: 'green', horasAcumuladas: 110, filiacoes: venc, alertas: ['fck'] }),
];

export const EXAMES: Exame[] = [
  {
    id: 'e-2026-08',
    titulo: 'Exame de Graduação — Inverno 2026',
    data: '2026-08-23',
    local: 'Fundação Fritz Müller',
    taxaInscricao: 80,
    dataLimitePagamento: '2026-08-10',
    faixaAlvo: 'green',
  },
  {
    id: 'e-2026-12',
    titulo: 'Exame de Graduação — Verão 2026',
    data: '2026-12-13',
    local: 'SESC Blumenau',
    taxaInscricao: 90,
    dataLimitePagamento: '2026-11-30',
    faixaAlvo: 'purple',
  },
];

export const CAMPEONATOS: Campeonato[] = [
  {
    id: 'camp-jasc',
    titulo: 'JASC 2026 — Fase Regional',
    data: '2026-09-15',
    local: 'Joinville/SC',
    documentosExigidos: ['Autorização de viagem (menores)', 'Atestado médico'],
  },
  {
    id: 'camp-est',
    titulo: 'Estadual FCK 2026',
    data: '2026-10-04',
    local: 'Florianópolis/SC',
    documentosExigidos: ['Atestado médico', 'Anuidade FCK em dia'],
  },
];

export const INDICACOES: IndicacaoExame[] = [
  { alunoId: 'a-marina-al', exameId: 'e-2026-08', senseiId: 's-tanaka', data: '2026-07-01' },
];

export const FATURAS: Fatura[] = [
  { id: 'f1', alunoId: 'a-bruno', descricao: 'Mensalidade Julho/2026', valor: 150, vencimento: '2026-07-10', status: 'vencida', pixCopiaCola: '00020126KYUDAN-BRUNO-JUL' },
  { id: 'f2', alunoId: 'a-sofia', descricao: 'Mensalidade Julho/2026', valor: 120, vencimento: '2026-07-10', status: 'pendente', pixCopiaCola: '00020126KYUDAN-SOFIA-JUL' },
  { id: 'f3', alunoId: 'a-lucas', descricao: 'Mensalidade Julho/2026', valor: 180, vencimento: '2026-07-10', status: 'paga' },
  { id: 'f4', alunoId: 'a-rafael', descricao: 'Mensalidade Junho/2026', valor: 150, vencimento: '2026-06-10', status: 'vencida', pixCopiaCola: '00020126KYUDAN-RAFA-JUN' },
  { id: 'f5', alunoId: 'a-helena', descricao: 'Mensalidade Julho/2026', valor: 150, vencimento: '2026-07-10', status: 'vencida', pixCopiaCola: '00020126KYUDAN-HELE-JUL' },
  { id: 'f6', alunoId: 'a-lucas', descricao: 'Taxa Exame Inverno 2026', valor: 80, vencimento: '2026-08-10', status: 'pendente', pixCopiaCola: '00020126KYUDAN-EXAME-LUCAS' },
];

export const SPLITS: RegraSplit[] = [
  { poloId: 'p-fundacao', percentualSensei: 70 },
  { poloId: 'p-sesc', percentualSensei: 60 },
  { poloId: 'p-garcia', percentualSensei: 65 },
];

export const INVENTARIO: ItemInventario[] = [
  { id: 'i1', nome: 'Kimono ABK (patch)', categoria: 'kimono', tamanho: 'A2', quantidade: 12, estoqueMinimo: 5 },
  { id: 'i2', nome: 'Kimono ABK (patch)', categoria: 'kimono', tamanho: 'A4', quantidade: 3, estoqueMinimo: 5 },
  { id: 'i3', nome: 'Faixa Branca', categoria: 'faixa', tamanho: '2.6m', quantidade: 20, estoqueMinimo: 8 },
  { id: 'i4', nome: 'Faixa Verde', categoria: 'faixa', tamanho: '2.8m', quantidade: 2, estoqueMinimo: 6 },
  { id: 'i5', nome: 'Agasalho ABK', categoria: 'agasalho', tamanho: 'M', quantidade: 7, estoqueMinimo: 4 },
];

/** Frequências recentes (para calendário do responsável e diário). */
export const FREQUENCIAS: Frequencia[] = [
  { alunoId: 'a-bruno', turmaId: 't-fund-inf', data: '2026-07-06', presente: true },
  { alunoId: 'a-bruno', turmaId: 't-fund-inf', data: '2026-07-08', presente: true },
  { alunoId: 'a-bruno', turmaId: 't-fund-inf', data: '2026-07-13', presente: false },
  { alunoId: 'a-bruno', turmaId: 't-fund-inf', data: '2026-07-15', presente: true },
  { alunoId: 'a-sofia', turmaId: 't-fund-inf', data: '2026-07-06', presente: true },
  { alunoId: 'a-sofia', turmaId: 't-fund-inf', data: '2026-07-13', presente: true },
];
