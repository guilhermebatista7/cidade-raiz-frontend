import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faPagelines } from '@fortawesome/free-brands-svg-icons';
import { HeaderVideo } from '../../components/HeaderVideo/HeaderVideo';

import { CardBlog } from '../../components/CardBlog/CardBlog';

import { listarPublicacoes } from '../../../services/blogService';
import type { Cidade, CursorPublicacao, Publicacao } from '../../../types';
import blogImg from '../../media/blogHeader.png';
import userImg from '../../media/user.png';
import './BlogPage.css';
import { listarCidadesAtivas } from '../../../services/cidadeService';
export const BlogPage = () => {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [nextCursor, setNextCursor] =
    useState<CursorPublicacao | null>(null);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const [cidadeFiltro, setCidadeFiltro] = useState('');
  const [minhasPublicacoes, setMinhasPublicacoes] = useState(false);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  // Cada combinação de filtros tem seu próprio cancelamento.
  const consultaAtual = useRef<AbortController | null>(null);

  // Impede dois cliques rápidos de iniciarem a mesma página.
  const carregandoMaisRef = useRef(false);

  const cancelarConsultaAtual = () => {
    consultaAtual.current?.abort();
  };

  const buscarPubliCidade = (e: ChangeEvent<HTMLSelectElement>) => {
    cancelarConsultaAtual();
    setCidadeFiltro(e.target.value);
  };

  const alterarMinhasPublicacoes = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    cancelarConsultaAtual();
    setMinhasPublicacoes(e.target.checked);
  };

  const buscarPublicacoes = useCallback(
    (
      cursor?: CursorPublicacao | null,
      signal?: AbortSignal,
    ) => {
      return listarPublicacoes(
        10,
        cursor,
        cidadeFiltro,
        minhasPublicacoes,
        signal,
      );
    },
    [cidadeFiltro, minhasPublicacoes],
  );

  // Carrega as cidades uma vez ao montar a página.
  useEffect(() => {
    let ativo = true;

    async function carregarCidades() {
      try {
        const resultado = await listarCidadesAtivas();

        if (ativo) {
          setCidades(resultado);
          
        }
      } catch {
        
      }
    }

    void carregarCidades();

    return () => {
      ativo = false;
    };
  }, []);

  // Recomeça pela primeira página quando os filtros mudam.
  useEffect(() => {
    const controller = new AbortController();

    consultaAtual.current = controller;
    carregandoMaisRef.current = false;

    setPublicacoes([]);
    setNextCursor(null);
    setHasMore(true);
    setLoading(true);
    setLoadingMore(false);
    setError('');

    async function carregarInicial() {
      try {
        const resultado = await buscarPublicacoes(
          null,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        setPublicacoes(resultado.items);
        setNextCursor(resultado.nextCursor);
        setHasMore(resultado.hasMore);
      } catch {
        if (controller.signal.aborted) return;

        setError('Não foi possível carregar as publicações.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void carregarInicial();

    return () => {
      controller.abort();
    };
  }, [buscarPublicacoes]);

  const carregarMais = async () => {
    const controller = consultaAtual.current;

    if (
      !controller ||
      controller.signal.aborted ||
      loading ||
      carregandoMaisRef.current ||
      !hasMore ||
      !nextCursor
    ) {
      return;
    }

    carregandoMaisRef.current = true;
    setLoadingMore(true);
    setError('');

    try {
      const resultado = await buscarPublicacoes(
        nextCursor,
        controller.signal,
      );

      // Uma resposta do filtro anterior não entra na lista nova.
      if (controller.signal.aborted) return;

      setPublicacoes((anteriores) => {
        const idsExistentes = new Set(
          anteriores.map((publicacao) => publicacao.id),
        );

        const novas = resultado.items.filter(
          (publicacao) => !idsExistentes.has(publicacao.id),
        );

        return [...anteriores, ...novas];
      });

      setNextCursor(resultado.nextCursor);
      setHasMore(resultado.hasMore);
    } catch {
      if (controller.signal.aborted) return;

      setError('Não foi possível carregar mais publicações.');
    } finally {
      if (!controller.signal.aborted) {
        carregandoMaisRef.current = false;
        setLoadingMore(false);
      }
    }
  };
  return (
    <div className="blogPage">
      {/* Fixo na tela: não acompanha a rolagem. */}
      <div className="blogHero">
        <HeaderVideo
          imgSrc={blogImg}
          title="Blog da Comunidade"
          icon={
            <FontAwesomeIcon
              icon={faPagelines}
              style={{ color: '#739d1e' }}
            />
          }
        />
      </div>
      {/* Reserva a altura do header no fluxo da página. */}
      <div className="blogHeroSpacer" aria-hidden="true" />
      {/* Rola normalmente sobre o header. */}
      <div className="blogContent">
        <div className="blogShell">
          <header className="blogIntro">
            <div>
              <span className="blogEyebrow"><FontAwesomeIcon icon={faLeaf} /> NOSSA COMUNIDADE</span>
              <h2>Pequenos plantios.<br /><em>Grandes histórias.</em></h2>
            </div>
            <p>Cada árvore tem uma história. Acompanhe quem está deixando nossa cidade mais verde.</p>
          </header>
          <div className="blogLayout">
            <div className="blogFeed">
              <div className="blogToolbar">
                <div className="blogFeedTitle"><span className="blogLiveDot" aria-hidden="true" /><h3>Histórias da comunidade</h3></div>
                <div className="blogFilters">
                  <label className="blogCityFilter" htmlFor="blogCidade">
                    <span>Cidade</span>
                    <select id="blogCidade" value={cidadeFiltro} onChange={buscarPubliCidade}>
                      <option value="">Todas as cidades</option>
                      {cidades.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
                    </select>
                  </label>
                  <label className="blogMyPosts" htmlFor="myPubli">
                    <input type="checkbox" className="myPubli" id="myPubli" checked={minhasPublicacoes} onChange={alterarMinhasPublicacoes}/>
                    <span>Minhas publicações</span>
                  </label>
                </div>
              </div>
              <section className="publication" aria-label="Publicações da comunidade" aria-busy={loading || loadingMore}>

                {publicacoes.map((publicacao) => (
                  <CardBlog
                    key={publicacao.id}
                    imageUrl={
                      publicacao.requisicao?.fotoPlantioUrl ?? ''
                    }
                    perfilImg={userImg}
                    title={publicacao.titulo}
                    message={publicacao.descricao}
                    nome={
                      publicacao.requisicao?.nomeBeneficiario ?? ''
                    }
                    date={new Date(
                      publicacao.criadoEm,
                    ).toLocaleString('pt-BR')}
                  />
                ))}
                {loading && (
                  <p className="blogStatus" role="status">
                    Carregando publicações...
                  </p>
                )}
                {!loading && error && publicacoes.length === 0 && (
                  <div className="blogFeedback" role="alert">
                    <p>{error}</p>
                    <button
                      className="blogLoadMore"
                      type="button"
                      onClick={() => window.location.reload()}
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}
                {!loading && !error && publicacoes.length === 0 && (
                  <p className="blogStatus">
                    Nenhuma publicação encontrada.
                  </p>
                )}
                {error && !loadingMore && publicacoes.length > 0 && (
                  <p className="blogStatus blogError" role="alert">
                    {error}
                  </p>
                )}
                {hasMore && !loading && nextCursor && (
                  <div className="blogActions">
                    <button
                      className="blogLoadMore"
                      type="button"
                      onClick={carregarMais}
                      disabled={loadingMore}
                    >
                      {loadingMore
                        ? 'Carregando...'
                        : error
                          ? 'Tentar novamente'
                          : 'Carregar mais'}
                    </button>
                  </div>
                )}
                {!hasMore && publicacoes.length > 0 && (
                  <p className="blogStatus">
                    Você chegou ao fim das publicações.
                  </p>
                )}
              </section>
            </div>
            <aside className="blogSidebar" aria-label="Sobre a comunidade">
              <section className="blogAbout">
                <span className="blogAsideIcon"><FontAwesomeIcon icon={faLeaf} /></span>
                <span className="blogEyebrow">RAÍZES QUE CONECTAM</span>
                <h3>Uma cidade mais verde começa com a gente.</h3>
                <p>Um espaço para compartilhar fotos, experiências e o cuidado com as árvores da nossa cidade.</p>
                <div className="blogAboutFooter"><span aria-hidden="true">↗</span> Cada muda faz parte dessa mudança.</div>
              </section>
              <section className="blogNote">
                <span className="blogEyebrow">DEPOIS DO PLANTIO</span>
                <h3>A história continua.</h3>
                <p>Observe o crescimento da sua árvore e registre novas fotos. Os pequenos detalhes também merecem ser compartilhados.</p>
                <div className="blogNoteSignature">Cultivar também é acompanhar.</div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BlogPage;
