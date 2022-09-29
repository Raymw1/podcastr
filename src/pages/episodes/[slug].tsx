import { format, parseISO } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Episode as IEpisode } from '..';
import { usePlayer } from '../../contexts/PlayerContext';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';

type EpisodeProps = {
  episode: IEpisode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href='/'>
          <button type='button'>
            <img src='/arrow-left.svg' alt='Back' />
          </button>
        </Link>
        <Image
          alt={episode.title}
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit='cover'
        />
        <button type='button' onClick={() => play(episode)}>
          <img src='/play.svg' alt='Play episode' />
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
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const paths = data.map((episode: IEpisode) => ({
    params: { slug: episode.id },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { data } = await api.get(`/episodes/${ctx.params?.slug}`);

  const episode = {
    ...data,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: enUS,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  };
};
