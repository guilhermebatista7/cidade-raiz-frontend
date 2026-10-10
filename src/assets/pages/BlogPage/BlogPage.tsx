import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faPagelines } from '@fortawesome/free-brands-svg-icons';

import { HeaderVideo } from '../../components/HeaderVideo/HeaderVideo';
import { SectionContent } from '../../components/SectionContent/SectionContent';
import { CardBlog } from '../../components/CardBlog/CardBlog';
import { CardInfo } from '../../components/CardInfo/CardInfo';
import { DetailCard } from '../../components/DetailCard/DetailCard';
import Pagination from '../../components/Pagination/Pagination';

import { listarPublicacoes } from '../../../services/blogService';
import type { CursorPublicacao, Publicacao } from '../../../types';

import blogImg from '../../media/blogHeader.png';
import userImg from '../../media/user.png';
import './BlogPage.css';

export const BlogPage = () => {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [nextCursor, setNextCursor] =
    useState<CursorPublicacao | null>(null);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const buscarPublicacoes = useCallback(
    async (cursor?: CursorPublicacao | null) => {
      return listarPublicacoes(10, cursor);
    },
    [],
  );

  useEffect(() => {
    let ativo = true;

    async function carregarInicial() {
      setLoading(true);
      setError('');

      try {
        const resultado = await buscarPublicacoes();

        if (!ativo) return;

        setPublicacoes(resultado.items);
        setNextCursor(resultado.nextCursor);
        setHasMore(resultado.hasMore);
      } catch {
        if (ativo) {
          setError('Não foi possível carregar as publicações.');
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    void carregarInicial();

    return () => {
      ativo = false;
    };
  }, [buscarPublicacoes]);

  const carregarMais = async () => {
    if (loading || loadingMore || !hasMore || !nextCursor) {
      return;
    }

    setLoadingMore(true);
    setError('');

    try {
      const resultado = await buscarPublicacoes(nextCursor);

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
      setError('Não foi possível carregar mais publicações.');
    } finally {
      setLoadingMore(false);
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
        <SectionContent className="sectionBlog">
          <div className="container-fluid">
            <div className="row w-full">
              {/* Posição original das publicações. */}
              <div className="col-12 col-xl-9 order-1">
                <SectionContent className="publication">
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
                </SectionContent>
              </div>

              {/* Posição original das informações. */}
              <div className="col-12 col-xl-3 order-0 mb-2">
                <SectionContent className="infoBlog">
                  <div className="d-flex gap-3 flex-column flex-sm-row flex-md-row flex-xl-column">
                    <CardInfo
                      icon={<FontAwesomeIcon icon={faLeaf} />}
                      title="Sobre o Blog"
                      text="Esse é um espaço para compartilhar histórias, fotos e experiências sobre o plantio e cuidado com as árvores na cidade."
                      className="cardInfoBlog"
                    />

                    <CardInfo
                      title="Espécies populares"
                      className="cardInfoBlog"
                    >
                      <DetailCard
                        cardImg={blogImg}
                        title="Espécie 1"
                        description="20 publicações"
                        className="detailCardBlog"
                      />

                      <DetailCard
                        cardImg={blogImg}
                        title="Espécie 1"
                        description="20 publicações"
                        className="detailCardBlog"
                      />

                      <DetailCard
                        cardImg={blogImg}
                        title="Espécie 1"
                        description="20 publicações"
                        className="detailCardBlog"
                      />
                    </CardInfo>
                  </div>
                </SectionContent>
              </div>
            </div>
          </div>
        </SectionContent>

        <Pagination />
      </div>
    </div>
  );
};

export default BlogPage;