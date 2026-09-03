import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HeaderVideo } from '../../components/HeaderVideo/HeaderVideo';
import blogVideo from '../../media/blog_video.mp4';
import './BlogPage.css';
import { } from '@fortawesome/free-solid-svg-icons';
import { faPagelines } from '@fortawesome/free-brands-svg-icons';
import { SectionContent } from '../../components/SectionContent/SectionContent';
import { CardBlog } from '../../components/CardBlog/CardBlog';

import imageTeste from '../../media/tree.png';

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
        <CardBlog imageUrl={imageTeste} perfilImg={imageTeste} message='Árvore plantada testeeeeeeeeeeeeeeeeeeeeee' nome='user teste'/>
      </SectionContent>
    </>
  )
}