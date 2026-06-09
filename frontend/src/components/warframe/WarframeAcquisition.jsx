import { useState } from 'react';

function RelicCard({ relic }) {
  return (
    <div className={`wf-acq__relic--card ${relic.vaulted ? 'wf-acq__relic--vaulted' : ''}`}>
      <div className="wf-acq__relic--img-wrap">
        <img src={relic.imagen} alt={relic.nombre} />
      </div>
      <a className="wf-acq__relic--name" href="#">{relic.nombre}</a>
      {relic.vaulted && <span className="wf-acq__relic--vault-tag">Vaulted</span>}
      <div className="wf-acq__relic--rarity">{relic.rareza}</div>
      <div className="wf-acq__relic--chances">
        <span>Intact: <b>{relic.chances.intact}</b></span>
        <span>Exceptional: <b>{relic.chances.exceptional}</b></span>
      </div>
      <div className="wf-acq__relic--chances">
        <span>Flawless: <b>{relic.chances.flawless}</b></span>
        <span>Radiant: <b>{relic.chances.radiant}</b></span>
      </div>
    </div>
  );
}

function PrimeRow({ parte, precioData }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="wf-acq__prime--row">
        <td>
          <img src={parte.imagen} alt={parte.nombre} />
          {parte.nombre}
        </td>
        <td>
          <span className="wf-acq__prime--price">
            <span className="wf-acq__plat--icon-sm"></span>
            {precioData ? `${precioData.precio} pl` : '— pl'}
          </span>
        </td>
        <td>
          <span className="wf-acq__prime--seller">
            {precioData ? precioData.vendedor : '—'}
          </span>
        </td>
        <td>
          <button
            className={`wf-acq__relic--btn ${open ? 'active' : ''}`}
            onClick={() => setOpen(!open)}
          >
            Ver
          </button>
        </td>
      </tr>
      {open && (
        <tr className="wf-acq__relic--expand">
          <td colSpan={4}>
            <div className="wf-acq__relic--panel">
              <div className="wf-acq__relic--panel-label">
                Reliquias que contienen {parte.nombre}
              </div>
              <div className="wf-acq__relic--cards">
                {parte.reliquias.map((r, i) => (
                  <RelicCard key={i} relic={r} />
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function WarframeAcquisition({ data, preciosWFM }) {
  const { adquisicion, prime, tienePrime, nombre } = data;

  return (
    <section className="wf-sec--root" id="acquisition">
      <div className="wf-sec__header--wrap">
        <span className="wf-sec__num--label">04</span>
        <h2 className="wf-sec__title--text">Adquisición</h2>
        <div className="wf-sec__title--line"></div>
      </div>
      <div className="wf-sec__body--wrap">
        <div className="wf-cft__variant--title wf-cft__variant--std">
          {nombre} — Partes estándares <span className="wf-cft__vtag wf-cft__vtag--std">Non-Prime</span>
        </div>
        <div className="wf-acq__part--card">
          <table className="wf-cft__part--table">
            <thead>
              <tr>
                <th>Objeto</th>
                <th>Fuente</th>
                <th>Prob %</th>
                <th>Esperado</th>
              </tr>
            </thead>
            <tbody>
              {adquisicion.nonPrime.map((item, i) => (
                <tr key={i}>
                  <td><img src={item.imagen} alt={item.nombre} /> {item.nombre}</td>
                  <td className="wf-acq__qty--std">{item.fuente}</td>
                  <td>{item.probabilidad}</td>
                  <td>{item.esperado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tienePrime && (
          <>
            <div className="wf-cft__variant--title wf-cft__variant--prm">
              {nombre} Prime — Partes Prime <span className="wf-cft__vtag wf-cft__vtag--prm">Prime</span>
            </div>
            <div className="wf-acq__part--card">
              <table className="wf-cft__part--table wf-acq__prime--table">
                <thead>
                  <tr>
                    <th>Objeto</th>
                    <th>Precio</th>
                    <th>Vendedor</th>
                    <th>Fuente</th>
                  </tr>
                </thead>
                <tbody>
                  {prime.crafting.adquisicion.map((parte, i) => (
                    <PrimeRow
                      key={i}
                      parte={parte}
                      precioData={preciosWFM ? preciosWFM[i] : null}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default WarframeAcquisition;