import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./search.module.scss";
import { useSearch } from "../../contexts/SearchContext";
import { usePlayer } from "../../contexts/PlayerContext";
import { Episode } from "../../@types/episode";

type HomeComponentProps = {
  episodesAll: Episode[]; // || Array<Episode>
  latestEpisodes: Episode[];
};

function SearchComponent({ episodesAll, latestEpisodes }: HomeComponentProps) {
  const { titlePodcast } = useSearch();
  const { playList } = usePlayer();

  const podcastFilter = episodesAll.filter((item) =>
    item.title.toLowerCase().includes(titlePodcast.toLowerCase())
  );

  return (
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
            {titlePodcast.length > 0 &&
              podcastFilter.map((episode, index) => {
                return (
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
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          playList(episodesAll, index + latestEpisodes.length)
                        }
                      >
                        <img src="/play-green.svg" alt="Tocar episódio" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export  {SearchComponent};
