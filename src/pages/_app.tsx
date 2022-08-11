import '../styles/global.scss'
import styles from '../styles/app.module.scss';
import { Header } from '../components/Header'
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import Search from './search';
import { SearchContextProvider } from '../contexts/SearchContext';


function MyApp({ Component, pageProps }) {

  return(
    <SearchContextProvider>
    <PlayerContextProvider>
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player/>
    </div>
    </PlayerContextProvider>
    </SearchContextProvider>
  )
}

export default MyApp
