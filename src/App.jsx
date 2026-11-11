import React, { useState, useEffect } from 'react';
import { 
  Cpu, Wrench, Search, Clock, MapPin, PlusCircle, 
  Sparkles, CheckCircle2, ShieldCheck, Tag, X, ArrowRightLeft, DollarSign 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_INVENTORY = [
  {
    id: 1,
    title: 'LM317 Adjustable Regulator & Trimpots Kit',
    category: 'Analog & Power',
    course: 'Analog Circuits / Power Supply Lab',
    condition: 'Tested / Working',
    owner: 'Vivan G.',
    hostel: 'Hostel B',
    estValue: 120,
    status: 'Available',
    returnWindow: '3 Days',
    pickupSpot: 'Block 2 Ground Floor Labs'
  },
  {
    id: 2,
    title: '830-Point Solderless Breadboard + 65 Jumper Wires',
    category: 'Prototyping',
    course: 'Basic Electronics / ECE201',
    condition: 'Like New',
    owner: 'Aishini K.',
    hostel: 'Hostel H',
    estValue: 250,
    status: 'Available',
    returnWindow: '7 Days',
    pickupSpot: 'Library Security Booth'
  },
  {
    id: 3,
    title: 'Digital Multimeter with Continuity Buzzer',
    category: 'Test & Measure',
    course: 'Instrumentation & Measurements',
    condition: 'Fresh 9V Battery Fitted',
    owner: 'Rohan M.',
    hostel: 'Hostel J',
    estValue: 450,
    status: 'Available',
    returnWindow: '2 Days',
    pickupSpot: 'Central Workshop Gate'
  },
  {
    id: 4,
    title: 'ESP32 NodeMCU WiFi + Bluetooth Dev Board',
    category: 'Microcontrollers',
    course: 'Embedded Systems & IoT',
    condition: 'Flash Tested',
    owner: 'Simran K.',
    hostel: 'Hostel G',
    estValue: 380,
    status: 'Available',
    returnWindow: '5 Days',
    pickupSpot: 'CS Department Foyer'
  }
];

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('labgear_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [borrowedItems, setBorrowedItems] = useState(() => {
    const saved = localStorage.getItem('labgear_borrowed');
    return saved ? JSON.parse(saved) : {};
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Analog & Power');
  const [course, setCourse] = useState('');
  const [returnWindow, setReturnWindow] = useState('3 Days');
  const [pickupSpot, setPickupSpot] = useState('');
  const [estValue, setEstValue] = useState(150);

  useEffect(() => {
    localStorage.setItem('labgear_inventory', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('labgear_borrowed', JSON.stringify(borrowedItems));
  }, [borrowedItems]);

  const handleBorrow = (id) => {
    setBorrowedItems(prev => ({ ...prev, [id]: true }));
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'Checked Out' } : item));
    confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
  };

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!title.trim() || !course.trim() || !pickupSpot.trim()) return;

    const newItem = {
      id: Date.now(),
      title,
      category,
      course,
      condition: 'Peer Verified',
      owner: 'You (Peer Donor)',
      hostel: 'Hostel Resident',
      estValue: Number(estValue),
      status: 'Available',
      returnWindow,
      pickupSpot
    };

    setItems([newItem, ...items]);
    setSelectedItem(newItem);
    setShowModal(false);

    setTitle('');
    setCourse('');
    setPickupSpot('');
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const totalSavings = Object.keys(borrowedItems).reduce((sum, id) => {
    const matched = items.find(i => i.id === Number(id));
    return sum + (matched ? matched.estValue : 0);
  }, 450);

  const filteredItems = items.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
                          i.course.toLowerCase().includes(search.toLowerCase()) ||
                          i.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || i.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Bar */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: '#0284c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>LabGearSwap</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Campus Hardware Components & Lab Tool Barter Hub</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(16,185,129,0.12)', color: '#34d399', padding: '6px 12px', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Sparkles size={14} /> ₹{totalSavings} Peer Retail Saved
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlusCircle size={15} /> List Spare Gear
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Left Column: Search & Component Directory */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Search & Category Filter */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search ICs, dev boards, breadboards, sensors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 36px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            
            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc', padding: '0 12px', fontSize: '13px' }}
            >
              <option value="All">All Hardware</option>
              <option value="Analog & Power">Analog & Power</option>
              <option value="Prototyping">Prototyping</option>
              <option value="Test & Measure">Test & Measure</option>
              <option value="Microcontrollers">Microcontrollers</option>
            </select>
          </div>

          {/* Component Inventory Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {filteredItems.map(item => {
              const isSelected = selectedItem.id === item.id;
              const isBorrowed = item.status === 'Checked Out' || borrowedItems[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    background: isSelected ? '#1e293b' : '#0f172a',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid #1e293b',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(56,189,248,0.12)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      {item.category}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: isBorrowed ? '#f87171' : '#34d399',
                      background: isBorrowed ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {isBorrowed ? 'Checked Out' : 'Available Now'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '8px 0 4px 0', color: '#ffffff' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0' }}>
                    {item.course}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                    <span>Loan Window: <strong style={{ color: '#cbd5e1' }}>{item.returnWindow}</strong></span>
                    <span>Retail: <strong style={{ color: '#38bdf8' }}>₹{item.estValue}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Checkout Inspector & Safe Meetup Info */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '22px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Component Inspector & Escrow
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 10px 0' }}>{selectedItem.title}</h2>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 16px 0' }}>For {selectedItem.course}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#030712', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Component Donor:</span>
                <strong style={{ color: '#f8fafc' }}>{selectedItem.owner} ({selectedItem.hostel})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Condition:</span>
                <span style={{ color: '#34d399', fontWeight: '600' }}>{selectedItem.condition}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Borrow Period:</span>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>{selectedItem.returnWindow} (No Fee)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Campus Handover Spot:</span>
                <span style={{ color: '#38bdf8' }}>{selectedItem.pickupSpot}</span>
              </div>
            </div>

            {/* Action Button */}
            {selectedItem.status === 'Checked Out' || borrowedItems[selectedItem.id] ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7' }}>
                <CheckCircle2 size={18} />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>Requested! Coordinate at {selectedItem.pickupSpot}</span>
              </div>
            ) : (
              <button
                onClick={() => handleBorrow(selectedItem.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ArrowRightLeft size={16} /> Request Component for Lab Evaluation
              </button>
            )}
          </div>

          {/* Lab Integrity Card */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '18px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 10px 0', color: '#cbd5e1' }}>Lab Honor Code & Care Guidelines</h3>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Avoid overvoltage or reversed polarities on IC chips and development boards.</li>
              <li>Return items promptly to ensure peers can prepare for their evaluation slots.</li>
              <li>Always execute swaps at public campus security or lab reception desks.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* List Item Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>List Spare Hardware / Tool</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setShowModal(false)} />
            </div>

            <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Component / Kit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raspberry Pi Pico + Breadboard"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                  >
                    <option value="Analog & Power">Analog & Power</option>
                    <option value="Prototyping">Prototyping</option>
                    <option value="Test & Measure">Test & Measure</option>
                    <option value="Microcontrollers">Microcontrollers</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Relevant Course</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ECE201 / IoT Lab"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Loan Window</label>
                  <select
                    value={returnWindow}
                    onChange={e => setReturnWindow(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                  >
                    <option value="2 Days">2 Days</option>
                    <option value="3 Days">3 Days</option>
                    <option value="5 Days">5 Days</option>
                    <option value="7 Days">7 Days</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Est. Value (₹)</label>
                  <input
                    type="number"
                    value={estValue}
                    onChange={e => setEstValue(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Safe Handover Spot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block 2 Lab Corridor or Central Library"
                  value={pickupSpot}
                  onChange={e => setPickupSpot(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Post Component to Peer Board 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}