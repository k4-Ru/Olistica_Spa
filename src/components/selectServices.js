
// ServiceSelector.jsx
import React, { useEffect, useMemo, useState } from "react";
import servicesData from "../services/categories_with_services.json";

// ---- tiny styles (inline, no CSS framework) ----
const S = {
  page: { maxWidth: 1600, margin: "10px auto", padding: "0 16px", fontFamily: "albert sans, sans-serif" },
  // row: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 },

  row: { 
  display: "flex",
  gap: 16,
  flexDirection: window.innerWidth < 768 ? "column" : "row"
},

  card: { border: "1px solid #ddd", borderRadius: 12, padding: 16, background: "#fff", height: "auto", width: "auto" },
  header: { marginBottom: 10, fontSize: 24, fontWeight: 700 },
  muted: { color: "#666" },
  input: { width: "90%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", fontSize: 20, fontFamily: "albert sans, sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", outline: "none", transition: "border-color 0.2s ease-in-out" },
  list: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  pill: (active) => ({
    padding: "12px 16px",
    borderRadius: 999, 
    border: "1px solid " + (active ? "#444" : "#ccc"),
    background: active ? "#DDAD18" : "#f2f2f2",
    cursor: "pointer",
    fontSize: 19,
    fontFamily: "albert sans, sans-serif",
    fontWeight: active ? 500 : 600,
    color: active ? "#fafafa" : "#333",
    boxshadow: "0 2px 16px rgba(0,0,0,4px)",
  
  }),
  svcRow: { display: "flex", justifyContent: "space-between", gap: 12, padding: 12, border: "1px solid #eee", borderRadius: 10 },
  right: { minWidth: 250, top: 16, alignSelf: "start", position: "sticky" },
  btn: { padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc", background: "#fafafa", cursor: "pointer", fontSize: 20},
  removebtn: { fontSize: 16,padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc", background: "#b84f35ff", cursor: "pointer", color: "#faf3e6" },
  btnPrimary: { padding: "10px 12px", borderRadius: 10, border: "1px solid #333", background: "#111", color:"#faf3e6", cursor: "pointer", fontSize: 20, fontFamily: "albert sans, sans-serif", fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", transition: "background-color 0.2s ease-in-out", outline: "none" },
  price: { fontWeight: 600, color:"#424242ff" },
  badge: { padding: "2px 8px", border: "none", borderRadius: 999, fontSize: 18, marginLeft: 8, backgroundColor:"#DDAD18", color: "#eeeaeaff", fontWeight:500 },
  sectionTitle: { margin: "12px 0 8px", fontWeight: 600 },
  hr: { border: 0, borderTop: "1px solid #424242ff", margin: "12px 0" },
};






// ---- utils ----
function money(n, currency = "₱") {
  const num = Number(n);
  return `${currency}${(Number.isFinite(num) ? num : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

// ---- Core component ----
export function ServiceSelector({ data, currency = "₱", onChange }) {
  const [query, setQuery] = useState("");
  const [activeCatId, setActiveCatId] = useState(
    data && data.length ? String(data[0].id) : "0"
  );

  // selected services: { [serviceId]: true/false }
  const [selectedServices, setSelectedServices] = useState({});
  // selected addons per category: { [categoryId]: { [addonId]: true/false } }
  const [selectedAddons, setSelectedAddons] = useState({});

  const activeCategory = useMemo(
    () => data.find((c) => String(c.id) === String(activeCatId)) || data[0],
    [data, activeCatId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.map((cat) => ({
      ...cat,
      services: cat.services.filter((s) =>
        [s.name, s.description, cat.category]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(q))
      ),
      addons: (cat.addons || []).filter((a) =>
        [a.addon_name, a.addon_description]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(q))
      ),
    }));
  }, [data, query]);

  const selection = useMemo(() => {
    const items = [];
    let subtotal = 0;

    data.forEach((cat) => {
      (cat.services || []).forEach((svc) => {
        if (selectedServices[svc.id || svc.name]) {
  const addonsMap = selectedAddons[String(cat.id)] || {};
  const chosenAddons = (cat.addons || []).filter(
    (a) => addonsMap[a.id || a.addon_name]
  );
  const svcPrice = Number(svc.price) || 0;
  const addTotal = chosenAddons.reduce((sum, a) => sum + (Number(a.addon_price) || 0), 0);
  subtotal += svcPrice + addTotal;
  items.push({
    categoryId: cat.id,
    categoryName: cat.category,
    service: svc,
    addons: chosenAddons,
  });
}

      });
    });

    return { items, subtotal, currency };
  }, [data, selectedServices, selectedAddons, currency]);

  useEffect(() => {
    if (typeof onChange === "function") onChange(selection);
  }, [selection, onChange]);

  function toggleService(svc, catId) {
  const key = svc.id || svc.name; // fallback if no id
  setSelectedServices((prev) => ({ ...prev, [key]: !prev[key] }));
}

function toggleAddon(addon, catId) {
  const cid = String(catId);
  const key = addon.id || addon.addon_name;

  setSelectedAddons((prev) => {
    const bucket = prev[cid] || {};
    return {
      ...prev,
      [cid]: { ...bucket, [key]: !bucket[key] },
    };
  });
}


  function clearAll() {
    setSelectedServices({});
    setSelectedAddons({});
  }

  const filteredActive =
    (filtered.find((c) => String(c.id) === String(activeCatId)) || filtered[0]) || activeCategory;

  return (



    <div style={{width: "100%",}}>
      
      <div style={{ marginBottom: 24,}}>
        <a href="/OlisticaMenu.pdf" download="Olistica-Service-Menu.pdf">
        <button style={S.btnPrimary }>Take a look at our Menu</button>
      </a>
      </div>



      {/* Search */}
      <div style={{ ...S.card, marginBottom: 12 }}>
        <input
          className="search-ph"
          style={S.input}
          placeholder="🔍︎ Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

      
      

      </div>

      <div className="service-selector"style={S.row}>
        {/* Left: categories + services/addons */}
        <div>
          {/* Categories */}
          <div style={{ ...S.card, marginBottom: 12, gridAutoRows: "2fr 1fr" }}>
            <div style={S.header}>Categories</div>
            <hr style={S.hr} />

            <div className="category-name" style={S.list}>
              {data.map((cat) => {
                const active = String(cat.id) === String(activeCatId);
                return (
                  <button
                  className="category-name"
                    key={cat.id}
                    type="button"
                    style={S.pill(active)}
                    onClick={() => setActiveCatId(String(cat.id))}
                    
                  >
                    {cat.category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services + Addons for active category (filtered) */}
          {filteredActive && (
            <div className="services-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "1.5fr 1fr" }}>
              {/* Services */}
              <div className="services"style={S.card}>
                <div className="header" style={S.header}>{filteredActive.category}</div> 
                <hr style={S.hr} />

                <div style={{ display: "grid", gap: 10 }}>
                  {(filteredActive.services || []).length === 0 && (
                    <div style={S.muted}>No services match your search.</div>
                  )}
                  {(filteredActive.services || []).map((svc) => {
                    const checked = !!selectedServices[svc.id];
                    return (
                      <div key={svc.id} style={S.svcRow}>
                        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleService(svc, filteredActive.id)}
                            style={{ marginTop: 3, width: 20, height: 20, cursor: "pointer", accentColor: '#4CAF50'}}
                          />
                          <div>
                            <div className= "services"style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: "24px" }}>
                              <span style={{ fontWeight: 600 }}>{svc.name}</span>
                              {filteredActive.has_best_seller && svc.best_seller ? (
                                <span className="best-seller" style={S.badge}>♕ Best Seller</span>
                              ) : null}
                            </div>
                            {svc.description ? (
                              <div className="description"style={{ ...S.muted, fontSize: 20, marginTop: 4 }}>{svc.description}</div>
                            ) : null}
                            <div style={{ marginTop: 6, display: "flex", gap: 12, fontSize: 20 }}>
                              <span className="price"style={S.price}>{money(svc.price, currency)}</span>
                              {filteredActive.has_duration && svc.duration ? (
                                <span className="duration"style={S.muted}>• {svc.duration}</span>
                              ) : null}
                            </div>
                          </div>
                        </label>

                        {/*checked ? (
                          <button type="button" onClick={() => toggleService(svc, filteredActive.id)} style={S.removebtn}>
                            Remove
                          </button>
                        ) : null*/}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons */}
              <div style={S.card}>
                <div className="header"style={S.header}>Add-ons</div> 
                <hr style={S.hr} />

                {filteredActive.has_addons && (filteredActive.addons || []).length > 0 ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    {filteredActive.addons.map((addon) => {
                      const checked =
                        !!(selectedAddons[String(filteredActive.id)] &&
                           selectedAddons[String(filteredActive.id)][addon.id]);
                      return (
                        <div key={addon.id} style={S.svcRow}>
                          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleAddon(addon, filteredActive.id)}
                              style={{ marginTop: 3, width: 20, height: 20, cursor: "pointer", accentColor: '#4CAF50' }}
                            />
                            <div>
                              <div className="addon-name"style={{ fontWeight: 500, fontSize: 20}}>{addon.addon_name}</div>
                              {addon.addon_description ? (
                                <div className="addon-desc"style={{ ...S.muted, fontSize: 18 , marginTop: 4 }}>
                                  {addon.addon_description}
                                </div>
                              ) : null}
                              <div className="addon-price"style={{ marginTop: 6, fontSize: 18, ...S.price }}>
                                {money(addon.addon_price, currency)}
                              </div>
                            </div>
                          </label>

                          {/*checked ? (
                            <button
                              type="button"
                              onClick={() => toggleAddon(addon, filteredActive.id)}
                              style={S.removebtn}
                            >
                              Remove
                            </button>
                          ) : null*/}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ height: "100px"}}>
                    <div style={S.muted}>No add-ons for this category.</div>
                  </div>
                  
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Cart summary */}

        <div className="cart">
        <div style={S.right}>
          <div style={S.card}>
            <div style={S.header}>Selected Services</div>
            <hr style={S.hr} />

            {selection.items.length === 0 ? (
              <div style={S.muted}>No services selected yet.</div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {selection.items.map((item) => (
                  <div key={item.service.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600 , fontSize:20}}>{item.service.name}</div>
                        <div style={{ ...S.muted, fontSize: 13 }}>{item.categoryName}</div>
                      </div>
                      <div style={{ fontSize: 16, ...S.price }}>{money(item.service.price, currency)}</div>
                    </div>

                    {item.addons.length > 0 && (
                      <div style={{ marginTop: 8, fontSize: 15 }}>
                        <div style={S.muted}>★Add-ons</div>
                        <div>
                          {item.addons.map((a) => (
                            <div key={a.id} style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>{a.addon_name}</span>
                              <span>{money(a.addon_price, currency)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <hr style={S.hr} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20}}>
              <span style={{ fontWeight: 700 }}>Subtotal</span>
              <span style={{ fontWeight: 800}}>{money(selection.subtotal, currency)}</span>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" style={S.btn} onClick={clearAll}>Clear</button>

              {/*
              <button
                type="button"
                style={S.btnPrimary}
                onClick={() => typeof onChange === "function" && onChange(selection)}
              >
                Continue
              </button>
              */}

            </div>
          </div>
        </div>
        </div>
      </div>      
    </div>
  );
}


export default function BookingPage() {
  return (
    <div style={S.page}>
      <h1 style={{ fontWeight: 500,marginBottom: 24, fontFamily: "albert sans", color: "#DDAD18", fontSize: 32 }}>Select Services</h1>
     

      <ServiceSelector
        data={servicesData}
        currency="₱"
        onChange={(payload) => console.log("Selected:", payload)}
      />
    </div>
  );
}
