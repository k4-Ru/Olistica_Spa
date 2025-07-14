import React, { useState, useRef, useEffect } from 'react';
import services from '../services.json';
import WhatsNew from '../components/WhatsNew';


import ContactCard from '../components/ContactCard';

function About() {
  const extendedServices = [
    services[services.length - 1],
    ...services,
    services[0],
  ];

  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateCurrentIndex = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollLeft = scrollContainer.scrollLeft;
    const cards = scrollContainer.querySelectorAll('.service-card');
    const containerCenter = scrollLeft + scrollContainer.offsetWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setCurrentIndex(closestIndex - 1);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let isScrolling;

    const onScroll = () => {
      updateCurrentIndex();

      clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
        const scrollLeft = scrollContainer.scrollLeft;
        const cards = scrollContainer.querySelectorAll('.service-card');

        const firstClone = cards[0];
        const lastClone = cards[cards.length - 1];
        const firstReal = cards[1];
        const lastReal = cards[cards.length - 2];

        if (scrollLeft <= firstClone.offsetLeft - scrollContainer.offsetWidth / 2 + firstClone.offsetWidth / 2) {
          scrollContainer.scrollLeft =
            lastReal.offsetLeft - scrollContainer.offsetWidth / 2 + lastReal.offsetWidth / 2;
        }

        else if (scrollLeft >= lastClone.offsetLeft - scrollContainer.offsetWidth / 2 + lastClone.offsetWidth / 2) {
          scrollContainer.scrollLeft =
            firstReal.offsetLeft - scrollContainer.offsetWidth / 2 + firstReal.offsetWidth / 2;
        }
      }, 40);
    };

    scrollContainer.addEventListener('scroll', onScroll);

    const firstRealCard = scrollContainer.querySelectorAll('.service-card')[1];
    if (firstRealCard) {
      scrollContainer.scrollLeft =
        firstRealCard.offsetLeft - scrollContainer.offsetWidth / 2 + firstRealCard.offsetWidth / 2;
    }

    updateCurrentIndex();

    return () => {
      scrollContainer.removeEventListener('scroll', onScroll);
      clearTimeout(isScrolling);
    };
  }, []);

  return (

  <div>

  



 <section className="about">
  <div className="about-content" 
  style={{
    backgroundImage: 'url(/assets/background.png)',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden'

  }}
>
    <div className="about-image">
      <img src="/assets/model.png"  alt='model'/> 
    </div>
    <div >
      <div className="about-description">
  <p>
    Welcome to Olistica Nail Salon and Body Spa, your sanctuary for relaxation, beauty, and self-care.
    We offer a luxurious range of nail services, rejuvenating body treatments, and holistic spa experiences
    designed to refresh your mind, body, and spirit.
    Discover the art of wellness and indulge in the ultimate escape at Olistica.
    Contact us <span className="animated-arrow">🡫</span>
  </p>
</div>



      <div className="contact">
        <ContactCard  />
      </div>
      
      
    </div>





  </div>



</section>


<div className="line" style={{ border:'none'}}></div>
<section className="posting">
  <WhatsNew /> 
</section>





<section style={{ position: 'relative' }}>  


  <div className="services"> 

<div className='line' style={{height:' 15px', border:'none'}}></div>

      <h1 className="book-title">OUR SERVICES</h1>
      <div className="scroll-services" ref={scrollRef}>
        {extendedServices.map((service, i) => (
          <div
            key={i}
            className={`service-card ${i === currentIndex + 1 ? 'active' : ''}`}
          >
            <img src={service.image} alt={`Service ${i}`} className="ellipse-img" />
            {i === currentIndex + 1 && (
              <> 
              <h1 className='service-name'>{service.name}</h1>
              <p className='service-time'><span>·</span> {service.time}</p>
              <p className="description">{service.description}</p>
              </>
             
            )}
          </div>
        ))}
      </div>
    </div>

</section>
    
  </div>

  );
}
export default About;