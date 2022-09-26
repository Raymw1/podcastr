import { format, parseISO } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import type { GetStaticProps, NextPage } from 'next';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  members: string;
};

type HomeProps = {
  /* episodes: Array<Episode>; */
  episodes?: Episode[];
};

const Home: NextPage = (props: HomeProps) => {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );
};

export default Home;

/* ------------- SSR ------------- */
/* export async function getServerSideProps() { */

/* ------------- SSG ------------- */
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });
  const episodes = data.map((episode: any) => ({
    ...episode,
    publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
      locale: enUS,
    }),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(episode.file.duration)
    ),
    url: episode.file.url,
  }));

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
