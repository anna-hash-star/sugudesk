import Head from 'next/head';

const clients = require('../../lib/clients');

export async function getServerSideProps({ params }) {
  const client = clients[params.id];
  if (!client || !client.difyToken) {
    return { notFound: true };
  }

  return {
    props: {
      name: client.name,
      difyToken: client.difyToken,
      brandColor: client.brandColor || '#2563a8',
    },
  };
}

export default function ChatPage({ name, difyToken, brandColor }) {
  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <style jsx global>{`
        html, body, #__next {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
      `}</style>
      <iframe
        https://udify.app/chat/${difyToken}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="microphone"
      />
    </>
  );
}
