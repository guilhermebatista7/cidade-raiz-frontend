import { DetailCard } from '../DetailCard/DetailCard';
import './CardBlog.css'

interface CardBlogProps {
  imageUrl: string,
  perfilImg: string,
  nome: string,
  title: string,
  message: string,
  date: string
}

export const CardBlog = ({ imageUrl, perfilImg, nome, title, message, date }: CardBlogProps) => {

  const divStyleImg: React.CSSProperties = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '250px',
    borderRadius: '8px 8px 0px 0px',
  };

  return (
    <>
      <div className="cardBlog">
        <div className="img" style={divStyleImg}></div>
        <DetailCard cardImg={perfilImg} title={nome} description={date} />
        <div className="cardMessage p-3">
          <h3>{title}</h3>
          {message}
        </div>
      </div>
    </>
  )
}