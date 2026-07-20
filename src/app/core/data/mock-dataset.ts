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
 *
 * Modelado para SIMULAR EVENTOS REAIS:
 *  - múltiplos usuários por role (personas selecionáveis alinhadas a entidades de domínio);
 *  - alunos aptos por carência para cada exame (Kyu e Dan);
 *  - atletas de rendimento para convocação a campeonatos;
 *  - inadimplência, anuidades FCK/CBK vencidas, indicações pendentes e estoque baixo.
 *
 * Datas fixas (sem Date.now) para builds determinísticos.
 */

const reg: Filiacoes = { abk: 'regular', fck: 'regular', cbk: 'regular' };
const venc: Filiacoes = { abk: 'regular', fck: 'vencido', cbk: 'regular' };
const vcto: Filiacoes = { abk: 'regular', fck: 'vencendo', cbk: 'regular' };
const vencCbk: Filiacoes = { abk: 'vencido', fck: 'vencido', cbk: 'vencido' };

function kihon(nome: string, dominado = false) {
  return { id: `k-${nome}`, categoria: 'kihon' as const, nome, dominado };
}
function kata(nome: string, dominado = false) {
  return { id: `t-${nome}`, categoria: 'kata' as const, nome, dominado };
}
function kumite(nome: string, dominado = false) {
  return { id: `u-${nome}`, categoria: 'kumite' as const, nome, dominado };
}

// ============================================================================
// USUÁRIOS / PERSONAS (uma seleção por role; ids alinhados às entidades)
//  - Aluno:      id == Aluno.id
//  - Responsável:id == responsavelId dos dependentes
//  - Professor:  id == senseiId das turmas
// ============================================================================
export const USUARIOS: Usuario[] = [
  // Gestão
  { id: 'u-gestao', nome: 'Diretoria ABK', role: 'gestao' },
  { id: 'u-coord', nome: 'Coordenação Técnica', role: 'gestao' },
  // Professores (senseis)
  { id: 's-tanaka', nome: 'Sensei Tanaka', role: 'professor' },
  { id: 's-marina', nome: 'Sensei Marina', role: 'professor' },
  { id: 's-ricardo', nome: 'Sensei Ricardo', role: 'professor' },
  { id: 's-yuki', nome: 'Sensei Yuki', role: 'professor' },
  // Alunos adultos (respondem por si)
  { id: 'a-lucas', nome: 'Lucas Hillesheim', role: 'aluno' },
  { id: 'a-marina-al', nome: 'Marina Costa', role: 'aluno' },
  { id: 'a-rafael', nome: 'Rafael Nunes', role: 'aluno' },
  { id: 'a-diego', nome: 'Diego Alves', role: 'aluno' },
  { id: 'a-otavio', nome: 'Otávio Dias', role: 'aluno' },
  // Responsáveis (familiares)
  { id: 'r-claudia', nome: 'Cláudia Souza', role: 'responsavel' },
  { id: 'r-marcos', nome: 'Marcos Lima', role: 'responsavel' },
  { id: 'r-ana', nome: 'Ana Prado', role: 'responsavel' },
];

// ============================================================================
// PÓLOS
// ============================================================================
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
    crescimentoMes: 5,
  },
  {
    id: 'p-garcia',
    nome: 'Clube Garcia',
    endereco: 'Rua Amazonas, 55 — Garcia, Blumenau',
    capacidadeMaxima: 40,
    senseiIds: ['s-ricardo'],
    crescimentoMes: -4,
  },
  {
    id: 'p-proeb',
    nome: 'Ginásio PROEB',
    endereco: 'Rua Alberto Stein, 199 — Velha, Blumenau',
    capacidadeMaxima: 70,
    senseiIds: ['s-yuki', 's-tanaka'],
    crescimentoMes: 12,
  },
];

