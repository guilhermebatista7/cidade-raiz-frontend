import './App.css'
import { HomeVideo } from './assets/components/HomeVideo/HomeVideo'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faLeaf } from '@fortawesome/free-solid-svg-icons';

import tree from '../src/assets/media/tree.png';
import tree_video from '../src/assets/media/tree_video.mp4';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Menu } from './assets/components/Menu/Menu';


function App() {

  return (
    <>
      <Menu />
      <HomeVideo
        src={tree_video}
        fallbackSrc={tree}
        title='Cidade Raiz'
        icon={
          <FontAwesomeIcon
            icon={faLeaf}
            style={{ color: '#739d1e' }}
          />
        }
      />
    </>
  )
}

export default App
