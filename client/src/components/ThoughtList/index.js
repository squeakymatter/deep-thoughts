import React from 'react';
import { Link } from 'react-router-dom';
//ThoughtList will receive two props: title and the thoughts array.
//destructure argument data to avoid using props.title and props.thoughts throughout JSX code.
//conditionally render JSX by checking if there's any data in thoughts array first.

const ThoughtList = ({ thoughts, title }) => {
  //if no data, return message saying no data
  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }
  //if data, return list of thoughts using .map() method.
  //`key` prop helps React internally track which data needs to be re-rendered if something changes.
  //also check to see the value of `thought.reactionCount. if no reactions. user will view or add own reaction to existing list
  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map((thought) => (
          <div key={thought._id} className='card mb-3'>
            <p className='card-header'>
              <Link
                to={`/profile/${thought.username}`}
                style={{ fontWeight: 700 }}
                className='text-light'
              >
                {thought.username}
              </Link>{' '}
              thought on {thought.createdAt}
            </p>
            <div className='card-body'>
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className='mb-0'>
                  Reactions: {thought.reactionCount} || Click to{' '}
                  {thought.reactionCount ? 'see' : 'start'} the discussion!
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;
