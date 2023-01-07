import format from "date-fns/format";
import ptBr from "date-fns/locale/pt-BR";
import { ImSearch } from "react-icons/im";

import styles from "./styles.module.scss";
import { useSearch } from "../../contexts/SearchContext";

//date fns - lida com data no React

export function Header() {
  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBr,
  });

  const { titlePodcast, setTitlePodcast } = useSearch();

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />
      <div className={styles.containerInput}>
        <input
          type="text"
          placeholder="Pesquise um podcast..."
          onChange={(e) => {
            setTitlePodcast(e.target.value);
          }}
          value={titlePodcast}
        />
        <button>
          <ImSearch color="#fff" className={styles.searchIcon} />
        </button>
      </div>
      <span>{currentDate}</span>
    </header>
  );
}
