import Head from "next/head";
import Signup from '@/views/Signup'

const AuthPage = () => {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Signup />
    </>
  );
};

export default AuthPage;
