import React, { useState } from "react";
import "./ContactCard.css";

export default function ContactCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    setRotate((prev) => ({
      x: prev.x - dy * 0.3,
      y: prev.y + dx * 0.3,
    }));
    setStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const shadowX = -rotate.y / 10;
  const shadowY = rotate.x / 10;

  return (
    <div
      className="contact-card"
      style={{
        transform: `
          perspective(1000px)
          rotateX(${rotate.x}deg)
          rotateY(${rotate.y}deg)
        `,
        boxShadow: `${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.3)`
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        className={`contact-card-inner ${isFlipped ? "is-flipped" : ""}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="contact-card-front" 
        style={{
          backgroundImage: 'url("/assets/front2.png")', 
          borderRadius: '6px',
          
         
        }}>

          <img
            src="/assets/O.png" style={{width: '180px'}} className="O-logo" alt="logo"/>
        </div>



    



    
  <div className="contact-card-back" style={{backgroundImage: 'url("/assets/back2.png")'}}>
    

    <div >
  <div className="map" style={{ position:'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '3px solid #9D7B1D'}}>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1299.7233047980765!2d120.27711400587937!3d14.820564742000862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396716cd1803083%3A0x7ac907fbb4babdd1!2sOlistica%20Nail%20Salon%20%26%20Body%20Spa!5e0!3m2!1sen!2sph!4v1751609536657!5m2!1sen!2sph"
      width="200"
      height="200"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Olistica Location"
    ></iframe>
  </div> </div>


  <div  className="contact-info">
      <div className="address">
        <p>Olistica Nail Salon & Body Spa</p>
        <p>Commercial Space B, </p>
          <p>Aurora Suites</p>
        <p>& Pavilion Bldg, Labitan St.,</p>
        <p>Zambales, Philippines</p>
      </div>

    <div className="contact-details">
        <p><strong>Globe: </strong>+63 966 266 8972</p>
        <p><strong>Smart: </strong>+63 949 888 8972</p>
    </div> <hr className="line"></hr>


    <div className="contact-email">
      <p><strong>Email: </strong></p>
        <p>reservations.olisticaspa@gmail.com</p>
    </div>

  </div>
      
          
          
        </div>
      </div>
    </div>
  );
}
