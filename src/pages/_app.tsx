import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as ReduxProvider } from "react-redux";
import { wrapper } from "@/store";
import Layout from "@/components/Layout";
import { AnimatePresence } from "framer-motion";

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <ChakraProvider>
      <ReduxProvider store={store}>
        <Layout>
          <AnimatePresence mode="wait" initial={false}>
            <Component {...pageProps} />
          </AnimatePresence>
        </Layout>
      </ReduxProvider>
    </ChakraProvider>
  );
}
