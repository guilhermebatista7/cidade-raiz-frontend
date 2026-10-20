import { useMemo, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { buscarDadosCidade } from '../../../../../services/relatorio.service';
import { listarCidades, listarCidadesUsuario } from '../../../../../services/cidadeService';
import type { Cidade } from '../../../../../types';
import './AbaRelatorio.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFileLines, faNewspaper, faTree, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../../contexts/AuthContext';
import { queryKeys } from '../../../../../services/queryKeys';
import { SkeletonCard } from '../../../../components/Skeletons/SkeletonCard';
import { SkeletonTable } from '../../../../components/Skeletons/SkeletonTable';

type Status = 'SOLICITADO' | 'APROVADO' | 'RECUSADO' | 'AGUARDANDO_RETIRADA' | 'AGENDADO_PLANTIO' | 'CONCLUIDO';
type Atendimento = 'RETIRADA_LOCAL' | 'PLANTIO_AGENDADO';
type UsuarioResumo = { id: string; nome: string; email: string } | null;

type Requisicao = {
    id: string;
    nomeBeneficiario: string | null;
    status: Status;
    tipoAtendimento: Atendimento;
    bairro: string;
    cidadeEndereco: string;
    criadoEm: string;
    arvore: { id: string; nomePopular: string };
    criadoPor?: UsuarioResumo;
};

type DadosRelatorio = {
    periodo: { dataInicial: string; dataFinal: string };
    indicadores: { totalUsuarios: number; totalArvores: number; totalRequisicoes: number; totalPublicacoes: number };
    requisicoesPorStatus: Record<Status, number>;
    requisicoesPorAtendimento: Record<Atendimento, number>;
    requisicoes: Requisicao[];
    requisicoesPorDia?: { data: string; quantidade: number }[];
    arvoresMaisSolicitadas?: { id: string; nomePopular: string; quantidade: number }[];
    requisicoesPorBairro?: { bairro: string; quantidade: number; status: Record<Status, number>; }[];
};

type FiltroStatus = Status | 'TODOS';
const STATUS: { key: Status; label: string; color: string }[] = [
    { key: 'SOLICITADO', label: 'Solicitado', color: '#E6C77A' },
    { key: 'APROVADO', label: 'Aprovado', color: '#9BC7A5' },
    { key: 'RECUSADO', label: 'Recusado', color: '#E33636' },
    { key: 'AGUARDANDO_RETIRADA', label: 'Aguardando retirada', color: '#A8C7E3' },
    { key: 'AGENDADO_PLANTIO', label: 'Plantio agendado', color: '#B8ADE0' },
    { key: 'CONCLUIDO', label: 'Concluído', color: '#67C965' },
];

// Trabalhamos com datas YYYY-MM-DD, sem conversões implícitas para o fuso local.
const isoDia = (date: Date) => date.toISOString().slice(0, 10);
const diaBonito = (value: string) => `${value.slice(8, 10)}/${value.slice(5, 7)}`;
const dataBonita = (value: string) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
const nf = new Intl.NumberFormat('pt-BR');

function periodoInicial() {
    const hoje = new Date();
    const fim = isoDia(hoje);
    hoje.setUTCDate(hoje.getUTCDate() - 30);
    return { inicio: isoDia(hoje), fim };
}

function serieDiaria(dados: DadosRelatorio): { data: string; quantidade: number }[] {
    const inicio = new Date(`${dados.periodo.dataInicial}T00:00:00.000Z`);
    const fim = new Date(`${dados.periodo.dataFinal}T00:00:00.000Z`);
    if (!Number.isFinite(+inicio) || !Number.isFinite(+fim) || inicio > fim) return [];
    const mapa = new Map<string, number>();
    if (dados.requisicoesPorDia) {
        dados.requisicoesPorDia.forEach(d => mapa.set(d.data, d.quantidade));
    } else {
        dados.requisicoes.forEach(req => {
            const dia = req.criadoEm.slice(0, 10); // Agrupamento por dia UTC, igual ao filtro do backend.
            mapa.set(dia, (mapa.get(dia) ?? 0) + 1);
        });
    }
    const dias: { data: string; quantidade: number }[] = [];
    const cursor = new Date(inicio);
    while (cursor <= fim && dias.length < 366) {
        const dia = isoDia(cursor);
        dias.push({ data: dia, quantidade: mapa.get(dia) ?? 0 });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return dias;
}

function rankingArvores(dados: DadosRelatorio) {
    if (dados.arvoresMaisSolicitadas) {
        return [...dados.arvoresMaisSolicitadas].sort((a, b) => b.quantidade - a.quantidade).slice(0, 6);
    }
    const mapa = new Map<string, { id: string; nomePopular: string; quantidade: number }>();
    dados.requisicoes.forEach(req => {
        if (!req.arvore) return;
        const arvore = mapa.get(req.arvore.id);
        if (arvore) arvore.quantidade++;
        else mapa.set(req.arvore.id, { ...req.arvore, quantidade: 1 });
    });
    return [...mapa.values()].sort((a, b) => b.quantidade - a.quantidade).slice(0, 6);
}

function Painel({ titulo, subtitulo, children, extra }: { titulo: string; subtitulo: string; children: React.ReactNode; extra?: React.ReactNode }) {
    return <section className="cr-panel">
        <div className="cr-panel-heading"><div><h2>{titulo}</h2><p>{subtitulo}</p></div>{extra}</div>
        {children}
    </section>;
}

export function AbaRelatorio() {
    const [datas, setDatas] = useState(periodoInicial);
    const [cidadeFiltro, setCidadeFiltro] = useState('');
    const [role, setRole] = useState('');
    const [statusFiltro, setStatusFiltro] = useState<FiltroStatus>('TODOS');
    const [busca, setBusca] = useState('');
    const [pagina, setPagina] = useState(1);
    const porPagina = 6;

    const queryClient = useQueryClient();
    const { usuario } = useAuth(); //Pega contexto fazer nova req na API

    const isGlobal = usuario?.role === 'GLOBAL';

    const { data: cidades = [] } = useQuery<Cidade[]>({
        queryKey: isGlobal ? queryKeys.cidades.todas : queryKeys.cidades.porUsuario,
        queryFn: () => {
            if (isGlobal) {
                return listarCidades();
            }

            return listarCidadesUsuario();
        },
        enabled: isGlobal, // Só executa se for admin Global
    })

    // Se for global e não escolheu cidade ainda, pega a primeira cidade da lista
    const cidadeAtivaId = isGlobal ? (cidadeFiltro || cidades[0]?.id || "") : "";

    const { data: dados, isLoading: loading, error } = useQuery<DadosRelatorio>({
        queryKey: queryKeys.relatorios.porCidade(datas.inicio, datas.fim, isGlobal ? cidadeAtivaId : undefined),
        queryFn: () => buscarDadosCidade(datas.inicio, datas.fim, isGlobal ? cidadeAtivaId : undefined),
    })

    const diarios = useMemo(() => dados ? serieDiaria(dados) : [], [dados]);
    const arvores = useMemo(() => dados ? rankingArvores(dados) : [], [dados]);
    const bairros = useMemo(() => dados?.requisicoesPorBairro ?? [], [dados]);
    const linhas = useMemo(() => {
        if (!dados) return [];
        const termo = busca.toLocaleLowerCase('pt-BR').trim();
        return dados.requisicoes.filter(req => {
            const statusOk = statusFiltro === 'TODOS' || req.status === statusFiltro;
            const texto = [req.nomeBeneficiario, req.arvore?.nomePopular, req.bairro, req.cidadeEndereco].join(' ').toLocaleLowerCase('pt-BR');
            return statusOk && (!termo || texto.includes(termo));
        });
    }, [dados, statusFiltro, busca]);
    const paginas = Math.max(1, Math.ceil(linhas.length / porPagina));
    const exibidas = linhas.slice((pagina - 1) * porPagina, pagina * porPagina);
    const n = dados?.indicadores;
    const statusPie = STATUS.map((s) => ({ id: s.key, label: s.label, value: dados?.requisicoesPorStatus[s.key] ?? 0, color: s.color })).filter(s => s.value > 0);
    const tipoPie = [
        { id: 'PLANTIO_AGENDADO', label: 'Plantio agendado', value: dados?.requisicoesPorAtendimento.PLANTIO_AGENDADO ?? 0, color: '#2F7958' },
        { id: 'RETIRADA_LOCAL', label: 'Retirada local', value: dados?.requisicoesPorAtendimento.RETIRADA_LOCAL ?? 0, color: '#B6CDAF' },
    ].filter(t => t.value > 0);
    const indicadores: {
        label: string;
        valor: number;
        icon: IconDefinition;
        desc: string;
        color: string;
    }[] = [
            {
                label: "Requisições",
                valor: n?.totalRequisicoes ?? 0,
                icon: faFileLines,
                desc: "Solicitações criadas",
                color: "sage",
            },
            {
                label: "Publicações",
                valor: n?.totalPublicacoes ?? 0,
                icon: faNewspaper,
                desc: "Conteúdos publicados",
                color: "sand",
            },
            {
                label: "Espécies cadastradas",
                valor: n?.totalArvores ?? 0,
                icon: faTree,
                desc: "Novos cadastros de árvores",
                color: "mint",
            },
            {
                label: "Novos usuários",
                valor: n?.totalUsuarios ?? 0,
                icon: faUsers,
                desc: "Cadastros no período",
                color: "lavender",
            },
        ];

    return <main className="cr-dashboard">
        <header className="cr-headline">
            <div><h1>Dash<span>board</span></h1><p>Acompanhe as solicitações, a comunidade e o impacto do plantio urbano.</p></div>
            <span className="cr-period-label">RELATÓRIO DE ATIVIDADES</span>
        </header>

        <div className="cr-filterbar">
            <div className="cr-field"><label htmlFor="cr-inicio">De</label><input id="cr-inicio" type="date" value={datas.inicio} max={datas.fim} onChange={e => setDatas(d => ({ ...d, inicio: e.target.value }))} /></div>
            <div className="cr-field"><label htmlFor="cr-fim">Até</label><input id="cr-fim" type="date" min={datas.inicio} value={datas.fim} onChange={e => setDatas(d => ({ ...d, fim: e.target.value }))} /></div>
            {isGlobal && <div className="cr-field cr-city"><label htmlFor="cr-cidade">Cidade</label><select id="cr-cidade" value={cidadeAtivaId} onChange={e => setCidadeFiltro(e.target.value)}>{cidades.map(c => <option key={c.id} value={c.id}>{c.nome} / {c.uf}</option>)}</select></div>}
            <div className="cr-filter-hint">Os indicadores consideram o período selecionado</div>
        </div>

        {error && <div className="cr-alert" role="alert">{error.message}</div>}
        {loading && <SkeletonTable linhas={6} />}
        {!loading && !dados && !error && <div className="cr-empty">Selecione uma cidade para visualizar o relatório.</div>}

        {dados && <div className={loading ? 'cr-body cr-dimmed' : 'cr-body'}>
            <div className="cr-kpis">


                {indicadores.map((k) => (
                    <article
                        className={`cr-kpi ${k.color}`}
                        key={k.label}
                    >
                        <div className="cr-kpi-top">
                            <span>{k.label}</span>

                            <span className="cr-kpi-icon">
                                <FontAwesomeIcon icon={k.icon} />
                            </span>
                        </div>

                        <strong>{nf.format(k.valor)}</strong>

                        <small>{k.desc}</small>
                    </article>
                ))}            </div>

            <div className="cr-chart-grid">
                <div className="cr-wide"><Painel titulo="Movimento de solicitações" subtitulo="Novas requisições por dia dentro do período selecionado" extra={<span className="cr-chip">{nf.format(n?.totalRequisicoes ?? 0)} no período</span>}>
                    {diarios.length ? <LineChart height={285} xAxis={[{ data: diarios.map(d => diaBonito(d.data)), scaleType: 'point', tickLabelStyle: { fontSize: 11 } }]} yAxis={[{ min: 0, tickMinStep: 1, }]} series={[{ id: 'solicitacoes', label: 'Requisições', data: diarios.map(d => d.quantidade), color: '#739d1e', area: true, showMark: diarios.length <= 12, curve: 'monotoneX' }]} grid={{ horizontal: true }} margin={{ left: 38, right: 12, top: 18, bottom: 30 }} /> : <p className="cr-chart-empty">Sem datas para exibir.</p>}
                </Painel></div>
                <Painel titulo="Situação das solicitações" subtitulo="Distribuição pelo status atual">
                    {statusPie.length ? <div className="cr-pie-layout"><PieChart series={[{ data: statusPie, innerRadius: 55, outerRadius: 88, paddingAngle: 3, cornerRadius: 5 }]} width={200} height={240} hideLegend /><div className="cr-legend">{statusPie.map(s => <div key={s.id}><span className="cr-color" style={{ backgroundColor: s.color }} /> <span>{s.label}</span><strong>{s.value}</strong></div>)}</div></div> : <p className="cr-chart-empty">Nenhuma solicitação neste período.</p>}
                </Painel>
                <Painel titulo="Espécies mais desejadas" subtitulo="Ranking das árvores presentes nas requisições">
                    {arvores.length ? <BarChart height={Math.max(230, arvores.length * 48)} layout="horizontal" yAxis={[{ data: arvores.map(a => a.nomePopular), scaleType: 'band', width: 122, tickLabelStyle: { fontSize: 11 } }]} xAxis={[{ min: 0, tickMinStep: 1, }]} series={[{ data: arvores.map(a => a.quantidade), label: 'Solicitações', color: '#739d1e' }]} grid={{ vertical: true }} margin={{ left: 7, right: 10, top: 15, bottom: 25 }} /> : <p className="cr-chart-empty">Nenhuma árvore solicitada neste período.</p>}
                </Painel>
                <Painel titulo="Como a cidade participa" subtitulo="Tipos de atendimento escolhidos">
                    {tipoPie.length ? <div className="cr-attendance"><PieChart series={[{ data: tipoPie, innerRadius: 55, outerRadius: 88, paddingAngle: 3, cornerRadius: 5 }]} height={205} hideLegend /><div className="cr-attendance-list">{tipoPie.map(t => <div key={t.id}><span className="cr-color" style={{ background: t.color }} /> <span>{t.label}</span><strong>{t.value}</strong></div>)}</div></div> : <p className="cr-chart-empty">Sem atendimentos registrados.</p>}
                </Painel>
                <div className="cr-wide-bairro">
                    <Painel
                        titulo="Requisições por bairro"
                        subtitulo="Distribuição das solicitações por status"
                    >
                        {bairros.length > 0 ? (
                            <div className="cr-bairros-chart">
                                <BarChart
                                    layout="vertical"

                                    height={400}

                                    xAxis={[
                                        {
                                            data: bairros.map(item => item.bairro),
                                            scaleType: "band",
                                            tickLabelStyle: {
                                                fontSize: 11,
                                                angle: -35,
                                                textAnchor: "end",
                                            },
                                            height: 115,
                                        },
                                    ]}

                                    yAxis={[
                                        {
                                            min: 0,
                                            tickMinStep: 1,
                                        },
                                    ]}

                                    series={STATUS.map(status => ({
                                        id: status.key,
                                        data: bairros.map(
                                            bairro => bairro.status[status.key]
                                        ),
                                        label: status.label,
                                        color: status.color,
                                        stack: "total",
                                        valueFormatter: (value) =>
                                            `${value ?? 0} requisição(ões)`,
                                    }))}

                                    grid={{ horizontal: true }}

                                    margin={{
                                        left: 45,
                                        right: 20,
                                        top: 20,
                                        bottom: 10,
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="cr-chart-empty">
                                Nenhum bairro cadastrado para exibição.
                            </p>
                        )}
                    </Painel>
                </div>
            </div>

            <section className="cr-panel cr-table-panel">
                <div className="cr-panel-heading"><div><h2>Requisições recentes</h2><p>Explore os pedidos realizados no período</p></div><span className="cr-chip">{linhas.length} resultados</span></div>
                <div className="cr-table-filters"><input aria-label="Buscar requisições" placeholder="Buscar por cidadão, espécie ou bairro..." value={busca} onChange={e => { setBusca(e.target.value); setPagina(1); }} /><select aria-label="Filtrar por status" value={statusFiltro} onChange={e => { setStatusFiltro(e.target.value as FiltroStatus); setPagina(1); }}><option value="TODOS">Todos os status</option>{STATUS.map(s => <option value={s.key} key={s.key}>{s.label}</option>)}</select></div>
                <div className="cr-table-scroll"><table><thead><tr><th>CÓDIGO</th><th>CIDADÃO</th><th>ESPÉCIE</th><th>LOCALIDADE</th><th>ATENDIMENTO</th><th>STATUS</th><th>DATA</th></tr></thead><tbody>{exibidas.map(r => <tr key={r.id}><td>{r.id.substring(0, 8).toUpperCase() || 'Não informado'}</td><td><strong>{r.nomeBeneficiario || r.criadoPor?.nome || 'Não informado'}</strong></td><td>{r.arvore?.nomePopular ?? '—'}</td><td>{r.bairro}, {r.cidadeEndereco}</td><td>{r.tipoAtendimento === 'RETIRADA_LOCAL' ? 'Retirada local' : 'Plantio agendado'}</td><td><span className={`cr-status cr-status-${r.status.toLowerCase()}`}>{STATUS.find(s => s.key === r.status)?.label ?? r.status}</span></td><td>{dataBonita(r.criadoEm)}</td></tr>)}{exibidas.length === 0 && <tr><td className="cr-no-results" colSpan={6}>Nenhuma requisição encontrada.</td></tr>}</tbody></table></div>
                <div className="cr-table-footer"><span>Mostrando {linhas.length ? (pagina - 1) * porPagina + 1 : 0}–{Math.min(pagina * porPagina, linhas.length)} de {linhas.length}</span><div><button type="button" disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>Anterior</button><span>{pagina} / {paginas}</span><button type="button" disabled={pagina >= paginas} onClick={() => setPagina(p => p + 1)}>Próxima</button></div></div>
            </section>
            <p className="cr-footnote">* Métricas de usuários, espécies e publicações referem-se a registros criados no período. Status corresponde à situação atual das requisições criadas nesse intervalo; datas são agrupadas em UTC.</p>
        </div>}
    </main>;
}
