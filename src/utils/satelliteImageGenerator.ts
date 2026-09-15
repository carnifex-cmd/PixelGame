// High-performance procedural generator for realistic multispectral satellite imagery
// Ensures 100% offline reliability for IEEE GRSS Open Day booth operations.

const imageCache: Map<string, string> = new Map();

function createBaseCanvas(width = 600, height = 600): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

// Simple pseudo-random seeded noise helper
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateSatelliteImage(key: string): string {
  if (imageCache.has(key)) {
    return imageCache.get(key)!;
  }

  const [canvas, ctx] = createBaseCanvas(600, 600);

  switch (key) {
    case 'center_pivot_desert': {
      // Sand desert foundation
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(0, 0, 600, 600);

      // Desert sand ridges and dunes
      for (let i = 0; i < 40; i++) {
        ctx.strokeStyle = `rgba(189, 134, 88, ${0.15 + (i % 3) * 0.08})`;
        ctx.lineWidth = 15 + (i % 5) * 5;
        ctx.beginPath();
        ctx.moveTo(-50, i * 20);
        ctx.bezierCurveTo(200, i * 20 + 30, 400, i * 20 - 30, 650, i * 20 + 15);
        ctx.stroke();
      }

      // Circular crop fields (center-pivot) - vibrant infrared green / false color
      const circles = [
        { x: 120, y: 120, r: 65, color: '#10b981', ring: '#047857' },
        { x: 260, y: 110, r: 60, color: '#059669', ring: '#065f46' },
        { x: 390, y: 125, r: 55, color: '#34d399', ring: '#10b981' },
        { x: 510, y: 130, r: 50, color: '#047857', ring: '#064e3b' },
        { x: 130, y: 260, r: 62, color: '#059669', ring: '#047857' },
        { x: 270, y: 255, r: 70, color: '#10b981', ring: '#065f46' },
        { x: 410, y: 260, r: 60, color: '#047857', ring: '#064e3b' },
        { x: 530, y: 250, r: 48, color: '#34d399', ring: '#059669' },
        { x: 110, y: 400, r: 58, color: '#059669', ring: '#047857' },
        { x: 250, y: 410, r: 68, color: '#10b981', ring: '#065f46' },
        { x: 395, y: 405, r: 64, color: '#34d399', ring: '#10b981' },
        { x: 520, y: 390, r: 55, color: '#059669', ring: '#047857' },
        { x: 180, y: 530, r: 52, color: '#34d399', ring: '#059669' },
        { x: 320, y: 535, r: 60, color: '#047857', ring: '#064e3b' },
        { x: 460, y: 525, r: 58, color: '#10b981', ring: '#047857' },
      ];

      for (const c of circles) {
        // Outer fallow ring
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r + 3, 0, Math.PI * 2);
        ctx.fillStyle = '#b08968';
        ctx.fill();

        // Main crop circle
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();

        // Pie slices for different growth stages
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 0.6);
        ctx.closePath();
        ctx.fillStyle = c.ring;
        ctx.fill();

        // Central pivot dot & arm
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + Math.cos(0.6) * c.r, c.y + Math.sin(0.6) * c.r);
        ctx.stroke();
      }

      // Access road network
      ctx.strokeStyle = '#e6ccb2';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(20, 180);
      ctx.lineTo(580, 180);
      ctx.moveTo(20, 330);
      ctx.lineTo(580, 330);
      ctx.moveTo(20, 470);
      ctx.lineTo(580, 470);
      ctx.moveTo(195, 20);
      ctx.lineTo(195, 580);
      ctx.moveTo(335, 20);
      ctx.lineTo(335, 580);
      ctx.moveTo(465, 20);
      ctx.lineTo(465, 580);
      ctx.stroke();
      break;
    }

    case 'amazon_fishbone': {
      // Dense deep rainforest canopy
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, 600, 600);

      // Forest texture variations
      for (let i = 0; i < 250; i++) {
        const x = (i * 37) % 600;
        const y = (i * 59) % 600;
        ctx.fillStyle = i % 2 === 0 ? '#047857' : '#022c22';
        ctx.beginPath();
        ctx.arc(x, y, 15 + (i % 10), 0, Math.PI * 2);
        ctx.fill();
      }

      // Main arterial highway
      ctx.strokeStyle = '#d4a373';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(20, 50);
      ctx.bezierCurveTo(200, 150, 400, 450, 580, 550);
      ctx.stroke();

      // Branching perpendicular clearings (fishbone)
      for (let i = 1; i <= 14; i++) {
        const t = i / 15;
        // Point along curve
        const px = 20 * (1 - t) * (1 - t) + 2 * 200 * (1 - t) * t + 580 * t * t;
        const py = 50 * (1 - t) * (1 - t) + 2 * 300 * (1 - t) * t + 550 * t * t;

        // Left rib
        const lenLeft = 80 + (i % 4) * 35;
        ctx.strokeStyle = '#ddb892';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - lenLeft * 0.7, py + lenLeft * 0.6);
        ctx.stroke();

        // Clear-cut agricultural block along rib
        ctx.fillStyle = i % 2 === 0 ? '#faedcd' : '#ccd5ae';
        ctx.fillRect(px - lenLeft * 0.65, py + lenLeft * 0.2, 40, 20);

        // Right rib
        const lenRight = 90 + (i % 3) * 30;
        ctx.strokeStyle = '#ddb892';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + lenRight * 0.7, py - lenRight * 0.6);
        ctx.stroke();

        ctx.fillStyle = i % 3 === 0 ? '#e9edc9' : '#d4a373';
        ctx.fillRect(px + lenRight * 0.2, py - lenRight * 0.5, 45, 25);
      }
      break;
    }

    case 'open_pit_mine': {
      // Rugged mountain bedrock
      ctx.fillStyle = '#78716c';
      ctx.fillRect(0, 0, 600, 600);

      // Surrounding mountains
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#57534e' : '#a8a29e';
        ctx.beginPath();
        ctx.arc((i * 47) % 600, (i * 83) % 600, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stepped excavation rings
      const centerX = 300;
      const centerY = 300;
      const rings = 14;

      for (let r = rings; r >= 1; r--) {
        const radius = r * 18;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * 1.25, radius, Math.PI / 10, 0, Math.PI * 2);
        ctx.fillStyle = r % 2 === 0 ? '#b45309' : '#d97706';
        if (r <= 3) {
          ctx.fillStyle = '#0284c7'; // Turquoise tailings pond at the pit floor
        }
        ctx.fill();
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Spiral haul roads cutting across benches
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 8; a += 0.1) {
        const rad = 25 + a * 9;
        const x = centerX + Math.cos(a) * rad * 1.2;
        const y = centerY + Math.sin(a) * rad;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    }

    case 'sand_dunes_erg': {
      // Golden desert base
      const grad = ctx.createLinearGradient(0, 0, 600, 600);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(1, '#b45309');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 600);

      // Sinuous linear dune crests with shadow slopes
      for (let i = 0; i < 18; i++) {
        const yOffset = i * 36;
        ctx.beginPath();
        ctx.moveTo(0, yOffset);
        ctx.bezierCurveTo(150, yOffset - 30, 300, yOffset + 35, 450, yOffset - 25);
        ctx.bezierCurveTo(500, yOffset - 40, 550, yOffset + 20, 600, yOffset);
        ctx.lineTo(600, yOffset + 25);
        ctx.bezierCurveTo(450, yOffset, 300, yOffset + 55, 150, yOffset - 10);
        ctx.lineTo(0, yOffset + 25);
        ctx.closePath();

        // Shaded slip face
        ctx.fillStyle = '#78350f';
        ctx.fill();

        // Illuminated crest line
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, yOffset);
        ctx.bezierCurveTo(150, yOffset - 30, 300, yOffset + 35, 450, yOffset - 25);
        ctx.bezierCurveTo(500, yOffset - 40, 550, yOffset + 20, 600, yOffset);
        ctx.stroke();
      }
      break;
    }

    case 'meandering_oxbow': {
      // Floodplain lush vegetation
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(0, 0, 600, 600);

      // Agricultural patches along alluvial valley
      for (let i = 0; i < 25; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#40916c' : '#74c69d';
        ctx.fillRect((i * 53) % 550, (i * 67) % 550, 60 + (i % 4) * 15, 40 + (i % 3) * 15);
      }

      // Oxbow lakes (crescent cutoffs)
      const oxbows = [
        { x: 130, y: 150, r: 45, start: 0.2, end: 2.5 },
        { x: 440, y: 220, r: 55, start: 1.5, end: 4.2 },
        { x: 200, y: 460, r: 50, start: 3.2, end: 5.8 },
      ];

      for (const ox of oxbows) {
        ctx.beginPath();
        ctx.arc(ox.x, ox.y, ox.r, ox.start, ox.end);
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Main active meandering river channel
      ctx.beginPath();
      ctx.moveTo(-20, 50);
      ctx.bezierCurveTo(200, 30, 240, 180, 140, 260);
      ctx.bezierCurveTo(40, 340, 320, 320, 380, 420);
      ctx.bezierCurveTo(440, 520, 520, 480, 620, 540);
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 26;
      ctx.stroke();

      // Sandbars on inner meander loops
      ctx.beginPath();
      ctx.moveTo(170, 230);
      ctx.bezierCurveTo(150, 250, 140, 270, 170, 290);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 6;
      ctx.stroke();
      break;
    }

    case 'urban_sprawl_grid': {
      // Arid desert background
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, 600, 600);

      // Urban sprawl core
      ctx.fillStyle = '#334155';
      ctx.fillRect(80, 80, 440, 440);

      // Rectilinear city street blocks
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      for (let x = 90; x <= 510; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 80);
        ctx.lineTo(x, 520);
        ctx.stroke();
      }
      for (let y = 90; y <= 510; y += 30) {
        ctx.beginPath();
        ctx.moveTo(80, y);
        ctx.lineTo(520, y);
        ctx.stroke();
      }

      // Highway bypass loop
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(300, 300, 210, 210, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Diagonal arterial thoroughfare
      ctx.beginPath();
      ctx.moveTo(40, 40);
      ctx.lineTo(560, 560);
      ctx.stroke();

      // Small suburban developments spreading into countryside
      ctx.fillStyle = '#64748b';
      for (let i = 0; i < 30; i++) {
        const sx = (i * 71) % 550;
        const sy = (i * 97) % 550;
        if (sx < 80 || sx > 500 || sy < 80 || sy > 500) {
          ctx.fillRect(sx, sy, 35, 25);
        }
      }
      break;
    }

    case 'river_delta_plume': {
      // Ocean coastal water
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 600, 600);

      // Muddy river main trunk
      ctx.fillStyle = '#15803d'; // Coastal marsh wetland
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(300, 0);
      ctx.lineTo(350, 200);
      ctx.lineTo(150, 250);
      ctx.closePath();
      ctx.fill();

      // Branching birdfoot distributary channels
      const lobes = [
        { sx: 280, sy: 150, cx: 380, cy: 300, ex: 450, ey: 450, w: 18 },
        { sx: 260, sy: 180, cx: 240, cy: 350, ex: 200, ey: 520, w: 16 },
        { sx: 290, sy: 200, cx: 330, cy: 380, ex: 350, ey: 560, w: 20 },
        { sx: 310, sy: 170, cx: 480, cy: 260, ex: 560, ey: 330, w: 14 },
      ];

      // Sediment plumes dispersing into the sea
      for (const l of lobes) {
        // Plume cloud
        const radGrad = ctx.createRadialGradient(l.ex, l.ey, 10, l.ex, l.ey, 120);
        radGrad.addColorStop(0, 'rgba(161, 98, 7, 0.85)');
        radGrad.addColorStop(0.5, 'rgba(202, 138, 4, 0.4)');
        radGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(l.ex, l.ey, 120, 0, Math.PI * 2);
        ctx.fill();

        // Marsh levees
        ctx.strokeStyle = '#166534';
        ctx.lineWidth = l.w + 12;
        ctx.beginPath();
        ctx.moveTo(l.sx, l.sy);
        ctx.quadraticCurveTo(l.cx, l.cy, l.ex, l.ey);
        ctx.stroke();

        // Water channel
        ctx.strokeStyle = '#854d0e';
        ctx.lineWidth = l.w;
        ctx.beginPath();
        ctx.moveTo(l.sx, l.sy);
        ctx.quadraticCurveTo(l.cx, l.cy, l.ex, l.ey);
        ctx.stroke();
      }
      break;
    }

    case 'phytoplankton_bloom': {
      // Deep blue ocean
      ctx.fillStyle = '#021c38';
      ctx.fillRect(0, 0, 600, 600);

      // Swirling ocean eddies with cyan/emerald pigments
      for (let eddy = 0; eddy < 6; eddy++) {
        const cx = 100 + (eddy * 89) % 450;
        const cy = 80 + (eddy * 113) % 450;
        const color = eddy % 2 === 0 ? 'rgba(0, 229, 255, 0.45)' : 'rgba(16, 185, 129, 0.45)';

        for (let arm = 0; arm < 3; arm++) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 12 + arm * 4;
          ctx.beginPath();
          for (let theta = 0; theta < Math.PI * 4; theta += 0.1) {
            const r = 10 + theta * 16;
            const angle = theta + arm * (Math.PI * 0.66);
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (theta === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }
      break;
    }

    case 'barrier_islands': {
      // Open Atlantic ocean
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 600, 600);

      // Shallow sound / lagoon water (western half)
      ctx.fillStyle = '#0e7490';
      ctx.beginPath();
      ctx.rect(0, 0, 320, 600);
      ctx.fill();

      // Long narrow sand barrier island chain
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(330, -20);
      ctx.bezierCurveTo(340, 150, 370, 280, 420, 380);
      ctx.bezierCurveTo(440, 430, 410, 520, 390, 620);
      ctx.stroke();

      // Vegetated maritime dunes on island spine
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(328, -20);
      ctx.bezierCurveTo(338, 150, 368, 280, 418, 380);
      ctx.bezierCurveTo(438, 430, 408, 520, 388, 620);
      ctx.stroke();

      // Tidal inlets cutting through the barrier
      const inlets = [180, 410];
      for (const iy of inlets) {
        ctx.fillStyle = '#0e7490';
        ctx.beginPath();
        ctx.arc(360, iy, 25, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'coral_atoll_lagoon': {
      // Abyssal ocean
      ctx.fillStyle = '#0a192f';
      ctx.fillRect(0, 0, 600, 600);

      // Central shallow turquoise lagoon
      const cx = 300;
      const cy = 300;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 210, 170, Math.PI / 8, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();

      // Inner shallow sandbars
      for (let i = 0; i < 15; i++) {
        ctx.fillStyle = 'rgba(103, 232, 249, 0.6)';
        ctx.beginPath();
        ctx.ellipse(
          cx + (i * 29) % 150 - 75,
          cy + (i * 43) % 120 - 60,
          25 + (i % 3) * 10,
          15,
          i,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Outer ring of white/coral reef crest
      ctx.beginPath();
      ctx.ellipse(cx, cy, 215, 175, Math.PI / 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Living coral fringing reef (olive-green/golden-brown)
      ctx.beginPath();
      ctx.ellipse(cx, cy, 226, 186, Math.PI / 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#65a30d';
      ctx.lineWidth = 10;
      ctx.stroke();
      break;
    }

    case 'salt_pan_salar': {
      // Dazzling white crystalline crust
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 600, 600);

      // Hexagonal salt contraction ridges
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      const size = 45;
      for (let y = 0; y < 650; y += size * 1.5) {
        for (let x = 0; x < 650; x += size * Math.sqrt(3)) {
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (Math.PI / 3) * a;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // Lithium evaporation brine ponds (bright turquoise / neon yellow-green)
      const ponds = [
        { x: 120, y: 150, w: 110, h: 80, c: '#06b6d4' },
        { x: 245, y: 150, w: 120, h: 80, c: '#10b981' },
        { x: 380, y: 150, w: 100, h: 80, c: '#eab308' },
        { x: 120, y: 245, w: 110, h: 90, c: '#3b82f6' },
        { x: 245, y: 245, w: 120, h: 90, c: '#14b8a6' },
      ];
      for (const p of ponds) {
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
      }
      break;
    }

    case 'glacier_piedmont': {
      // Rugged mountain bedrock surrounding the pass
      ctx.fillStyle = '#3f3f46';
      ctx.fillRect(0, 0, 600, 600);

      // Rocky cirques
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#52525b' : '#27272a';
        ctx.fillRect((i * 47) % 600, (i * 31) % 250, 80, 50);
      }

      // Constrained ice feeder pouring down from top
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.moveTo(250, 0);
      ctx.lineTo(350, 0);
      ctx.lineTo(380, 180);
      ctx.lineTo(220, 180);
      ctx.closePath();
      ctx.fill();

      // Semicircular fan lobe (piedmont) spreading across the coastal flat
      ctx.beginPath();
      ctx.ellipse(300, 360, 240, 180, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#f0f9ff';
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Medial moraines (concentric dark rock sediment stripes tracing the flow)
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 4;
      for (let s = 1; s <= 9; s++) {
        ctx.beginPath();
        ctx.ellipse(300, 360, s * 23, s * 17, 0, 0.2, Math.PI - 0.2);
        ctx.stroke();
      }
      break;
    }

    case 'sea_ice_leads': {
      // Deep black polar ocean
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 600, 600);

      // Broken pack ice floes (polygonal white chunks)
      const floes = [
        [[50, 50], [180, 40], [220, 150], [120, 210], [40, 160]],
        [[250, 30], [420, 20], [450, 140], [310, 180], [240, 110]],
        [[480, 40], [580, 50], [570, 220], [470, 190]],
        [[30, 240], [170, 230], [210, 360], [90, 420], [20, 350]],
        [[240, 210], [380, 200], [430, 330], [320, 400], [230, 340]],
        [[460, 230], [590, 240], [580, 410], [470, 380]],
        [[70, 450], [200, 430], [230, 560], [60, 580]],
        [[260, 430], [420, 420], [440, 570], [280, 580]],
        [[460, 430], [580, 440], [570, 570], [460, 560]],
      ];

      for (const fl of floes) {
        ctx.beginPath();
        ctx.moveTo(fl[0][0], fl[0][1]);
        for (let i = 1; i < fl.length; i++) {
          ctx.lineTo(fl[i][0], fl[i][1]);
        }
        ctx.closePath();
        ctx.fillStyle = '#f8fafc';
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Melt ponds on surface of ice floes (light cyan)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(fl[0][0] + 40, fl[0][1] + 40, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'permafrost_polygons': {
      // Tundra brown/moss green base
      ctx.fillStyle = '#5f6348';
      ctx.fillRect(0, 0, 600, 600);

      // Polygonal network of ice wedges
      ctx.strokeStyle = '#272d1f';
      ctx.lineWidth = 4;

      const pSize = 55;
      for (let y = 20; y < 620; y += pSize * 1.3) {
        for (let x = 20; x < 620; x += pSize * 1.5) {
          ctx.beginPath();
          const jitterX = (pseudoRandom(x * 11 + y) - 0.5) * 15;
          const jitterY = (pseudoRandom(x + y * 13) - 0.5) * 15;
          ctx.rect(x + jitterX, y + jitterY, pSize, pSize);
          ctx.stroke();

          // Pond inside polygon
          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.arc(x + jitterX + pSize / 2, y + jitterY + pSize / 2, pSize * 0.32, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    case 'ice_shelf_calving': {
      // Ocean (bottom/right)
      ctx.fillStyle = '#032042';
      ctx.fillRect(0, 0, 600, 600);

      // Huge tabular ice shelf (top/left)
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(600, 0);
      ctx.lineTo(600, 360);
      ctx.lineTo(0, 420);
      ctx.closePath();
      ctx.fill();

      // Giant propagating rift fracture
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(180, 0);
      ctx.lineTo(210, 120);
      ctx.lineTo(190, 230);
      ctx.lineTo(260, 320);
      ctx.lineTo(310, 400);
      ctx.stroke();

      // Calving iceberg starting to drift away
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(220, 240);
      ctx.lineTo(480, 210);
      ctx.lineTo(520, 380);
      ctx.lineTo(290, 410);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }

    case 'von_karman_vortex': {
      // Blue ocean
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, 0, 600, 600);

      // Marine stratocumulus white cloud deck
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.fillRect(0, 0, 600, 600);

      // Mountainous island barrier
      ctx.fillStyle = '#3f3f46';
      ctx.beginPath();
      ctx.ellipse(100, 300, 35, 20, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Clear vortex eyes shed downstream
      const vortices = [
        { x: 190, y: 240, r: 35, dir: 1 },
        { x: 280, y: 360, r: 42, dir: -1 },
        { x: 380, y: 220, r: 52, dir: 1 },
        { x: 480, y: 380, r: 60, dir: -1 },
      ];

      for (const v of vortices) {
        // Clear eye hole in cloud deck revealing ocean
        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.r * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Spiral curl
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 3; a += 0.2) {
          const rad = (v.r * a) / (Math.PI * 3);
          const px = v.x + Math.cos(a * v.dir) * rad;
          const py = v.y + Math.sin(a * v.dir) * rad;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      break;
    }

    case 'cyclone_eyewall': {
      // Abyssal ocean background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 600, 600);

      const cx = 300;
      const cy = 300;

      // Spiral rainbands
      for (let band = 0; band < 12; band++) {
        const offset = band * (Math.PI / 6);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 14 + (band % 3) * 6;
        ctx.beginPath();
        for (let theta = 0; theta < Math.PI * 4; theta += 0.08) {
          const r = 40 + theta * 25;
          const px = cx + Math.cos(theta + offset) * r;
          const py = cy + Math.sin(theta + offset) * r;
          if (theta === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Dense eyewall cloud collar
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Clear dark storm eye in the center
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      break;
    }

    case 'saharan_dust_plume': {
      // Deep blue Atlantic ocean
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, 600, 600);

      // African coastline (right edge)
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(480, 0);
      ctx.lineTo(460, 200);
      ctx.lineTo(510, 400);
      ctx.lineTo(490, 600);
      ctx.lineTo(600, 600);
      ctx.lineTo(600, 0);
      ctx.closePath();
      ctx.fill();

      // Billowing yellow/tan mineral dust plume blown westward across ocean
      const dustGrad = ctx.createLinearGradient(550, 300, 50, 300);
      dustGrad.addColorStop(0, 'rgba(217, 119, 6, 0.95)');
      dustGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.7)');
      dustGrad.addColorStop(1, 'rgba(251, 191, 36, 0.2)');

      ctx.fillStyle = dustGrad;
      ctx.beginPath();
      ctx.moveTo(500, 80);
      ctx.bezierCurveTo(300, 50, 100, 120, 20, 220);
      ctx.bezierCurveTo(40, 420, 200, 520, 500, 480);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'pyrocumulonimbus': {
      // Dark charcoal forest landscape
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 600, 600);

      // Active fireline hot spots (glowing orange/red)
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(180, 420);
      ctx.lineTo(320, 460);
      ctx.lineTo(440, 410);
      ctx.stroke();

      // Violent convective smoke and cloud pillar mushrooming upward
      const cloudPuffs = [
        { x: 300, y: 350, r: 80, c: '#71717a' },
        { x: 260, y: 250, r: 100, c: '#a1a1aa' },
        { x: 350, y: 230, r: 110, c: '#cbd5e1' },
        { x: 220, y: 150, r: 120, c: '#f1f5f9' },
        { x: 380, y: 140, r: 130, c: '#ffffff' },
        { x: 300, y: 90, r: 140, c: '#ffffff' },
      ];

      for (const p of cloudPuffs) {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'wildfire_burn_scar': {
      // Unburned green forest in infrared false-color (red/green)
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, 600, 600);

      // Wildfire burn scar footprint (charcoal black / deep rust)
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(120, 180);
      ctx.bezierCurveTo(80, 280, 180, 420, 280, 480);
      ctx.bezierCurveTo(420, 520, 490, 360, 450, 240);
      ctx.bezierCurveTo(420, 140, 240, 100, 120, 180);
      ctx.closePath();
      ctx.fill();

      // Active flame front perimeter (blazing neon orange and yellow SWIR)
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(280, 480);
      ctx.bezierCurveTo(420, 520, 490, 360, 450, 240);
      ctx.stroke();

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.stroke();
      break;
    }

    case 'volcanic_caldera_lava': {
      // Basalt rock volcanic slopes
      ctx.fillStyle = '#292524';
      ctx.fillRect(0, 0, 600, 600);

      // Central collapsed caldera ring
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.ellipse(300, 280, 140, 110, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78716c';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Lava lake / vent in caldera
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(320, 270, 30, 0, Math.PI * 2);
      ctx.fill();

      // Solidified dark black lava flow lobes pouring down the rift zone
      ctx.fillStyle = '#0c0a09';
      ctx.beginPath();
      ctx.moveTo(330, 280);
      ctx.quadraticCurveTo(420, 350, 460, 480);
      ctx.lineTo(520, 580);
      ctx.lineTo(440, 600);
      ctx.quadraticCurveTo(390, 460, 300, 340);
      ctx.closePath();
      ctx.fill();

      // Incandescent thermal fissure line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(330, 280);
      ctx.quadraticCurveTo(420, 350, 460, 480);
      ctx.stroke();
      break;
    }

    case 'flood_inundation_extent': {
      // Normal agricultural plains (green/brown)
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(0, 0, 600, 600);

      // Regular river channel (thin blue ribbon)
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.bezierCurveTo(160, 200, 240, 350, 340, 600);
      ctx.stroke();

      // Massive flooded inundation footprint (dark specular radar blue)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.moveTo(50, 100);
      ctx.bezierCurveTo(180, 80, 380, 180, 480, 320);
      ctx.bezierCurveTo(520, 440, 400, 560, 250, 580);
      ctx.bezierCurveTo(100, 520, 20, 340, 50, 100);
      ctx.closePath();
      ctx.fill();

      // Isolated high ground villages emerging as islands
      for (let i = 0; i < 18; i++) {
        const vx = 120 + (i * 37) % 320;
        const vy = 150 + (i * 47) % 350;
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.arc(vx, vy, 8 + (i % 3) * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'tsunami_inundation_scour': {
      // Pacific Ocean (right side)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(350, 0, 250, 600);

      // Inland farmland & settlement (left side)
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, 0, 350, 600);

      // Scoured brown sediment inundation zone between coast and inland
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(350, 0);
      ctx.lineTo(350, 600);
      ctx.lineTo(180, 600);
      ctx.bezierCurveTo(220, 400, 140, 200, 210, 0);
      ctx.closePath();
      ctx.fill();

      // Standing seawater pools trapped behind sea wall
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.ellipse(230 + (i * 19) % 80, 50 + i * 45, 25, 12, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    // --- TIME SHIFT PAIRS ---
    case 'aral_sea_before': {
      // 1989: Expansive deep blue inland sea
      ctx.fillStyle = '#d97706'; // Surrounding Kyzylkum desert
      ctx.fillRect(0, 0, 600, 600);

      ctx.fillStyle = '#0369a1'; // Expansive sea
      ctx.beginPath();
      ctx.ellipse(300, 300, 230, 250, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vozrozhdeniya Island in center
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(300, 300, 35, 55, Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'aral_sea_after': {
      // 2024: 90% desiccation into white salt desert with thin remnant slivers
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, 0, 600, 600);

      // Former lakebed now Aralkum salt desert
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(300, 300, 230, 250, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tiny western remnant narrow strip
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(130, 300, 22, 170, 0, 0, Math.PI * 2);
      ctx.fill();

      // North Aral Sea preserved by Kokaral dam
      ctx.beginPath();
      ctx.ellipse(310, 110, 70, 35, -Math.PI / 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'vegas_sprawl_before': {
      // 1984: Desert valley with small compact urban grid
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, 600, 600);

      // Mountains flanking
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, 100, 600);
      ctx.fillRect(500, 0, 100, 600);

      // Small central urban footprint
      ctx.fillStyle = '#475569';
      ctx.fillRect(240, 240, 120, 120);

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      for (let x = 250; x <= 350; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 240);
        ctx.lineTo(x, 360);
        ctx.stroke();
      }
      break;
    }

    case 'vegas_sprawl_after': {
      // 2024: Massive urban expansion filling the entire valley basin
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, 600, 600);

      // Mountains flanking
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, 100, 600);
      ctx.fillRect(500, 0, 100, 600);

      // Enormous urban sprawl from mountain base to mountain base
      ctx.fillStyle = '#334155';
      ctx.fillRect(110, 80, 380, 440);

      // Dense street and highway grid
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      for (let x = 120; x <= 480; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 80);
        ctx.lineTo(x, 520);
        ctx.stroke();
      }
      for (let y = 90; y <= 510; y += 25) {
        ctx.beginPath();
        ctx.moveTo(110, y);
        ctx.lineTo(490, y);
        ctx.stroke();
      }

      // Beltway freeway ring
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.strokeRect(120, 90, 360, 420);
      break;
    }

    case 'columbia_glacier_before': {
      // 1986: Glacier terminus reaches far out to the coastline
      ctx.fillStyle = '#334155'; // Dark fjord bedrock
      ctx.fillRect(0, 0, 600, 600);

      // Glacier ice filling the fjord completely down to y=460
      ctx.fillStyle = '#f0f9ff';
      ctx.beginPath();
      ctx.moveTo(180, 0);
      ctx.lineTo(420, 0);
      ctx.lineTo(440, 460);
      ctx.lineTo(160, 460);
      ctx.closePath();
      ctx.fill();

      // Open fjord bay (bottom)
      ctx.fillStyle = '#082f49';
      ctx.fillRect(0, 460, 600, 140);
      break;
    }

    case 'columbia_glacier_after': {
      // 2024: Glacier retreated 20 km upfjord (now terminates at y=150)
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 600, 600);

      // Shrunken ice terminus far upfjord
      ctx.fillStyle = '#f0f9ff';
      ctx.beginPath();
      ctx.moveTo(200, 0);
      ctx.lineTo(400, 0);
      ctx.lineTo(390, 150);
      ctx.lineTo(210, 150);
      ctx.closePath();
      ctx.fill();

      // Open fjord water now occupying 70% of former glacier bed
      ctx.fillStyle = '#082f49';
      ctx.fillRect(0, 150, 600, 450);

      // Calved icebergs floating in newly opened fjord
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(100 + (i * 29) % 400, 180 + (i * 41) % 380, 4 + (i % 4), 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'dubai_islands_before': {
      // 1990: Straight natural coastline, open Arabian Gulf
      ctx.fillStyle = '#0284c7'; // Turquoise gulf water
      ctx.fillRect(0, 0, 600, 600);

      // Mainland desert coastline (bottom/right)
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(0, 420);
      ctx.lineTo(600, 360);
      ctx.lineTo(600, 600);
      ctx.lineTo(0, 600);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'dubai_islands_after': {
      // 2024: Palm Jumeirah & offshore archipelago constructed
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, 600, 600);

      // Mainland
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(0, 420);
      ctx.lineTo(600, 360);
      ctx.lineTo(600, 600);
      ctx.lineTo(0, 600);
      ctx.closePath();
      ctx.fill();

      // Palm Jumeirah trunk and fronds
      const px = 280;
      const py = 390;
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 14;

      // Crescent breakwater
      ctx.beginPath();
      ctx.arc(px, py - 110, 110, Math.PI * 0.9, Math.PI * 2.1);
      ctx.stroke();

      // Palm trunk
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py - 100);
      ctx.stroke();

      // Palm fronds
      for (let f = 1; f <= 5; f++) {
        const fy = py - f * 18;
        ctx.beginPath();
        ctx.moveTo(px - 50 - f * 6, fy - 15);
        ctx.lineTo(px, fy);
        ctx.lineTo(px + 50 + f * 6, fy - 15);
        ctx.stroke();
      }
      break;
    }

    case 'lake_mead_before': {
      // 2000: Full reservoir with deep water in side canyons
      ctx.fillStyle = '#78350f'; // Red rock canyon
      ctx.fillRect(0, 0, 600, 600);

      ctx.fillStyle = '#0f172a'; // Deep water
      ctx.beginPath();
      ctx.moveTo(40, 300);
      ctx.bezierCurveTo(150, 150, 350, 120, 560, 220);
      ctx.bezierCurveTo(500, 420, 320, 480, 120, 440);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'lake_mead_after': {
      // 2022: Dramatically shrunken water body with prominent white 'bathtub ring'
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, 600, 600);

      // White mineralized bathtub ring of former water extent
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(40, 300);
      ctx.bezierCurveTo(150, 150, 350, 120, 560, 220);
      ctx.bezierCurveTo(500, 420, 320, 480, 120, 440);
      ctx.closePath();
      ctx.fill();

      // Severely shrunken dark blue water body in the center
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(120, 310);
      ctx.bezierCurveTo(200, 210, 340, 200, 460, 250);
      ctx.bezierCurveTo(420, 370, 300, 410, 180, 380);
      ctx.closePath();
      ctx.fill();
      break;
    }

    default: {
      // Fallback generative Earth surface
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 600, 600);
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(300, 300, 180, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  // Add subtle satellite sensor scanline overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let y = 0; y < 600; y += 4) {
    ctx.fillRect(0, y, 600, 1.5);
  }

  const dataUrl = canvas.toDataURL('image/webp', 0.92);
  imageCache.set(key, dataUrl);
  return dataUrl;
}
