/* eslint-disable max-len */

const Twitter = () => {
  if (!globalThis.window) {
    return null;
  }
  return (
    <div className='twitter-tweet-ctr' style={{ marginRight: '8px' }}>
      <a
        className='twitter-share-button'
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(globalThis.window.location.href)}`}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Share on X'
      >
        <svg
          viewBox='0 0 24 24'
          aria-hidden='true'
          width='14'
          height='14'
          fill='currentColor'
        >
          <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
        </svg>
        Post
      </a>
    </div>
  );
};

export default Twitter;
