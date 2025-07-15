import React, { useEffect, useState } from 'react';
import * as contentful from 'contentful';

const client = contentful.createClient({
  space: 'ss45auky8gyk',
  accessToken: 'alYshD-1zlvxhnG7nbYtp-QIwP5UwXjL5FM-EVD339s'
});

export default function WhatsNew() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    client.getEntries({ content_type: 'olisticaPosting' })
      .then((response) => {
        // Sort newest first
        const sorted = response.items.sort((a, b) =>
          new Date(b.fields.dateAndTime) - new Date(a.fields.dateAndTime)
        );
        setPosts(sorted);
      })
      .catch(console.error);
  }, []);

  // Handlers: Previous → older posts; Next → newer posts
  const handlePrevious = () => {
    setCurrentIndex(prev => Math.min(prev + 1, posts.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (posts.length === 0) {
    return <p style={{ padding: '20px' }}>Loading posts...</p>;
  }

  const post = posts[currentIndex];
  const { title, description, imagesvideos = [], dateAndTime } = post.fields;
  const formattedDate = dateAndTime
    ? new Date(dateAndTime).toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : '';

  // Determine if we're on the latest post (index 0)

  return (
    <section className='whats-new' style={{ borderRadius: '15px'}}>
      <div style={{ maxWidth: '100%', padding: '20px', borderRadius: '18px',
        backgroundColor: "rgba(70, 70, 70, 0.3)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(8px)"
       }}>
        <h2 className="book-title" style={{ textAlign: 'center', textShadow: '0 0 0 #000'}}>
          What's New?
        </h2>

        {/* Date */}
        <small style={{ display: 'block', color: '#faf3e6', marginBottom: '10px', textAlign: 'center', fontFamily: 'albert sans' }}>
          {formattedDate}
        </small>

        {/* Layout: media | text */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: '20px',
            justifyContent: 'center'
          }}
        >
          {/* Media */}
          <div style={{
            flex: '1 1 250px',
            maxWidth:'500px' // larger when latest
          }}>
            {imagesvideos.length > 0 ? (
              imagesvideos.map((asset, index) => {
                const file = asset?.fields?.file;
                if (!file?.url) return null;
                const url = `https:${file.url}`;
                const contentType = file.contentType;

                if (contentType.startsWith('image/')) {
                  return (
                    <img
                      key={index}
                      src={`${url}?w=${600}&fit=thumb&fm=webp&q=80`}
                      alt={title}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}
                    />
                  );
                } else if (contentType.startsWith('video/')) {
                  return (
                    <video
                      key={index}
                      controls
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        height: ''
                      }}
                    >
                      <source src={url} type={contentType} />
                      Your browser does not support the video tag.
                    </video>
                  );
                } else {
                  return <p key={index}>Unsupported media type</p>;
                }
              })
            ) : (
              <p style={{ color: '#999' }}>No media available</p>
            )}
          </div>

          {/* Title & description */}
          <div style={{ flex: '2 1 300px' }}>
            <p style={{
              color: '#faf3e6',
              fontWeight: 'bold',
              marginBottom: '8px',
              fontSize:'1.3rem',
              fontFamily: 'albert sans'
            }}>
              {title}
            </p> <hr></hr>
            {description && (
              <p style={{ fontSize: '0.95rem', color: '#faf3e6', fontFamily: 'albert sans' }}>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className='post-button'style={{ display: 'flex', gap: '10px', justifyContent: 'center', fontFamily: 'albert sans' }}>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === posts.length - 1}
            style={{
              padding: '6px 12px',
              cursor: currentIndex === posts.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          <button className='post-button'
            onClick={handleNext}
            disabled={currentIndex === 0}
            style={{
              padding: '6px 12px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>

        {/*<div style={{ marginTop: '10px', color: '#777', textAlign: 'center' }}>
          Post {currentIndex + 1} of {posts.length}
        </div>*/}
      </div>
    </section>
  );
}
