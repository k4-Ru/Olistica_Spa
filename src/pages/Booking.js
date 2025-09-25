import React, { useState } from "react";
import dayjs from "dayjs";
import ServicesSection from "../components/selectServices";

function Booking() {


  const [cartSelection, setCartSelection] = useState({ items: [], subtotal: 0, currency: "₱" });
  const servicesData = require("../services/categories_with_services.json");

  
  //loading state
  const [isLoading, setIsLoading] = useState(false);


  //for modals
  const [showResultModal, setShowResultModal] = useState(false);
  const [bookingResult, setBookingResult] = useState([]);



  // for calendar
  const today = dayjs();
  const [currentMonth] = useState(today.startOf("month"));
  const startDay = currentMonth.startOf("week");
  const endDay = currentMonth.endOf("month").endOf("week");
  const days = [];
  let date = startDay.clone();
  while (date.isBefore(endDay, "day") || date.isSame(endDay, "day")) {
    days.push(date);
    date = date.add(1, "day");
  }

  // for time slots
  const timeSlots = [];

let start = new Date();
start.setHours(9, 30, 0, 0); // 9:30 AM

let end = new Date();
end.setHours(22, 30, 0, 0); // 10:30 PM

while (start <= end) {
  const hour = start.getHours();
  const minutes = start.getMinutes();
  const ampm = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const minutesStr = minutes === 0 ? "00" : "30";
  timeSlots.push(`${hour12}:${minutesStr} ${ampm}`);
  start.setMinutes(start.getMinutes() + 30);
}



  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    date: "",
    time: "",
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDateSelect = (day) => {
    setForm(prev => ({ ...prev, date: day.format("YYYY-MM-DD") }));
  };

  const isPastDate = (day) => day.isBefore(today, "day");



const handleConfirmBooking = async () => {
  console.log("🔍 Form data:", form);
  console.log("🔍 Selected slot:", selectedSlot, "Time:", timeSlots[selectedSlot]);
  console.log("🔍 Cart selection:", cartSelection);

  if (
    !form.name ||
    !form.email ||
    !form.contact ||
    !form.date ||
    selectedSlot === null ||
    cartSelection.items.length === 0
  ) {
    if (!form.name) console.warn("⚠️ Missing: Name");
    if (!form.email) console.warn("⚠️ Missing: Email");
    if (!form.contact) console.warn("⚠️ Missing: Contact");
    if (!form.date) console.warn("⚠️ Missing: Date");
    if (selectedSlot === null) console.warn("⚠️ Missing: Time slot");
    if (cartSelection.items.length === 0) console.warn("⚠️ Missing: Services");

    alert("Please fill out all fields.");
    return;
  }

  if (isLoading) return;
  setIsLoading(true);

  const bookingData = {
    ...form,
    date: form.date,
    time: timeSlots[selectedSlot],
    service: cartSelection.items.map((item) => ({
      name: item.service.name,
      price: item.service.price,
      addons: item.addons.map((a) => ({
        name: a.addon_name,
        price: a.addon_price,
      })),
    })),
    subtotal: cartSelection.subtotal,
    currency: cartSelection.currency,
  };

  console.log("✅ Final bookingData payload:", bookingData);

  try {
    const response = await fetch("/api/server", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();
    console.log("📩 Server response:", result);

    if (result?.success) {
      setBookingResult("success");
    } else {
      setBookingResult("error");
    }
  } catch (error) {
    console.error("❌ Fetch error:", error);
    setBookingResult("error");
  } finally {
    setIsLoading(false);
    setShowModal(false);
    setShowResultModal(true);
  }
};



  return (
    <div>
      <section className="booking">
        <h1 className="booking-steps" style={{ textAlign: "center", marginBottom: "30px", fontWeight: "400" }}>
          <span>Select Time and Date →</span>
          <span style={{ marginLeft: '10px' }}>Select Type of Service →</span>
          <span style={{ marginLeft: '10px' }}>Fill out Information.</span>
        </h1>

        <h2>{currentMonth.format("MMMM YYYY")}</h2>
        <div className="booking-container">
          {/* Calendar */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="calendar">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="calendar-label">{d}</div>
              ))}
              {days.map((day) => {
                const isCurrentMonth = day.month() === currentMonth.month();
                const past = isPastDate(day);
                const isSelected = form.date === day.format("YYYY-MM-DD");
                let classNames = "calendar-day";
                if (!isCurrentMonth) classNames += " outside";
                if (past) classNames += " past";
                if (isSelected) classNames += " selected";
                return (
                  <div
                    key={day.format("YYYY-MM-DD")}
                    className={classNames}
                    onClick={() => { if (!past && isCurrentMonth) handleDateSelect(day); }}
                  >
                    {day.date()}
                  </div>
                );
              })}
            </div>
          </div>


          {/* Time */}
          <div className="time-selector-container">
            <h1 className="time-selector-title">Select a time</h1>
            <div className="time-slots-scroll">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`time-slot ${selectedSlot === index ? "selected" : ""}`}
                  onClick={() => setSelectedSlot(index)}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>





      <section className="select-services" style={{width: "100%"}}>
        <ServicesSection
          data={servicesData}
          currency="₱"
          onChange={setCartSelection} 
        />
      </section>

































































      {/* Form */}
      <section className="booking" style={{ padding: "0px", backgroundColor: "#171915" }}>
        <div>
          <h2 className="h2-fillout"style={{ color: "#DDAD18", padding: "20px", marginBottom: '0px' }}>Fill out needed Information</h2>
          <div className="fields"style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <form className="info-form">
  <div className="inputs">
    <label htmlFor="name">Name</label>
    <input
      type="text"
      id="name"
      placeholder="Full name"
      value={form.name}
      onChange={(e) => {
        const value = e.target.value;
        // Allow only letters and spaces
        if (/^[a-zA-Z\s]*$/.test(value)) {
          setForm(prev => ({ ...prev, name: value }));
        }
      }}
      required
      title="Name must only contain letters and spaces"
    />
  </div>
  <div>
    <label htmlFor="email">Email</label>
    <input
      type="email"
      id="email"
      placeholder="youremail@email.com"
      value={form.email}
      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
      required
      pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
      title="Enter a valid email address"
    />
  </div>
  <div>
    <label htmlFor="contact">Contact Number</label>
    <input
  type="tel"
  id="contact"
  placeholder="09XXXXXXXXX"
  value={form.contact}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only numbers, must start with '09', and max length 11
    if (/^\d*$/.test(value) && value.length <= 11) {
      setForm(prev => ({ ...prev, contact: value }));
    }
  }}
  required
  minLength={11}
  maxLength={11}
  pattern="09\d{9}"
  title="Contact number must be exactly 11 digits and start with '09'"
