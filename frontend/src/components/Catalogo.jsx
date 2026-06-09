import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Catalogo.css';

const PROGENITOR_MAP = {
  'Baruuk': 'Impacto', 'Dante': 'Impacto', 'Gauss': 'Impacto',
  'Grendel': 'Impacto', 'Rhino': 'Impacto', 'Sevagoth': 'Impacto',
  'Wukong': 'Impacto', 'Zephyr': 'Impacto',
  'Chroma': 'Calor', 'Ember': 'Calor', 'Inaros': 'Calor',
  'Jade': 'Calor', 'Kullervo': 'Calor', 'Nezha': 'Calor',
  'Protea': 'Calor', 'Temple': 'Calor', 'Uriel': 'Calor',
  'Vauban': 'Calor', 'Wisp': 'Calor',
  'Frost': 'Frío', 'Gara': 'Frío', 'Hildryn': 'Frío',
  'Koumei': 'Frío', 'Revenant': 'Frío', 'Styanax': 'Frío',
  'Titania': 'Frío', 'Trinity': 'Frío',
  'Banshee': 'Electricidad', 'Caliban': 'Electricidad', 'Excalibur': 'Electricidad',
  'Follie': 'Electricidad', 'Gyre': 'Electricidad', 'Limbo': 'Electricidad',
  'Nova': 'Electricidad', 'Valkyr': 'Electricidad', 'Volt': 'Electricidad',
  'Atlas': 'Toxina', 'Dagath': 'Toxina', 'Ivara': 'Toxina',
  'Khora': 'Toxina', 'Nekros': 'Toxina', 'Nidus': 'Toxina',
  'Nokko': 'Toxina', 'Oberon': 'Toxina', 'Oraxia': 'Toxina', 'Saryn': 'Toxina',
  'Citrine': 'Magnético', 'Cyte-09': 'Magnético', 'Harrow': 'Magnético',
  'Hydroid': 'Magnético', 'Lavos': 'Magnético', 'Mag': 'Magnético',
  'Mesa': 'Magnético', 'Xaku': 'Magnético', 'Yareli': 'Magnético',
  'Ash': 'Radiación', 'Equinox': 'Radiación', 'Garuda': 'Radiación',
  'Loki': 'Radiación', 'Mirage': 'Radiación', 'Nyx': 'Radiación',
  'Octavia': 'Radiación', 'Qorvex': 'Radiación', 'Voruna': 'Radiación',
};

const PROGENITORES = [
  { id: 'Impacto',      label: 'Impacto',      dot: '#c88050', icon: 'fa-burst'         },
  { id: 'Calor',        label: 'Calor',        dot: '#e87040', icon: 'fa-fire-flame-curved' },
  { id: 'Frío',         label: 'Frío',         dot: '#50b4dc', icon: 'fa-snowflake'      },
  { id: 'Electricidad', label: 'Electricidad', dot: '#c8c850', icon: 'fa-bolt'           },
  { id: 'Toxina',       label: 'Toxina',       dot: '#80d040', icon: 'fa-flask'          },
  { id: 'Magnético',    label: 'Magnético',    dot: '#b450dc', icon: 'fa-magnet'         },
  { id: 'Radiación',    label: 'Radiación',    dot: '#c8a028', icon: 'fa-radiation'      },
];

const ROLES = [
  { id: 'Soporte', label: 'Soporte', dot: '#4ab3d6', icon: 'fa-heart-pulse'    },
  { id: 'DPS',     label: 'DPS',     dot: '#e87040', icon: 'fa-crosshairs'     },
  { id: 'Tank',    label: 'Tank',    dot: '#c88050', icon: 'fa-shield-halved'  },
  { id: 'Control', label: 'Control', dot: '#b450dc', icon: 'fa-hand'           },
  { id: 'Sigilo',  label: 'Sigilo',  dot: '#80d040', icon: 'fa-eye-slash'      },
];

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const FILTERS = [
  { id: 'all',    label: 'Todos',        icon: 'fa-border-all'       },
  { id: 'letra',  label: 'A–Z',          icon: 'fa-arrow-down-a-z'   },
  { id: 'prog',   label: 'Progenitor',   icon: 'fa-atom'             },
  { id: 'rol',    label: 'Rol',          icon: 'fa-user-shield'       },
  { id: 'prime',  label: 'Prime',        icon: 'fa-star'              },
];

