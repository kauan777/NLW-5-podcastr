import { parseISO } from 'date-fns';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useSearch } from '../contexts/SearchContext';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './search.module.scss';


// import { Container } from './styles';


function Search({allEpisodes,latestEpisodes}){

  const { podcast } = useSearch()
  const { playList } = usePlayer()

  const episodesAll = [...latestEpisodes, ...allEpisodes]


  const podcastFilter = allEpisodes.filter((item) => item.title.includes(podcast) )


  return (
    <>    
    <div className={styles.searchPage}>
    <section className={styles.allEpisodes}>

        <table cellSpacing={0}>
          <thead>
          <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
            {podcast.length > 0 && podcastFilter.map((episode,index) =>{
              return(
                <tr key={episode.id}>
                  <td>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}  
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={()=> playList(episodesAll, index + latestEpisodes.length )}>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
            )
            })}
          </tbody>
        </table>
    </section>
    </div>
d    </>

);
}

export default Search;

export const getStaticProps: GetStaticProps = async () => {

  const { data }: any = await api.get("episodes", {

    params:{
      _sort: 'published_at', // ordernar pela published_at
      _order: 'desc' //em ordem decresecnte
    }
  })  

  const episodes = data.map(episode =>{
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2); //Trazer os episodios da positon 0 até a 2, não vai chamar os primeiros episodios, pq da chamada o mais recente como primeiros
  const allEpisodes= episodes.slice(2, episodes.length);

  return {
    props:{
      allEpisodes,
      latestEpisodes

    },
    revalidate: 60 * 60 * 8,
  }   
}