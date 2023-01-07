import { parseISO } from "date-fns";
import format from "date-fns/format";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss";
import { usePlayer } from "../../contexts/PlayerContext";
import { useSearch } from "../../contexts/SearchContext";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();
  const { titlePodcast } = useSearch();

  const router = useRouter();

  useEffect(() => {
    if (titlePodcast.length > 0) {
      router.push("/");
    }
  }, [titlePodcast]);

  //const router = useRouter();
  // if(router.isFallback){
  //     return <p>Carregando...</p>
  // }

  return (
    <>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            width={700}
            height={160}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="cover"
          />
          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data }: any = await api.get("episodes", {
    params: {
      _limit: 2, //limite de 2 eposisodios,
      _sort: "published_at", // ordernar pela published_at
      _order: "desc", //em ordem decresecnte
    },
  });

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    //se eu passo o paths vazio ( paths[] ) , sgnifica que eu não quero que ele rode essa página estática no momento da build
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data }: any = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
