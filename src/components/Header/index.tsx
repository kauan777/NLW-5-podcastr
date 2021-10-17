import format from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss';


//date fns - lida com data no React

export function Header(){

    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
       locale: ptBr 
    });


    return(
      <header className={styles.headerContainer}>
          <img src="/logo.svg" alt="Podcastr"/>
          <p>O melhor para você ouvir, sempre</p>
          <span>{currentDate}</span>
      </header>       
    );
}