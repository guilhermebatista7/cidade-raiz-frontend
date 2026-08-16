import './App.css'
import { HomeImg } from './assets/components/HomeImg/HomeImg'
import { HomeVideo } from './assets/components/HomeVideo/HomeVideo'
import tree from '../src/assets/media/tree.png';
import tree_video from '../src/assets/media/tree_video.mp4';
import root from '../src/assets/media/root.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Menu } from './assets/components/Menu/Menu';


function App() {

  return (
    <>
        <Menu/>
        <HomeVideo 
          src={tree_video}
          fallbackSrc={tree}
          title='Cidade Raiz'
        />

        <HomeImg 
        src={root} 
        alt='Raíz' 
        className={`image raiz`}
        />
    </>
  )
}

export default App
