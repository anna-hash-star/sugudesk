import Head from 'next/head';

const clients = require('../../lib/clients');

const VALID_TOKEN = 'sugudeskdemo';

export async function getServerSideProps({ params, query }) {
  const client = clients[params.id];
  if (!client || !client.difyToken) {
    return { notFound: true };
  }

  // トークン認証
  if (query.t !== VALID_TOKEN) {
    return { props: { denied: true } };
  }

  return {
    props: {
      name: client.name,
      difyToken: client.difyToken,
      brandColor: client.brandColor || '#2563a8',
      denied: false,
    },
  };
}

export default function ChatPage({ name, difyToken, brandColor, denied }) {
  if (denied) {
    return (
      <>
        <Head>
          <title>アクセス拒否</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          height: '100vh', fontFamily: 'sans-serif', background: '#f8f7f4',
        }}>
          <div style={{ textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>403</div>
            <div>アクセスが拒否されました</div>
          </div>
        </div>
      </>
    );
  }

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
        /* Difyブランディング非表示 */
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
      <iframe
        src={`https://udify.app/chatbot/${difyToken}`}
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
