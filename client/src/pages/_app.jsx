import store from "@/context/Store";
import "@/styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>NeetX Chat</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />;
    </Provider>
  );
}