// ============================================================================
// TURMAS
// ============================================================================
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
    id: 't-sesc-comp',
    poloId: 'p-sesc',
    senseiId: 's-marina',
    nome: 'Equipe de Competição',
    horarios: [
      { diaSemana: 3, inicio: '20:00', fim: '21:30' },
      { diaSemana: 6, inicio: '09:00', fim: '11:00' },
    ],
    alunoIds: ['a-camila', 'a-thiago', 'a-bia'],
  },
  {
    id: 't-garcia-mix',
    poloId: 'p-garcia',
    senseiId: 's-ricardo',
    nome: 'Misto Avançado',
    horarios: [{ diaSemana: 6, inicio: '10:00', fim: '11:30' }],
    alunoIds: ['a-diego', 'a-helena', 'a-otavio', 'a-marcelo'],
  },
  {
    id: 't-proeb-inf',
    poloId: 'p-proeb',
    senseiId: 's-yuki',
    nome: 'Infantil PROEB',
    horarios: [
      { diaSemana: 2, inicio: '17:30', fim: '18:30' },
      { diaSemana: 4, inicio: '17:30', fim: '18:30' },
    ],
    alunoIds: ['a-lara', 'a-gustavo', 'a-nina'],
  },
  {
    id: 't-proeb-adt',
    poloId: 'p-proeb',
    senseiId: 's-yuki',
    nome: 'Adulto PROEB',
    horarios: [
      { diaSemana: 1, inicio: '20:00', fim: '21:30' },
      { diaSemana: 5, inicio: '20:00', fim: '21:30' },
    ],
    alunoIds: ['a-fernanda', 'a-paulo', 'a-rodrigo'],
  },
];

