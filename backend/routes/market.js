import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const WFM_BASE = 'https://api.warframe.market/v1';

// Convierte "Plano de Wisp Prime" → "wisp_prime_blueprint"
function toWFMSlug(nombre) {
  return nombre
    .toLowerCase()
    .replace(/plano de las /g, '')
    .replace(/plano del /g, '')
    .replace(/plano de /g, '')
    .replace(/blueprint \(prime\)/g, 'prime_blueprint')
    .replace(/neuroptics blueprint \(prime\)/g, 'neuroptics_prime_blueprint')
    .replace(/chassis blueprint \(prime\)/g, 'chassis_prime_blueprint')
    .replace(/systems blueprint \(prime\)/g, 'systems_prime_blueprint')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

router.get('/:item', async (req, res) => {
  const slug = req.params.item;

  try {
    const response = await fetch(`${WFM_BASE}/items/${slug}/orders`, {
      headers: {
        'Platform': 'pc',
        'Language': 'en',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(404).json({ error: `Item "${slug}" no encontrado en warframe.market` });
    }

    const data = await response.json();

    // Filtra solo vendedores online con órdenes de venta
    const ordenes = data.payload.orders
      .filter(o =>
        o.order_type === 'sell' &&
        o.user.status === 'ingame'
      )
      .sort((a, b) => a.platinum - b.platinum);

    if (ordenes.length === 0) {
      return res.json({ precio: null, vendedor: null });
    }

    const mejor = ordenes[0];
    res.json({
      precio: mejor.platinum,
      vendedor: mejor.user.ingame_name
    });

  } catch (err) {
    console.error('Error consultando warframe.market:', err);
    res.status(500).json({ error: 'Error interno al consultar warframe.market' });
  }
});

export default router;