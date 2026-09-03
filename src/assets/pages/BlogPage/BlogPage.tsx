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

export const BlogPage = () => {
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

                <CardBlog
                  imageUrl={imageTeste}
                  perfilImg={imageTeste}
                  title='Árvore plantada'
                  message='Árvore plantada na localização informada e já está se desenvolvendo!'
                  nome='user teste'
                  date='hoje, 10:24'
                />
                <CardBlog
                  imageUrl={imageTeste}
                  perfilImg={imageTeste}
                  title='Árvore plantada'
                  message='Árvore plantada na localização informada e já está se desenvolvendo!'
                  nome='user teste'
                  date='hoje, 10:24'
                />
                <CardBlog
                  imageUrl={imageTeste}
                  perfilImg={imageTeste}
                  title='Árvore plantada'
                  message='Árvore plantada na localização informada e já está se desenvolvendo!'
                  nome='user teste'
                  date='hoje, 10:24'
                />
                <CardBlog
                  imageUrl={imageTeste}
                  perfilImg={imageTeste}
                  title='Árvore plantada'
                  message='Árvore plantada na localização informada e já está se desenvolvendo!'
                  nome='user teste'
                  date='hoje, 10:24'
                />
                <CardBlog
                  imageUrl={imageTeste}
                  perfilImg={imageTeste}
                  title='Árvore plantada'
                  message='Árvore plantada na localização informada e já está se desenvolvendo!'
                  nome='user teste'
                  date='hoje, 10:24'
                />
                <CardBlog
                  imageUrl={imageTeste}
                  perfilImg={imageTeste}
                  title='Árvore plantada'
                  message='Árvore plantada na localização informada e já está se desenvolvendo!'
                  nome='user teste'
                  date='hoje, 10:24'
                />

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