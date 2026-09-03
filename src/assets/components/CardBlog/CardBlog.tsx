import './CardBlog.css'

interface CardBlogProps {
  imageUrl: string,
  perfilImg: string,
  nome: string,
  message: string,
}

export const CardBlog = ({ imageUrl, perfilImg, nome, message }: CardBlogProps) => {

  const divStyleImg: React.CSSProperties = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '250px',
    borderRadius: '8px 8px 0px 0px',
  };

  const stylePerfilImg: React.CSSProperties = {
    backgroundImage: `url(${perfilImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
  };

  return (
    <>
      <div className="cardBlog">
        <div className="img" style={divStyleImg}></div>
        <div className="user">
          <div className='perfilImg' style={stylePerfilImg}/>
          <p>{nome}</p>
        </div>
        <div className="cardMessage">{message}</div>
      </div>
    </>
  )
}