/>

  </div>
</form>


            <button
  className="confirm-button"
  style={{ marginTop: "20px", marginBottom: "20px" }}
  onClick={() => {
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const contactPattern = /^\d{11}$/;

    if (
      !form.name ||
      !form.email ||
      !form.contact ||
      !form.date ||
      cartSelection.items.length === 0
    ) {
      alert("Please fill out all fields.");
      return;
    }

    if (!emailPattern.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!contactPattern.test(form.contact)) {
      alert("Contact number must be exactly 11 digits.");
      return;
    }

    setShowModal(true);
  }}
>
  Confirm Booking
</button>


          </div>
        </div>
      </section>






      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Booking Summary</h2> <hr></hr>

            
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Email:</strong> {form.email}</p>
             <p><strong>Contact:</strong> {form.contact}</p> <hr></hr>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <p><strong>Date:</strong> {form.date}</p>
            <p><strong>Time:</strong> {selectedSlot !== null ? timeSlots[selectedSlot] : "-"}</p></div>

            <hr></hr>

            
            




          {cartSelection.items.length > 0 ? (
  <div style={{ overflowY: "auto" }}>
    <p style={{ marginTop: "0px" }}><strong>Services:</strong></p>
    <ul className="service-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {cartSelection.items.map(item => (
        <li key={item.service.id} className="service-item">
          <span className="service-item">{item.service.name}</span>
          <span className="service-price">
            {cartSelection.currency}{Number(item.service.price).toLocaleString()}
          </span>

          {/* Show Add-ons if selected */}
          {item.addons.length > 0 && (
            <ul style={{ listStyle: "none", paddingLeft: "16px", marginTop: "4px" }}>
              {item.addons.map(addon => (
                <li key={addon.id} style={{ fontSize: "14px", color: "#555" }}>
                  ➝ {addon.addon_name}
                  <span style={{ float: "right" }}>
                    {cartSelection.currency}{Number(addon.addon_price).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
    <hr />
    <p style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace" }}>
      <strong>Total</strong>
      <strong>
        {cartSelection.currency}{cartSelection.subtotal.toLocaleString()}
      </strong>
    </p>
  </div>
) : (
  <p style={{ marginTop: "0px" }}><strong>Services:</strong> -</p>
)}


            
            <div className="modal-buttons-wrap" style={{ marginTop: "20px" }}>
              <button className="modal-button confirm" onClick={handleConfirmBooking} disabled={isLoading}> {isLoading ? "Loading..." : "Confirm"} </button>
              <button className="modal-button cancel"  onClick={() => setShowModal(false)} disabled={isLoading}>Cancel</button>
            </div>
          </div>
        </div>
      )}  


      {showResultModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      {bookingResult === "success" ? (
        <div className="booking-result">
          <h2>Thank you for booking with us!</h2>  <hr></hr>
          <p><strong>{form.name}</strong>, your appointment has been successfully booked for <strong>{form.date}</strong> at <strong>{timeSlots[selectedSlot]}</strong>.</p>
          <p>Payment will be made at the spa upon arrival.</p>
          <p>For concerns, contact us directly. <br></br>
          holistic.olistica@gmail.com  <br></br>
          09123456789</p>
          
        </div>
      ) : (
        <div className="booking-result">
          <h2>Booking Failed</h2> <hr></hr>
          <p>Sorry, we couldn’t process your booking. Please try again later or contact us directly.</p>
          <p>holisitc.olistica@gmail.com <br></br>
          09123456789</p>
        </div> 
      )}<div style={{ display: "flex", justifyContent: "center" }}>
      <button  className="modal-button close" onClick={() => setShowResultModal(false)} style={{marginTop: "20px" }}>Close</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Booking;