function mkAluno(
  a: Partial<Aluno> & Pick<Aluno, 'id' | 'nome' | 'poloId' | 'turmaId' | 'beltColor'>,
): Aluno {
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

// ============================================================================
// ALUNOS (~22) — variados para simulação
// ============================================================================
export const ALUNOS: Aluno[] = [
  // --- Infantil Fundação (dependentes) ---
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
      { id: 'o2', data: '2026-06-15', autorNome: 'Sensei Tanaka', tag: 'observacao', texto: 'Evoluindo na coordenação motora.' },
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
    responsavelId: 'r-marcos',
    alertas: ['medico'],
    curriculo: [kihon('Zuki (soco)', true), kihon('Gedan Barai', false)],
    ocorrencias: [{ id: 'o3', data: '2026-05-20', autorNome: 'Sensei Tanaka', tag: 'lesao', texto: 'Torção leve no tornozelo — liberado com cautela.' }],
  }),

  // --- Adulto / Rendimento Fundação ---
  mkAluno({
    id: 'a-lucas',
    nome: 'Lucas Hillesheim',
    poloId: 'p-fundacao',
    turmaId: 't-fund-adt',
    beltColor: 'brown',
    dataNascimento: '1995-11-05',
    horasAcumuladas: 205, // apto ao Dan
    perfilAtleta: true,
    curriculo: [
      kihon('Kihon combinado', true),
      kata('Bassai Dai', true),
      kata('Kanku Dai', true),
      kata('Jion', false),
      kumite('Jiyu Kumite', true),
    ],
    graduacoes: [
      { beltColor: 'white', data: '2018-03-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'yellow', data: '2019-04-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'red', data: '2020-05-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'orange', data: '2021-06-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'green', data: '2022-08-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'purple', data: '2024-03-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'brown', data: '2025-09-01', senseiNome: 'Sensei Tanaka' },
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
    horasAcumuladas: 125, // apta à roxa
    filiacoes: vcto,
    perfilAtleta: true,
    alertas: ['fck'],
    curriculo: [kata('Heian Godan', true), kata('Tekki Shodan', true), kumite('Kihon Ippon', true)],
    graduacoes: [
      { beltColor: 'white', data: '2020-02-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'yellow', data: '2021-03-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'red', data: '2022-04-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'orange', data: '2023-06-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'green', data: '2024-10-01', senseiNome: 'Sensei Tanaka' },
    ],
    competicoes: [{ id: 'c3', evento: 'JASC 2025', data: '2025-11-08', colocacao: '2º', medalha: 'prata' }],
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
    graduacoes: [
      { beltColor: 'white', data: '2023-03-01', senseiNome: 'Sensei Tanaka' },
      { beltColor: 'yellow', data: '2024-05-01', senseiNome: 'Sensei Tanaka' },
    ],
  }),

  // --- Misto SESC iniciante ---
  mkAluno({ id: 'a-julia', nome: 'Júlia Fernandes', poloId: 'p-sesc', turmaId: 't-sesc-mix', beltColor: 'white', horasAcumuladas: 22 }),
  mkAluno({ id: 'a-enzo', nome: 'Enzo Ribeiro', poloId: 'p-sesc', turmaId: 't-sesc-mix', beltColor: 'yellow', horasAcumuladas: 55, responsavelId: 'r-marcos', filiacoes: vcto, alertas: ['fck'] }),
  mkAluno({ id: 'a-carla', nome: 'Carla Menezes', poloId: 'p-sesc', turmaId: 't-sesc-mix', beltColor: 'white', horasAcumuladas: 44 }), // apta à amarela

  // --- Equipe de Competição SESC ---
  mkAluno({
    id: 'a-camila',
    nome: 'Camila Rocha',
    poloId: 'p-sesc',
    turmaId: 't-sesc-comp',
    beltColor: 'orange',
    dataNascimento: '2003-05-09',
    horasAcumuladas: 105, // apta à verde
    perfilAtleta: true,
    curriculo: [kata('Heian Yondan', true), kumite('Sanbon Kumite', true)],
    competicoes: [{ id: 'c4', evento: 'Estadual FCK 2025', data: '2025-05-18', colocacao: '1º', medalha: 'ouro' }],
  }),
  mkAluno({ id: 'a-thiago', nome: 'Thiago Alves', poloId: 'p-sesc', turmaId: 't-sesc-comp', beltColor: 'green', horasAcumuladas: 118, perfilAtleta: true }),
  mkAluno({
    id: 'a-bia',
    nome: 'Beatriz Lopes',
    poloId: 'p-sesc',
    turmaId: 't-sesc-comp',
    beltColor: 'purple',
    horasAcumuladas: 145,
    perfilAtleta: true,
    competicoes: [
      { id: 'c5', evento: 'JASC 2025', data: '2025-11-08', colocacao: '1º', medalha: 'ouro' },
      { id: 'c6', evento: 'Brasileiro CBK 2025', data: '2025-09-20', colocacao: '5º' },
    ],
  }),

  // --- Misto Avançado Garcia ---
  mkAluno({
    id: 'a-diego',
    nome: 'Diego Alves',
    poloId: 'p-garcia',
    turmaId: 't-garcia-mix',
    beltColor: 'purple',
    dataNascimento: '1998-03-17',
    horasAcumuladas: 150,
    perfilAtleta: true,
    curriculo: [kata('Bassai Dai', true), kata('Empi', false), kumite('Jiyu Kumite', true)],
    graduacoes: [
      { beltColor: 'green', data: '2023-04-01', senseiNome: 'Sensei Ricardo' },
      { beltColor: 'purple', data: '2025-02-01', senseiNome: 'Sensei Ricardo' },
    ],
    competicoes: [{ id: 'c7', evento: 'OLESC 2025', data: '2025-06-14', colocacao: '2º', medalha: 'prata' }],
  }),
  mkAluno({ id: 'a-helena', nome: 'Helena Prado', poloId: 'p-garcia', turmaId: 't-garcia-mix', beltColor: 'orange', horasAcumuladas: 110, alertas: ['mensalidade'] }), // apta à verde
  mkAluno({
    id: 'a-otavio',
    nome: 'Otávio Dias',
    poloId: 'p-garcia',
    turmaId: 't-garcia-mix',
    beltColor: 'green',
    dataNascimento: '2000-12-02',
    horasAcumuladas: 130, // apto à roxa
    filiacoes: venc,
    alertas: ['fck'],
    perfilAtleta: true,
    curriculo: [kata('Heian Godan', true), kata('Tekki Shodan', false)],
  }),
  mkAluno({ id: 'a-marcelo', nome: 'Marcelo Reis', poloId: 'p-garcia', turmaId: 't-garcia-mix', beltColor: 'red', horasAcumuladas: 82 }),

  // --- Infantil PROEB (dependentes) ---
  mkAluno({ id: 'a-lara', nome: 'Lara Prado', poloId: 'p-proeb', turmaId: 't-proeb-inf', beltColor: 'white', dataNascimento: '2017-08-19', horasAcumuladas: 25, responsavelId: 'r-ana', curriculo: [kihon('Postura Zenkutsu', true)] }),
  mkAluno({ id: 'a-gustavo', nome: 'Gustavo Melo', poloId: 'p-proeb', turmaId: 't-proeb-inf', beltColor: 'yellow', dataNascimento: '2015-11-03', horasAcumuladas: 48 }),
  mkAluno({ id: 'a-nina', nome: 'Nina Barros', poloId: 'p-proeb', turmaId: 't-proeb-inf', beltColor: 'white', dataNascimento: '2016-07-25', horasAcumuladas: 44 }), // apta à amarela

  // --- Adulto PROEB ---
  mkAluno({ id: 'a-fernanda', nome: 'Fernanda Luz', poloId: 'p-proeb', turmaId: 't-proeb-adt', beltColor: 'green', horasAcumuladas: 122, perfilAtleta: true }), // apta à roxa
  mkAluno({ id: 'a-paulo', nome: 'Paulo Krieger', poloId: 'p-proeb', turmaId: 't-proeb-adt', beltColor: 'orange', horasAcumuladas: 95, filiacoes: vcto, alertas: ['fck'] }),
  mkAluno({ id: 'a-rodrigo', nome: 'Rodrigo Sell', poloId: 'p-proeb', turmaId: 't-proeb-adt', beltColor: 'brown', horasAcumuladas: 180, filiacoes: vencCbk, alertas: ['fck'] }),
];

