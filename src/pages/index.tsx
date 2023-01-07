import React from "react";
import ptBr from "date-fns/locale/pt-BR";
import { GetStaticProps } from "next";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { Episode } from "../@types/episode";
import { useSearch } from "../contexts/SearchContext";
import { HomeComponent } from "../components/Home";
import { SearchComponent } from "../components/Search";

type HomeProps = {
  latestEpisodes: Episode[]; // || Array<Episode>
  allEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { titlePodcast } = useSearch();
  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <>
      {titlePodcast.length === 0 ? (
        <HomeComponent
          allEpisodes={allEpisodes}
          latestEpisodes={latestEpisodes}
          episodeList={episodeList}
        />
      ) : (
        <SearchComponent
          episodesAll={episodeList}
          latestEpisodes={latestEpisodes}
        />
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data }: any = await api.get("episodes", {
    params: {
      _limit: 12, //limite de 12 eposisodios,
      _sort: "published_at", // ordernar pela published_at
      _order: "desc", //em ordem decresecnte
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBr,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2); //Trazer os episodios da positon 0 até a 2, não vai chamar os primeiros episodios, pq da chamada o mais recente como primeiros
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};

// -----[FORMAS DE CONSUMIR UMA API]---------
// SPA - utilizando o useEffect - Não chama com JS desabilitado por que roda no client-side
// SSR - getServerSideProps - Chama mesmo com JS desabilitado por que roda no server-side
// SSG - getStaticProps  - Chama uma vez, mesmo com o JS desabilitado por que roda no server-side

//SSR - Executa pelo lado do server toda vez que alguém acessa o essa página

/*export async function getServerSideProps(){

    const response = await fetch("http://localhost:3333/episodes")
    const data = await response.json()

    return {
      props:{
        episodes: data,
      }
    }   
}  */
