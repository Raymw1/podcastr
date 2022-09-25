import format from 'date-fns/format';
/* import ptBR from 'date-fns/locale/pt-BR'; */
import enUS from 'date-fns/locale/en-US';

import styles from './styles.module.scss';

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: enUS,
  });

  return (
    <header className={styles.headerContainer}>
      <img src='/logo.svg' alt='Podcastr' />
      <p>The best to listen, always</p>
      <span>{currentDate}</span>
    </header>
  );
}
