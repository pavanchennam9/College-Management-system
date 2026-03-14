import { useState } from 'react';
import { MapPin, Clock, IndianRupee, ExternalLink, Search, Filter, Briefcase, GraduationCap, Star, Building2, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';

// Company data with real logo URLs via Clearbit/favicon services
const COMPANIES = [
  // Top Tech MNCs
  { id: 1, name: 'Google', logo: 'https://logo.clearbit.com/google.com', type: 'internship', role: 'Software Engineering Intern', package: '₹1,20,000/month', location: 'Bangalore', deadline: '2025-04-15', cgpa: 8.0, dept: ['CSE', 'IT'], skills: ['Python', 'Algorithms', 'ML'], desc: 'Work on Google-scale systems with world-class engineers. Rotate across teams in Search, Cloud, or AI.', status: 'open', seats: 5, category: 'tech' },
  { id: 2, name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', type: 'placement', role: 'Software Development Engineer', package: '₹45 LPA', location: 'Hyderabad', deadline: '2025-04-20', cgpa: 7.5, dept: ['CSE', 'IT', 'ECE'], skills: ['C++', 'Azure', 'DSA'], desc: 'Join Microsoft to build products used by billions. Full-time role with relocation support and stock options.', status: 'open', seats: 10, category: 'tech' },
  { id: 3, name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', type: 'placement', role: 'SDE-1', package: '₹32 LPA', location: 'Hyderabad / Bangalore', deadline: '2025-05-01', cgpa: 7.0, dept: ['CSE', 'IT'], skills: ['Java', 'AWS', 'System Design'], desc: 'Build solutions at Amazon scale. Join AWS, Alexa, or Prime teams. Day 1 impact with leadership principles.', status: 'open', seats: 20, category: 'tech' },
  { id: 4, name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', type: 'internship', role: 'Product Engineering Intern', package: '₹1,50,000/month', location: 'Remote / Gurugram', deadline: '2025-04-10', cgpa: 8.5, dept: ['CSE'], skills: ['React', 'GraphQL', 'Distributed Systems'], desc: 'Intern on Meta platforms — Instagram, WhatsApp, Facebook. Build features for 3B+ users.', status: 'open', seats: 3, category: 'tech' },
  { id: 5, name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', type: 'internship', role: 'iOS Developer Intern', package: '₹1,10,000/month', location: 'Hyderabad', deadline: '2025-04-25', cgpa: 8.0, dept: ['CSE', 'IT'], skills: ['Swift', 'Xcode', 'Objective-C'], desc: 'Intern on core iOS frameworks used in iPhone, iPad, and Apple Watch products globally.', status: 'open', seats: 4, category: 'tech' },
  { id: 6, name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com', type: 'placement', role: 'Senior Software Engineer', package: '₹80 LPA', location: 'Remote', deadline: '2025-05-15', cgpa: 8.0, dept: ['CSE'], skills: ['Java', 'Microservices', 'Kafka'], desc: 'Work on Netflix streaming infrastructure serving 240M+ subscribers worldwide.', status: 'open', seats: 2, category: 'tech' },
  { id: 7, name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com', type: 'placement', role: 'Systems Engineer', package: '₹6.5 LPA', location: 'Pan India', deadline: '2025-06-01', cgpa: 6.5, dept: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'], skills: ['Java', 'SQL', 'Communication'], desc: 'Join Infosys as Systems Engineer. Comprehensive training at Mysore campus. Global project exposure.', status: 'open', seats: 500, category: 'service' },
  { id: 8, name: 'TCS', logo: 'https://logo.clearbit.com/tcs.com', type: 'placement', role: 'Assistant System Engineer', package: '₹7 LPA', location: 'Pan India', deadline: '2025-06-10', cgpa: 6.0, dept: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'], skills: ['Python', 'SQL', 'Agile'], desc: 'TCS offers unmatched learning in digital, AI and cloud. Be part of a 600,000+ global workforce.', status: 'open', seats: 1000, category: 'service' },
  { id: 9, name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com', type: 'placement', role: 'Project Engineer', package: '₹6.5 LPA', location: 'Bangalore / Pune', deadline: '2025-06-15', cgpa: 6.0, dept: ['CSE', 'IT', 'ECE', 'EEE'], skills: ['Java', 'Testing', 'DevOps'], desc: 'Wipro Project Engineers work across banking, retail, healthcare domains with global clients.', status: 'open', seats: 800, category: 'service' },
  { id: 10, name: 'Cognizant', logo: 'https://logo.clearbit.com/cognizant.com', type: 'placement', role: 'Programmer Analyst', package: '₹7.5 LPA', location: 'Chennai / Hyderabad', deadline: '2025-06-20', cgpa: 6.0, dept: ['CSE', 'IT', 'ECE'], skills: ['C#', '.NET', 'SQL'], desc: 'Cognizant PA role offers career path from analyst to architect with structured L&D programs.', status: 'open', seats: 600, category: 'service' },
  { id: 11, name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com', type: 'placement', role: 'Associate Software Engineer', package: '₹8 LPA', location: 'Pan India', deadline: '2025-06-25', cgpa: 6.5, dept: ['CSE', 'IT', 'ECE', 'EEE'], skills: ['Java', 'Cloud', 'DevOps'], desc: 'Join Accenture Technology and work with Fortune 500 clients on digital transformation projects.', status: 'open', seats: 700, category: 'service' },
  { id: 12, name: 'Deloitte', logo: 'https://logo.clearbit.com/deloitte.com', type: 'placement', role: 'Technology Analyst', package: '₹12 LPA', location: 'Hyderabad / Mumbai', deadline: '2025-05-20', cgpa: 7.0, dept: ['CSE', 'IT', 'MECH', 'CIVIL'], skills: ['SAP', 'Consulting', 'Analytics'], desc: 'Deloitte Technology practice works on cutting-edge SAP, AI, and Cloud consulting for top clients.', status: 'open', seats: 50, category: 'consulting' },
  { id: 13, name: 'Salesforce', logo: 'https://logo.clearbit.com/salesforce.com', type: 'internship', role: 'Software Engineer Intern', package: '₹90,000/month', location: 'Hyderabad', deadline: '2025-04-30', cgpa: 7.5, dept: ['CSE', 'IT'], skills: ['Apex', 'JavaScript', 'APIs'], desc: 'Build the future of CRM at Salesforce. Work with Trailblazers on Slack, Commerce Cloud, and Sales Cloud.', status: 'open', seats: 8, category: 'tech' },
  { id: 14, name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com', type: 'internship', role: 'Research Scientist Intern', package: '₹1,00,000/month', location: 'Noida', deadline: '2025-04-18', cgpa: 8.0, dept: ['CSE'], skills: ['Deep Learning', 'Computer Vision', 'PyTorch'], desc: 'Adobe Research internship in GenAI — Firefly, Photoshop AI, and creative intelligence systems.', status: 'open', seats: 4, category: 'tech' },
  { id: 15, name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com', type: 'placement', role: 'Associate Developer', package: '₹8.5 LPA', location: 'Bangalore / Pune', deadline: '2025-05-25', cgpa: 7.0, dept: ['CSE', 'IT', 'ECE'], skills: ['Java', 'Watson', 'Cloud'], desc: 'IBM offers roles in Watson AI, Red Hat, and IBM Cloud. Work on enterprise AI and quantum computing.', status: 'open', seats: 80, category: 'tech' },
  { id: 16, name: 'Oracle', logo: 'https://logo.clearbit.com/oracle.com', type: 'placement', role: 'Applications Developer', package: '₹14 LPA', location: 'Hyderabad / Bangalore', deadline: '2025-05-10', cgpa: 7.5, dept: ['CSE', 'IT'], skills: ['SQL', 'Java', 'PL/SQL'], desc: 'Oracle Cloud Infrastructure team builds global cloud services. Strong database and cloud expertise gained.', status: 'open', seats: 40, category: 'tech' },
  { id: 17, name: 'Samsung', logo: 'https://logo.clearbit.com/samsung.com', type: 'internship', role: 'R&D Intern', package: '₹60,000/month', location: 'Noida / Bangalore', deadline: '2025-05-05', cgpa: 7.5, dept: ['ECE', 'EEE', 'CSE'], skills: ['C/C++', 'Embedded', 'Android'], desc: 'Samsung R&D India works on mobile processors, display technology, and next-gen Android systems.', status: 'open', seats: 15, category: 'hardware' },
  { id: 18, name: 'Qualcomm', logo: 'https://logo.clearbit.com/qualcomm.com', type: 'placement', role: 'Engineer - VLSI Design', package: '₹20 LPA', location: 'Hyderabad', deadline: '2025-05-08', cgpa: 7.5, dept: ['ECE', 'EEE'], skills: ['VLSI', 'Verilog', 'Signal Processing'], desc: 'Qualcomm designs the world\'s most advanced mobile chips. Join Snapdragon design verification or RF teams.', status: 'open', seats: 20, category: 'hardware' },
  { id: 19, name: 'Texas Instruments', logo: 'https://logo.clearbit.com/ti.com', type: 'internship', role: 'Analog Design Intern', package: '₹55,000/month', location: 'Bangalore', deadline: '2025-04-22', cgpa: 7.0, dept: ['ECE', 'EEE'], skills: ['Analog Design', 'SPICE', 'PCB'], desc: 'TI internship in semiconductor analog IC design — op-amps, DACs, power management circuits.', status: 'open', seats: 10, category: 'hardware' },
  { id: 20, name: 'Bosch', logo: 'https://logo.clearbit.com/bosch.com', type: 'placement', role: 'Embedded Systems Engineer', package: '₹9 LPA', location: 'Coimbatore / Bangalore', deadline: '2025-06-05', cgpa: 6.5, dept: ['ECE', 'EEE', 'MECH'], skills: ['Embedded C', 'CAN Bus', 'AUTOSAR'], desc: 'Bosch Engineering Center works on automotive software for connected vehicles, EV systems, and IoT sensors.', status: 'open', seats: 30, category: 'hardware' },
  { id: 21, name: 'L&T Technology Services', logo: 'https://logo.clearbit.com/ltts.com', type: 'placement', role: 'Engineer Trainee', package: '₹7 LPA', location: 'Vadodara / Mysore', deadline: '2025-06-12', cgpa: 6.5, dept: ['MECH', 'CIVIL', 'EEE', 'ECE'], skills: ['CAD', 'Simulation', 'Design'], desc: 'LTTS provides engineering R&D services to global industrial, medical, and mobility clients.', status: 'open', seats: 200, category: 'engineering' },
  { id: 22, name: 'Tata Motors', logo: 'https://logo.clearbit.com/tatamotors.com', type: 'placement', role: 'Graduate Engineer Trainee', package: '₹6 LPA', location: 'Pune / Jamshedpur', deadline: '2025-06-18', cgpa: 6.0, dept: ['MECH', 'CIVIL', 'EEE'], skills: ['CAD', 'Manufacturing', 'Quality'], desc: 'Tata Motors GET program rotates across R&D, manufacturing, and supply chain over 2 years.', status: 'open', seats: 100, category: 'engineering' },
  { id: 23, name: 'Mahindra', logo: 'https://logo.clearbit.com/mahindra.com', type: 'internship', role: 'Design Engineering Intern', package: '₹35,000/month', location: 'Pune', deadline: '2025-05-12', cgpa: 6.5, dept: ['MECH', 'EEE'], skills: ['SolidWorks', 'CATIA', 'FEA'], desc: 'Mahindra automotive internship in EV design, structural analysis, and powertrain systems.', status: 'open', seats: 25, category: 'engineering' },
  { id: 24, name: 'Goldman Sachs', logo: 'https://logo.clearbit.com/goldmansachs.com', type: 'placement', role: 'Technology Analyst', package: '₹28 LPA', location: 'Bangalore / Hyderabad', deadline: '2025-04-28', cgpa: 7.5, dept: ['CSE', 'IT'], skills: ['Java', 'Python', 'Financial Systems'], desc: 'Goldman Sachs Engineering Division builds trading systems, risk platforms, and quantitative tools.', status: 'open', seats: 15, category: 'fintech' },
  { id: 25, name: 'JPMorgan Chase', logo: 'https://logo.clearbit.com/jpmorganchase.com', type: 'placement', role: 'Software Engineer', package: '₹22 LPA', location: 'Hyderabad / Mumbai', deadline: '2025-05-02', cgpa: 7.0, dept: ['CSE', 'IT'], skills: ['Python', 'React', 'Risk Systems'], desc: 'JP Morgan Code for Good and Technology programs build next-gen banking platforms at global scale.', status: 'open', seats: 20, category: 'fintech' },
  { id: 26, name: 'Flipkart', logo: 'https://logo.clearbit.com/flipkart.com', type: 'placement', role: 'SDE-1', package: '₹22 LPA', location: 'Bangalore', deadline: '2025-05-18', cgpa: 7.0, dept: ['CSE', 'IT'], skills: ['Java', 'Kafka', 'Microservices'], desc: 'Flipkart Engineering works on supply chain, search, and payments for India\'s largest e-commerce platform.', status: 'open', seats: 25, category: 'tech' },
  { id: 27, name: 'Zomato', logo: 'https://logo.clearbit.com/zomato.com', type: 'internship', role: 'Backend Engineer Intern', package: '₹70,000/month', location: 'Gurugram', deadline: '2025-04-08', cgpa: 7.0, dept: ['CSE', 'IT'], skills: ['Go', 'gRPC', 'Redis'], desc: 'Zomato Engineering internship — work on real-time order management, ML recommendations, and payments.', status: 'open', seats: 6, category: 'tech' },
  { id: 28, name: 'Razorpay', logo: 'https://logo.clearbit.com/razorpay.com', type: 'placement', role: 'Software Engineer', package: '₹20 LPA', location: 'Bangalore', deadline: '2025-05-22', cgpa: 7.0, dept: ['CSE', 'IT'], skills: ['Node.js', 'Payments', 'Security'], desc: 'Razorpay builds payment infrastructure for 8 million+ businesses. High-impact fintech engineering role.', status: 'open', seats: 12, category: 'fintech' },
  { id: 29, name: 'ISRO', logo: 'https://logo.clearbit.com/isro.gov.in', type: 'internship', role: 'Research Intern', package: '₹25,000/month', location: 'Bangalore / Sriharikota', deadline: '2025-04-12', cgpa: 8.0, dept: ['ECE', 'EEE', 'MECH', 'CSE'], skills: ['Embedded Systems', 'Control Systems', 'C'], desc: 'ISRO internship on satellite communication systems, launch vehicle software, or guidance navigation.', status: 'open', seats: 8, category: 'research' },
  { id: 30, name: 'DRDO', logo: 'https://logo.clearbit.com/drdo.gov.in', type: 'internship', role: 'Research Intern', package: '₹20,000/month', location: 'Hyderabad', deadline: '2025-04-20', cgpa: 7.5, dept: ['ECE', 'EEE', 'MECH', 'CSE'], skills: ['Signal Processing', 'FPGA', 'Defense Tech'], desc: 'DRDO internship on defense electronics, radar systems, missile guidance and electronic warfare.', status: 'open', seats: 10, category: 'research' },
];

const CATEGORIES = ['All', 'tech', 'service', 'consulting', 'hardware', 'engineering', 'fintech', 'research'];
const CAT_COLORS = { tech: '#00e5ff', service: '#10b981', consulting: '#f59e0b', hardware: '#a78bfa', engineering: '#f43f5e', fintech: '#6366f1', research: '#06b6d4' };

const STATS = [
  { label: 'Companies Visiting', value: '30+', icon: Building2, color: 'cyan' },
  { label: 'Placements', value: '15', icon: Briefcase, color: 'violet' },
  { label: 'Internships', value: '15', icon: GraduationCap, color: 'emerald' },
  { label: 'Highest Package', value: '₹80 LPA', icon: TrendingUp, color: 'amber' },
];

export default function PlacementsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [applied, setApplied] = useState(new Set());
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleApply = (company) => {
    if (applied.has(company.id)) { toast.error('Already applied!'); return; }
    setApplied(prev => new Set([...prev, company.id]));
    toast.success(`Applied to ${company.name} — ${company.role}! 🎉`);
  };

  const filtered = COMPANIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const matchCat = categoryFilter === 'All' || c.category === categoryFilter;
    return matchSearch && matchType && matchCat;
  });

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="page-header">
        <h1>Placements & Internships</h1>
        <p>Explore opportunities from top companies visiting campus</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {STATS.map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '6px' }}>{s.label}</p>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '800' }}>{s.value}</div>
              </div>
              <div style={{ opacity: 0.25 }}><s.icon size={28} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-box" style={{ flex: 1, minWidth: '220px' }}>
          <Search className="search-icon" size={15} />
          <input className="form-input" placeholder="Search companies, roles..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px', width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'placement', 'internship'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}>
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            style={{ padding: '5px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s', border: `1px solid ${categoryFilter === cat ? (CAT_COLORS[cat] || 'var(--neon-cyan)') : 'var(--border-subtle)'}`, background: categoryFilter === cat ? `${(CAT_COLORS[cat] || 'var(--neon-cyan)')}18` : 'transparent', color: categoryFilter === cat ? (CAT_COLORS[cat] || 'var(--neon-cyan)') : 'var(--text-muted)', textTransform: 'capitalize' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>{filtered.length} opportunities found</p>

      {/* Company Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map(company => {
          const isApplied = applied.has(company.id);
          const catColor = CAT_COLORS[company.category] || 'var(--neon-cyan)';
          return (
            <div key={company.id} style={{ background: 'var(--bg-card)', border: `1px solid var(--border-subtle)`, borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'all 0.25s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = catColor + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${catColor}20`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

              {/* Glow accent */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle, ${catColor}12 0%, transparent 70%)`, pointerEvents: 'none' }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                {/* Logo */}
                <div style={{ width: '54px', height: '54px', borderRadius: '12px', background: 'white', padding: '6px', flexShrink: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={company.logo}
                    alt={company.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,${catColor}20,${catColor}10);border-radius:8px;font-family:Syne,sans-serif;font-weight:800;font-size:18px;color:${catColor}">${company.name.charAt(0)}</div>`;
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', lineHeight: 1.2 }}>{company.name}</h4>
                    <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700', background: company.type === 'internship' ? 'rgba(16,185,129,0.12)' : 'rgba(0,229,255,0.1)', color: company.type === 'internship' ? 'var(--neon-emerald)' : 'var(--neon-cyan)', border: `1px solid ${company.type === 'internship' ? 'rgba(16,185,129,0.25)' : 'rgba(0,229,255,0.2)'}`, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {company.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '3px' }}>{company.role}</p>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: `${catColor}12`, color: catColor, border: `1px solid ${catColor}25`, textTransform: 'capitalize', fontWeight: '600', marginTop: '4px', display: 'inline-block' }}>{company.category}</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{company.desc}</p>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { icon: IndianRupee, label: company.package },
                  { icon: MapPin, label: company.location },
                  { icon: Star, label: `CGPA ≥ ${company.cgpa}` },
                  { icon: Clock, label: `Deadline: ${new Date(company.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}` },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <item.icon size={11} color={catColor} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {company.skills.map(skill => (
                  <span key={skill} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>{skill}</span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <Users size={11} />
                  {company.seats} seats
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCompany(company)}>
                    <ExternalLink size={12} /> Details
                  </button>
                  <button
                    onClick={() => handleApply(company)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: isApplied ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '700', background: isApplied ? 'rgba(16,185,129,0.15)' : `linear-gradient(135deg, ${catColor}, ${catColor}bb)`, color: isApplied ? 'var(--neon-emerald)' : '#020408', transition: 'all 0.2s ease', opacity: isApplied ? 0.8 : 1 }}>
                    {isApplied ? '✓ Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Briefcase size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>No opportunities found matching your filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCompany && (
        <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
          <div className="modal" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: 'white', padding: '8px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                <img src={selectedCompany.logo} alt={selectedCompany.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:Syne;font-weight:800;font-size:22px;color:var(--neon-cyan)">${selectedCompany.name.charAt(0)}</div>`; }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '4px' }}>{selectedCompany.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{selectedCompany.role}</p>
              </div>
              <button onClick={() => setSelectedCompany(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.7', marginBottom: '20px' }}>{selectedCompany.desc}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                ['Package', selectedCompany.package],
                ['Location', selectedCompany.location],
                ['Type', selectedCompany.type.charAt(0).toUpperCase() + selectedCompany.type.slice(1)],
                ['Min CGPA', selectedCompany.cgpa],
                ['Seats', selectedCompany.seats],
                ['Deadline', new Date(selectedCompany.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{v}</p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Eligible Departments</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {selectedCompany.dept.map(d => <span key={d} className="badge badge-cyan" style={{ fontSize: '11px' }}>{d}</span>)}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Required Skills</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {selectedCompany.skills.map(s => <span key={s} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>{s}</span>)}
              </div>
            </div>

            <button
              onClick={() => { handleApply(selectedCompany); setSelectedCompany(null); }}
              disabled={applied.has(selectedCompany.id)}
              className={`btn btn-lg ${applied.has(selectedCompany.id) ? 'btn-ghost' : 'btn-primary'}`}
              style={{ width: '100%', justifyContent: 'center' }}>
              {applied.has(selectedCompany.id) ? '✓ Already Applied' : `Apply to ${selectedCompany.name} →`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