// ============================================================================
// EXAMES (aptos por carência garantidos no dataset)
// ============================================================================
export const EXAMES: Exame[] = [
  {
    id: 'e-2026-08',
    titulo: 'Exame de Graduação — Inverno 2026 (Verde)',
    data: '2026-08-23',
    local: 'Fundação Fritz Müller',
    taxaInscricao: 80,
    dataLimitePagamento: '2026-08-10',
    faixaAlvo: 'green', // aptos: laranja >=100h (a-camila, a-helena)
  },
  {
    id: 'e-2026-10',
    titulo: 'Exame de Graduação — Primavera 2026 (Amarela)',
    data: '2026-10-11',
    local: 'Ginásio PROEB',
    taxaInscricao: 70,
    dataLimitePagamento: '2026-09-28',
    faixaAlvo: 'yellow', // aptos: branca >=40h (a-carla, a-nina)
  },
  {
    id: 'e-2026-12',
    titulo: 'Exame de Graduação — Verão 2026 (Roxa)',
    data: '2026-12-13',
    local: 'SESC Blumenau',
    taxaInscricao: 90,
    dataLimitePagamento: '2026-11-30',
    faixaAlvo: 'purple', // aptos: verde >=120h (a-marina-al, a-otavio, a-fernanda)
  },
  {
    id: 'e-2027-03-dan',
    titulo: 'Exame de Faixa Preta — Shodan 2027',
    data: '2027-03-21',
    local: 'Fundação Fritz Müller',
    taxaInscricao: 250,
    dataLimitePagamento: '2027-02-20',
    faixaAlvo: 'black', // aptos: marrom >=200h (a-lucas)
  },
];

