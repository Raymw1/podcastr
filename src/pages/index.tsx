import type { NextPage } from 'next';

const Home: NextPage = () => {
  return <h1>Index</h1>;
};

export default Home;

/* ------------- SSR ------------- */
/* export async function getServerSideProps() { */

/* ------------- SSG ------------- */
export async function getStaticSideProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();
  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
}
