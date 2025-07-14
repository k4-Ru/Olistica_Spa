// src/components/WhatsNew.js
import React, { useEffect, useState } from 'react';
import * as contentful from 'contentful';

const client = contentful.createClient({
  space: 'ss45auky8gyk',
  accessToken: 'alYshD-1zlvxhnG7nbYtp-QIwP5UwXjL5FM-EVD339s'
});

export default function WhatsNew() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client.getEntries({ content_type: 'olisticaPosting' })
      .then((response) => {
        console.log("Fetched entries:", response.items);
        setPosts(response.items);
      })
      .catch(console.error);
  }, []);

  return (
    <section style={{ padding: "20px" }}>
      <h2 className='book-title'>What's New?</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {posts.map(post => {
          const { title, description, imagesvideos = [], dateAndTime } = post.fields;
          const formattedDate = dateAndTime 
            ? new Date(dateAndTime).toLocaleString('en-PH', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })
            : '';

          return (
            <div key={post.sys.id} style={{ marginBottom: '20px', maxWidth: '300px' }}>
              <small style={{ display: 'block', color: '#777', marginBottom: '4px' }}>
                {formattedDate}
              </small>
              <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {title}
              </p>
              {description && (
                <p style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#555' }}>
                  {description}
                </p>
              )}

              {/* Loop over images & videos */}
              {imagesvideos.map((asset, index) => {
                const file = asset?.fields?.file;
                if (!file?.url) return null;

                const url = `https:${file.url}`;
                const contentType = file.contentType;

                if (contentType.startsWith('image/')) {
                  return (
                    <img
                      key={index}
                      src={`${url}?w=400&fit=thumb&fm=webp&q=80`}
                      alt={title}
                      style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
                    />
                  );
                } else if (contentType.startsWith('video/')) {
                  return (
                    <video
                      key={index}
                      controls
                      style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
                    >
                      <source src={url} type={contentType} />
                      Your browser does not support the video tag.
                    </video>
                  );
                } else {
                  return <p key={index}>Unsupported media type</p>;
                }
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}