// ============================================================================
// CAMPEONATOS
// ============================================================================
export const CAMPEONATOS: Campeonato[] = [
  {
    id: 'camp-jasc',
    titulo: 'JASC 2026 — Fase Regional',
    data: '2026-09-15',
    local: 'Joinville/SC',
    documentosExigidos: ['Autorização de viagem (menores)', 'Atestado médico', 'Anuidade FCK em dia'],
  },
  {
    id: 'camp-est',
    titulo: 'Estadual FCK 2026',
    data: '2026-10-04',
    local: 'Florianópolis/SC',
    documentosExigidos: ['Atestado médico', 'Anuidade FCK em dia'],
  },
  {
    id: 'camp-brasileiro',
    titulo: 'Brasileiro CBK 2026',
    data: '2026-11-21',
    local: 'São Paulo/SP',
    documentosExigidos: ['Atestado médico', 'Anuidade CBK em dia', 'Autorização de viagem (menores)'],
  },
];

// Indicações já submetidas pelos senseis, aguardando validação da Gestão.
export const INDICACOES: IndicacaoExame[] = [
  { alunoId: 'a-marina-al', exameId: 'e-2026-12', senseiId: 's-tanaka', data: '2026-07-01' },
  { alunoId: 'a-otavio', exameId: 'e-2026-12', senseiId: 's-ricardo', data: '2026-07-03' },
  { alunoId: 'a-camila', exameId: 'e-2026-08', senseiId: 's-marina', data: '2026-07-05' },
];

// ============================================================================
// FINANCEIRO
// ============================================================================
export const FATURAS: Fatura[] = [
  { id: 'f1', alunoId: 'a-bruno', descricao: 'Mensalidade Julho/2026', valor: 150, vencimento: '2026-07-10', status: 'vencida', pixCopiaCola: '00020126KYUDAN-BRUNO-JUL' },
  { id: 'f2', alunoId: 'a-sofia', descricao: 'Mensalidade Julho/2026', valor: 120, vencimento: '2026-07-10', status: 'pendente', pixCopiaCola: '00020126KYUDAN-SOFIA-JUL' },
  { id: 'f3', alunoId: 'a-pedro', descricao: 'Mensalidade Julho/2026', valor: 120, vencimento: '2026-07-10', status: 'paga' },
  { id: 'f4', alunoId: 'a-lucas', descricao: 'Mensalidade Julho/2026', valor: 180, vencimento: '2026-07-10', status: 'paga' },
  { id: 'f5', alunoId: 'a-lucas', descricao: 'Taxa Exame Shodan 2027', valor: 250, vencimento: '2027-02-20', status: 'pendente', pixCopiaCola: '00020126KYUDAN-DAN-LUCAS' },
  { id: 'f6', alunoId: 'a-rafael', descricao: 'Mensalidade Junho/2026', valor: 150, vencimento: '2026-06-10', status: 'vencida', pixCopiaCola: '00020126KYUDAN-RAFA-JUN' },
  { id: 'f7', alunoId: 'a-rafael', descricao: 'Mensalidade Julho/2026', valor: 150, vencimento: '2026-07-10', status: 'vencida', pixCopiaCola: '00020126KYUDAN-RAFA-JUL' },
  { id: 'f8', alunoId: 'a-helena', descricao: 'Mensalidade Julho/2026', valor: 150, vencimento: '2026-07-10', status: 'vencida', pixCopiaCola: '00020126KYUDAN-HELE-JUL' },
  { id: 'f9', alunoId: 'a-otavio', descricao: 'Mensalidade Junho/2026', valor: 150, vencimento: '2026-06-10', status: 'vencida', pixCopiaCola: '00020126KYUDAN-OTAV-JUN' },
  { id: 'f10', alunoId: 'a-enzo', descricao: 'Mensalidade Julho/2026', valor: 120, vencimento: '2026-07-10', status: 'pendente', pixCopiaCola: '00020126KYUDAN-ENZO-JUL' },
  { id: 'f11', alunoId: 'a-marcelo', descricao: 'Mensalidade Julho/2026', valor: 150, vencimento: '2026-07-10', status: 'pendente', pixCopiaCola: '00020126KYUDAN-MARC-JUL' },
  { id: 'f12', alunoId: 'a-camila', descricao: 'Mensalidade Julho/2026', valor: 160, vencimento: '2026-07-10', status: 'paga' },
  { id: 'f13', alunoId: 'a-bia', descricao: 'Mensalidade Julho/2026', valor: 160, vencimento: '2026-07-10', status: 'paga' },
  { id: 'f14', alunoId: 'a-diego', descricao: 'Mensalidade Julho/2026', valor: 150, vencimento: '2026-07-10', status: 'pendente', pixCopiaCola: '00020126KYUDAN-DIEG-JUL' },
  { id: 'f15', alunoId: 'a-lara', descricao: 'Mensalidade Julho/2026', valor: 120, vencimento: '2026-07-10', status: 'pendente', pixCopiaCola: '00020126KYUDAN-LARA-JUL' },
  { id: 'f16', alunoId: 'a-rodrigo', descricao: 'Mensalidade Junho/2026', valor: 150, vencimento: '2026-06-10', status: 'vencida', pixCopiaCola: '00020126KYUDAN-RODR-JUN' },
];

