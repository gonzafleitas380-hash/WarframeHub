import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WarframeNav from './WarframeNav';
import WarframeStatsBar from './WarframeStatsBar';
import WarframeHero from './WarframeHero';
import WarframeSidebar from './WarframeSidebar';
import WarframeDescription from './WarframeDescription';
import WarframeAbilities from './WarframeAbilities';
import WarframeCrafting from './WarframeCrafting';
import WarframeAcquisition from './WarframeAcquisition';
import WarframeCuriosities from './WarframeCuriosities';
import WarframeBuilds from './WarframeBuilds';
import '../../styles/Wisp.css';

function WarframePage() {
  const { nombre } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [precios, setPrecios] = useState(null);

  // Fetch del JSON del warframe
  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);
    setPrecios(null);

    fetch(`/api/warframes/${nombre}`)
      .then(res => {
        if (!res.ok) throw new Error('Warframe no encontrado');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [nombre]);

  // Fetch de precios de warframe.market (solo si tiene prime y tiene slugs)
  useEffect(() => {
    if (!data?.tienePrime) return;
    if (!data?.prime?.wfmSlugs?.length) return;

    Promise.all(
      data.prime.wfmSlugs.map(slug =>
        fetch(`/api/market/${slug}`)
          .then(res => res.json())
          .catch(() => ({ precio: null, vendedor: null }))
      )
    ).then(resultados => {
      setPrecios(resultados);
    });
  }, [data]);

  if (loading) return <div className="wf-pg__state--loading">Cargando...</div>;
  if (error)   return <div className="wf-pg__state--error">{error}</div>;
  if (!data)   return null;

  return (
    <>
      <WarframeNav nombre={data.nombre} />
      <WarframeStatsBar />
      <WarframeHero data={data} />
      <div className="wf-pg__layout--wrapper">
        <WarframeSidebar data={data} />
        <main className="wf-pg__main--content">
          <div className="wf-pg__block--title">
            <div className="wf-pg__text--title"><em>{data.nombre}</em></div>
            <div className="wf-pg__text--subtitle">{data.subtitulo}</div>
          </div>
          <WarframeDescription data={data} />
          <WarframeAbilities data={data} />
          <WarframeCrafting data={data} />
          <WarframeAcquisition data={data} preciosWFM={precios} />
          <WarframeCuriosities data={data} />
          <WarframeBuilds data={data} />
        </main>
      </div>
      <footer className="wf-pg__footer--main">
        WARFRAME HUB · Fan-made Wiki · No afiliado con Digital Extremes ·{' '}
        <a href="https://www.warframe.com/es" target="_blank">Warframe.com</a> ·{' '}
        <a href="https://wiki.warframe.com/" target="_blank">Wiki.warframe.com</a> ·{' '}
        <a href="https://warframe.fandom.com/es/wiki/Wiki_Warframe_Espa%C3%B1ol" target="_blank">Warframe.fandom.com</a> ·{' '}
        <a href="https://overframe.gg/" target="_blank">Overframe.gg</a>
      </footer>
    </>
  );
}

export default WarframePage;