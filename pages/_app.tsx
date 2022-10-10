import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ClerkProvider } from '@clerk/nextjs';
import Layout from './../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return <ClerkProvider {...pageProps} >
    <ChakraProvider >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  </ClerkProvider>
}

export default MyApp
