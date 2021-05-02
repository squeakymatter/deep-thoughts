import React from 'react';
import ThoughtList from '../components/ThoughtList';

import { useQuery } from '@apollo/react-hooks';
import { QUERY_THOUGHTS } from '../utils/queries';

// use useQuery hook to make query request

const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  //optional chaining syntax - if data exists, store it in the thoughts constant we just created. if data is undefined, then save an empty array to the thoughts component note this is an async request-if you look at the console, the first few thoughts logs will be empty arrays. Once query completes and `data` actually has info, we can access its `thought` property and log that data instead, and show the content the query (QUERY_THOUGHTS) asked for.
  const thoughts = data?.thoughts || [];
  console.log(thoughts);
  //use ternary operator to conditionally render ThoughtList component
  //once query completes and `loading` is undefined, pass thoughts array and a custom title to the <ThoughtList> component as props.
  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title='Some Feed for Thought(s)...'
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
