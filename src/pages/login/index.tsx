import Head from "next/head";
import Auth from '@/views/Auth'

const AuthPage = () => {
  return (
    <>
      <Head>
        <title>Authentication</title>
      </Head>
      <Auth />
    </>
  );
};

export default AuthPage;