export const SPLITS: RegraSplit[] = [
  { poloId: 'p-fundacao', percentualSensei: 70 },
  { poloId: 'p-sesc', percentualSensei: 60 },
  { poloId: 'p-garcia', percentualSensei: 65 },
  { poloId: 'p-proeb', percentualSensei: 55 },
];

export const INVENTARIO: ItemInventario[] = [
  { id: 'i1', nome: 'Kimono ABK (patch)', categoria: 'kimono', tamanho: 'A2', quantidade: 12, estoqueMinimo: 5 },
  { id: 'i2', nome: 'Kimono ABK (patch)', categoria: 'kimono', tamanho: 'A4', quantidade: 3, estoqueMinimo: 5 },
  { id: 'i3', nome: 'Faixa Branca', categoria: 'faixa', tamanho: '2.6m', quantidade: 20, estoqueMinimo: 8 },
  { id: 'i4', nome: 'Faixa Verde', categoria: 'faixa', tamanho: '2.8m', quantidade: 2, estoqueMinimo: 6 },
  { id: 'i5', nome: 'Faixa Roxa', categoria: 'faixa', tamanho: '2.8m', quantidade: 4, estoqueMinimo: 5 },
  { id: 'i6', nome: 'Agasalho ABK', categoria: 'agasalho', tamanho: 'M', quantidade: 7, estoqueMinimo: 4 },
  { id: 'i7', nome: 'Agasalho ABK', categoria: 'agasalho', tamanho: 'G', quantidade: 1, estoqueMinimo: 4 },
];

// ============================================================================
// FREQUÊNCIAS (histórico para calendário/relatórios)
// ============================================================================
function freqMes(alunoId: string, turmaId: string, dias: number[], ausentes: number[] = []): Frequencia[] {
  return dias.map((d) => ({
    alunoId,
    turmaId,
    data: `2026-07-${String(d).padStart(2, '0')}`,
    presente: !ausentes.includes(d),
  }));
}

export const FREQUENCIAS: Frequencia[] = [
  ...freqMes('a-bruno', 't-fund-inf', [1, 3, 6, 8, 13, 15, 20], [13]),
  ...freqMes('a-sofia', 't-fund-inf', [1, 6, 8, 13, 15], [8]),
  ...freqMes('a-pedro', 't-fund-inf', [1, 3, 8, 15, 20], [1, 20]),
  ...freqMes('a-lara', 't-proeb-inf', [2, 4, 7, 9, 14, 16], [9]),
  ...freqMes('a-gustavo', 't-proeb-inf', [2, 7, 9, 14, 16, 21]),
  ...freqMes('a-nina', 't-proeb-inf', [2, 4, 9, 16], [4]),
];
