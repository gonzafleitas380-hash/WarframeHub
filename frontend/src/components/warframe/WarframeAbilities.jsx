import { useRef } from 'react';

function AbilityCard({ habilidad }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => videoRef.current?.play();
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };
  const handleTouch = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play();
    else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };

  return (
    <div
      className="wf-abl__card--wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
    >
      <div className="wf-abl__card--key">{habilidad.key} — HABILIDAD</div>
      <img src={habilidad.imagen} alt={habilidad.nombre} />
      <div className="wf-abl__card--name">{habilidad.nombre}</div>

      {habilidad.video && (
        <div className="wf-abl__popup--wrap">
          <div className="wf-abl__popup--video">
            <video ref={videoRef} src={habilidad.video} muted loop preload="none" />
          </div>
          <div className="wf-abl__popup--body">
            <div className="wf-abl__popup--title">{habilidad.nombre}</div>
            <div className="wf-abl__popup--rank">RANGO MAX</div>
            <div className="wf-abl__popup--stats">
              {habilidad.stats.map((stat, i) => (
                stat.clase === 'subtitulo'
                  ? <div key={i} className="wf-abl__stat--row">
                      <span className="wf-abl__stat--label">
                        <strong style={{ color: 'var(--accent2)' }}>{stat.label}</strong>
                      </span>
                    </div>
                  : <div key={i} className="wf-abl__stat--row">
                      <span className="wf-abl__stat--label">{stat.label}</span>
                      <span className={`wf-abl__stat--value ${stat.clase}`}>
                        {stat.icono && <i className={`fa-solid fa-${stat.icono}`}></i>}
                        {stat.iconos && stat.iconos.map(ic => (
                          <i key={ic} className={`fa-solid fa-${ic}`}></i>
                        ))}
                        {stat.valor}
                      </span>
                    </div>
              ))}
            </div>
          </div>
          {habilidad.tieneAugment && (
            <div className="wf-abl__popup--footer">
              <span>TIENE AUGMENTS</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WarframeAbilities({ data }) {
  const activas = data.habilidades.filter(h => h.key !== 'pasiva');
  const pasiva  = data.habilidades.find(h => h.key === 'pasiva');
  const todas   = pasiva ? [pasiva, ...activas] : activas;

  return (
    <section className="wf-sec--root" id="abilities">
      <div className="wf-sec__header--wrap">
        <span className="wf-sec__num--label">02</span>
        <h2 className="wf-sec__title--text">Habilidades</h2>
        <div className="wf-sec__title--line"></div>
      </div>
      <div className="wf-abl__grid--wrap">
        {activas.map(h => <AbilityCard key={h.key} habilidad={h} />)}
      </div>
      {todas.map(h => (
        <div key={h.key} className="wf-abl__detail--wrap">
          <div className="wf-abl__detail--icon">
            <img src={h.imagen} alt={h.nombre} />
          </div>
          <div>
            <div className="wf-abl__detail--key">
              {h.key === 'pasiva' ? 'PASIVA' : `${h.key} — HABILIDAD`}
            </div>
            <div className="wf-abl__detail--name">{h.nombre.toUpperCase()}</div>
            <div className="wf-abl__detail--desc">
              {h.descripcion}
              {h.augment && (
                <span className="wf-abl__detail--aug">
                  ⬡ AUGMENT — {h.augment}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default WarframeAbilities;