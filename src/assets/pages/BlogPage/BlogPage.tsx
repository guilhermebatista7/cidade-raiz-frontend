import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HeaderVideo } from '../../components/HeaderVideo/HeaderVideo';
import blogVideo from '../../media/blog_video.mp4';
import './BlogPage.css';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faPagelines } from '@fortawesome/free-brands-svg-icons';
import { SectionContent } from '../../components/SectionContent/SectionContent';
import { CardBlog } from '../../components/CardBlog/CardBlog';

import imageTeste from '../../media/tree.png';
import { CardInfo } from '../../components/CardInfo/CardInfo';
import { DetailCard } from '../../components/DetailCard/DetailCard';
import Pagination from '../../components/Pagination/Pagination';
import { useCallback, useEffect, useState } from 'react';
import { listarPublicacoes } from '../../../services/blogService';
import type { CursorPublicacao, Publicacao } from '../../../types';

export const BlogPage = () => {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [nextCursor, setNextCursor] =
    useState<CursorPublicacao | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

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
      setError("");

      try {
        const resultado = await buscarPublicacoes();
        console.log(resultado);

        if (!ativo) return;

        setPublicacoes(resultado.items);
        setNextCursor(resultado.nextCursor);
        setHasMore(resultado.hasMore);
      } catch {
        if (ativo) {
          setError("Não foi possível carregar as publicações.");
        }
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarInicial();

    return () => {
      ativo = false;
    };
  }, [buscarPublicacoes]);

  const carregarMais = async () => {
    if (loading || loadingMore || !hasMore || !nextCursor) {
      return;
    }

    setLoadingMore(true);
    setError("");

    try {
      const resultado = await buscarPublicacoes(nextCursor);
      
      setPublicacoes((anteriores) => {
        // Evita duplicações caso a API retorne algum ID repetido.
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
      setError("Não foi possível carregar mais publicações.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <>
      <div className="header">
        <HeaderVideo
          src={blogVideo}
          title='Blog da  Comunidade'
          icon={<FontAwesomeIcon icon={faPagelines} style={{ color: '#739d1e' }} />}
          className='blogVideo'
        />
      </div>

      <SectionContent className='sectionBlog'>

        <div className="container-fluid">
          <div className="row w-full">

            {/* Feed de publicações */}

            <div className="col-12 col-xl-9 order-1">

              <SectionContent className='publication'>

                {publicacoes.map((publicacao) => (
                  <CardBlog
                    key={publicacao.id}
                    imageUrl={imageTeste}
                    perfilImg={imageTeste}
                    title={publicacao.titulo}
                    message={publicacao.descricao}
                    nome={publicacao.requisicao?.nomeBeneficiario ?? ''}
                    date={new Date(publicacao.criadoEm).toLocaleString()}
                  />
                ))}

                {loading && <p>Carregando publicações...</p>}

                {!loading && error && (
                  <div role="alert">
                    <p>{error}</p>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}

                {!loading && !error && publicacoes.length === 0 && (
                  <p>Nenhuma publicação encontrada.</p>
                )}

                {error && !loadingMore && publicacoes.length > 0 && (
                  <p role="alert">{error}</p>
                )}

                {hasMore && !loading && (
                  <button
                    type="button"
                    onClick={carregarMais}
                    disabled={loadingMore}
                  >
                    {loadingMore ? "Carregando..." : "Carregar mais"}
                  </button>
                )}

                {!hasMore && publicacoes.length > 0 && (
                  <p>Você chegou ao fim das publicações.</p>
                )}

              </SectionContent>
            </div>

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
                      cardImg={imageTeste}
                      title="Espécie 1"
                      description="20 publicações"
                      className="detailCardBlog"
                    />

                    <DetailCard
                      cardImg={imageTeste}
                      title="Espécie 1"
                      description="20 publicações"
                      className="detailCardBlog"
                    />

                    <DetailCard
                      cardImg={imageTeste}
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
    </>
  )
}