function Card({ wf }) {
  const navigate = useNavigate();
  return (
    <div
      className="card-wf"
      onClick={() => navigate(`/warframe/${wf.nombre.toLowerCase()}`)}
    >
      <div className="card__img-wrap">
        <img
          className="card__img"
          src={wf.imagen}
          alt={wf.nombre}
          onError={e => e.target.style.display = 'none'}
        />
      </div>
      <div className="card__overlay"></div>
      {wf.tienePrime && <div className="card__prime-badge">PRIME</div>}
      <div className="card__label">
        <span>{wf.nombre.toUpperCase()}</span>
      </div>
    </div>
  );
}

export default function Catalogo() {
  const navigate = useNavigate();
  const [warframes, setWarframes]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [busqueda, setBusqueda]       = useState('');
  const [activeTab, setActiveTab]     = useState('all');
  const [filtroLetra, setFiltroLetra]           = useState('');
  const [filtroProgenitor, setFiltroProgenitor] = useState('');
  const [filtroRol, setFiltroRol]               = useState('');
  const [filtroPrime, setFiltroPrime]           = useState('');

  useEffect(() => {
    fetch('/api/warframes')
      .then(r => r.json())
      .then(data => {
        setWarframes(data.map(wf => ({
          ...wf,
          progenitor: wf.progenitor || PROGENITOR_MAP[wf.nombre] || 'Desconocido'
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (val, setter, current) =>
    setter(current === val ? '' : val);

  const resetSub = () => {
    setFiltroLetra('');
    setFiltroProgenitor('');
    setFiltroRol('');
    setFiltroPrime('');
  };

  const handleTab = (id) => {
    setActiveTab(id);
    resetSub();
  };

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return warframes.filter(wf => {
      const matchQ    = !q || wf.nombre.toLowerCase().includes(q);
      const matchLetra = !filtroLetra || wf.nombre[0].toUpperCase() === filtroLetra;
      const matchProg  = !filtroProgenitor || wf.progenitor === filtroProgenitor;
      const matchRol   = !filtroRol || wf.rol?.toLowerCase() === filtroRol.toLowerCase();
      const matchPrime = filtroPrime === '' ? true
        : filtroPrime === 'si' ? wf.tienePrime : !wf.tienePrime;
      return matchQ && matchLetra && matchProg && matchRol && matchPrime;
    });
  }, [warframes, busqueda, filtroLetra, filtroProgenitor, filtroRol, filtroPrime]);

  // Agrupa según el tab activo
  const agrupados = useMemo(() => {
    if (activeTab === 'all' || activeTab === 'letra') {
      return filtrados.reduce((acc, wf) => {
        const k = wf.nombre[0].toUpperCase();
        if (!acc[k]) acc[k] = { label: k, dot: '#c8a96e', items: [] };
        acc[k].items.push(wf);
        return acc;
      }, {});
    }
    if (activeTab === 'prog') {
      const acc = {};
      PROGENITORES.forEach(p => { acc[p.id] = { label: p.label, dot: p.dot, items: [] }; });
      filtrados.forEach(wf => {
        if (acc[wf.progenitor]) acc[wf.progenitor].items.push(wf);
      });
      return acc;
    }
    if (activeTab === 'rol') {
      const acc = {};
      ROLES.forEach(r => { acc[r.id] = { label: r.label, dot: r.dot, items: [] }; });
      filtrados.forEach(wf => {
        const k = wf.rol
          ? wf.rol.charAt(0).toUpperCase() + wf.rol.slice(1).toLowerCase()
          : 'Desconocido';
        if (acc[k]) acc[k].items.push(wf);
      });
      return acc;
    }
    if (activeTab === 'prime') {
      return {
        'si': { label: 'Con Prime',  dot: '#e8c060', items: filtrados.filter(w => w.tienePrime) },
        'no': { label: 'Sin Prime',  dot: '#4a6880', items: filtrados.filter(w => !w.tienePrime) },
      };
    }
    return {};
  }, [filtrados, activeTab]);

  const hayFiltroSub = filtroLetra || filtroProgenitor || filtroRol || filtroPrime;

  return (
    <>
      {/* NAV */}
      <nav className="cat-nav">
        <img
          src="/Home/WarframeLogo.png"
          alt="Logo"
          className="cat-nav__logo"
          onClick={() => navigate('/')}
        />
        <div className="profile-wrapper">
          <div className="profile-avatar">
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="profile-dropdown">
            <a href="#">My Profile</a>
          </div>
        </div>
      </nav>

      {/* BARRA STICKY */}
      <div className="cat-bar--root">

        {/* Búsqueda */}
        <div className="cat-bar__search--wrap">
          <i className="fa-solid fa-magnifying-glass cat-bar__search--icon"></i>
          <input
            className="cat-bar__search--input"
            type="text"
            placeholder="Buscar warframe..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            autoComplete="off"
          />
          {busqueda && (
            <button className="cat-bar__search--clear" onClick={() => setBusqueda('')}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Tabs de filtro */}
        <div className="cat-bar__tabs--wrap">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`cat-bar__tab ${activeTab === f.id ? 'active' : ''}`}
              onClick={() => handleTab(f.id)}
            >
              <i className={`fa-solid ${f.icon}`}></i>
              {f.label}
            </button>
          ))}
        </div>

        {/* Sub-filtros según tab */}
        {activeTab === 'letra' && (
          <div className="cat-bar__sub--wrap">
            {LETRAS.map(l => (
              <button
                key={l}
                className={`cat-chip cat-chip--letra ${filtroLetra === l ? 'active' : ''}`}
                onClick={() => toggle(l, setFiltroLetra, filtroLetra)}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'prog' && (
          <div className="cat-bar__sub--wrap">
            {PROGENITORES.map(p => (
              <button
                key={p.id}
                className={`cat-chip cat-chip--prog ${filtroProgenitor === p.id ? 'active' : ''}`}
                style={filtroProgenitor === p.id
                  ? { borderColor: p.dot, color: p.dot, background: `${p.dot}18` }
                  : {}}
                onClick={() => toggle(p.id, setFiltroProgenitor, filtroProgenitor)}
              >
                <i className={`fa-solid ${p.icon}`}></i>
                {p.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'rol' && (
          <div className="cat-bar__sub--wrap">
            {ROLES.map(r => (
              <button
                key={r.id}
                className={`cat-chip cat-chip--rol ${filtroRol === r.id ? 'active' : ''}`}
                style={filtroRol === r.id
                  ? { borderColor: r.dot, color: r.dot, background: `${r.dot}18` }
                  : {}}
                onClick={() => toggle(r.id, setFiltroRol, filtroRol)}
              >
                <i className={`fa-solid ${r.icon}`}></i>
                {r.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'prime' && (
          <div className="cat-bar__sub--wrap">
            {[
              { val: 'si', label: 'Con Prime', dot: '#e8c060', icon: 'fa-star' },
              { val: 'no', label: 'Sin Prime', dot: '#4a6880', icon: 'fa-star-half-stroke' },
            ].map(opt => (
              <button
                key={opt.val}
                className={`cat-chip ${filtroPrime === opt.val ? 'active' : ''}`}
                style={filtroPrime === opt.val
                  ? { borderColor: opt.dot, color: opt.dot, background: `${opt.dot}18` }
                  : {}}
                onClick={() => toggle(opt.val, setFiltroPrime, filtroPrime)}
              >
                <i className={`fa-solid ${opt.icon}`}></i>
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Contador + limpiar */}
        <div className="cat-bar__meta--wrap">
          <span className="cat-bar__count">
            <span>{filtrados.length}</span>
            {' '}warframe{filtrados.length !== 1 ? 's' : ''}
            {(busqueda || hayFiltroSub) ? ' encontrados' : ' registrados'}
          </span>
          {(busqueda || hayFiltroSub) && (
            <button className="cat-bar__reset" onClick={() => { setBusqueda(''); resetSub(); }}>
              <i className="fa-solid fa-rotate-left"></i> Limpiar
            </button>
          )}
        </div>

      </div>

      {/* CONTENIDO */}
      <main className="cat-main">
        {loading && <div className="cat-state">Cargando warframes...</div>}
        {!loading && filtrados.length === 0 && (
          <div className="cat-state">
            <i className="fa-solid fa-circle-xmark"></i>
            <p>No se encontraron warframes</p>
          </div>
        )}
        {!loading && Object.entries(agrupados)
          .filter(([, g]) => g.items.length > 0)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, grupo]) => (
            <section key={key} className="cat-section">
              <div className="cat-section__header">
                <div
                  className="cat-section__dot"
                  style={{ background: grupo.dot }}
                ></div>
                <h2 className="cat-section__title">{grupo.label}</h2>
                <span className="cat-section__count">
                  {grupo.items.length} warframe{grupo.items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="cat-grupo__cards--wrap">
                {grupo.items.map(wf => <Card key={wf.nombre} wf={wf} />)}
              </div>
            </section>
          ))
        }
      </main>
    </>
  );
}