import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

//establish connection to backend server's graphql endpoint using Apollo
const client = new ApolloClient({
  uri: 'graphql',
});

function App() {
  return (
    // wrap JSX with Apollo provider - pass the client variable in as the value of the `client` proper in the provider, so everything between JSX tags will have access to server's API data through the `client`
    <ApolloProvider client={client}>
      <div className='flex-column justify-flex-start min-100-vh'>
        <Header />
        <div className='container'>
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
