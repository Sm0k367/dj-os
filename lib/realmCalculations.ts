/**
 * NEURAL_VAULT_OS // GEOMETRY_LOGIC_v10.0
 * Pure mathematical mappings for 12+ Procedural Realms
 */

export const generateRealmPoints = (type: number, count: number = 15000, seed: number) => {
  const pos = new Float32Array(count * 3);
  const random = () => {
    // Deterministic random based on seed
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2;
    const v = Math.acos(-1 + (2 * i) / count); // For spherical distributions
    let x = 0, y = 0, z = 0;

    switch (type % 12) {
      case 0: // TORUS KNOT
        const p = 2, q = 3, rK = 200 * (2 + Math.cos(q * u));
        x = rK * Math.cos(p * u);
        y = rK * Math.sin(p * u);
        z = 200 * Math.sin(q * u);
        break;

      case 1: // SPIRAL TUNNEL
        const zS = (i * 0.2) - 1000, rS = 200 + Math.sin(i * 0.01) * 50;
        x = rS * Math.cos(i * 0.1);
        y = rS * Math.sin(i * 0.1);
        z = zS;
        break;

      case 2: // DNA ARCHIVE (Double Helix)
        const hDNA = (i * 0.1) - 750, rDNA = 150;
        const off = (i % 2 === 0) ? 0 : Math.PI;
        x = rDNA * Math.cos(i * 0.05 + off);
        y = hDNA;
        z = rDNA * Math.sin(i * 0.05 + off);
        break;

      case 3: // CYBER WAVE (Animated Grid)
        x = ((i % 120) * 15) - 900;
        y = Math.sin(i * 0.05) * 100;
        z = (Math.floor(i / 120) * 15) - 900;
        break;

      case 4: // NEURAL CORE (Spherical)
        const phi = Math.sqrt(count * Math.PI) * v;
        x = 400 * Math.cos(phi) * Math.sin(v);
        y = 400 * Math.sin(phi) * Math.sin(v);
        z = 400 * Math.cos(v);
        break;

      case 5: // VOID CLOUD (Randomized)
        x = (random() * 2000) - 1000;
        y = (random() * 2000) - 1000;
        z = (random() * 2000) - 1000;
        break;

      case 6: // DATA PIPE (Cylinder)
        const rC = 300;
        x = rC * Math.cos(u * 5);
        y = (random() * 2000) - 1000;
        z = rC * Math.sin(u * 5);
        break;

      case 7: // GEOMETRIC CAGE
        const size = 600;
        x = (random() - 0.5) * size;
        y = (i % 2 === 0 ? size / 2 : -size / 2);
        z = (random() - 0.5) * size;
        break;

      case 8: // QUANTUM FOAM (Wave-Particle Duality)
        x = (random() - 0.5) * 1200;
        y = Math.sin(x * 0.01) * 150 + Math.cos(i * 0.01) * 50;
        z = (random() - 0.5) * 1200;
        break;

      case 9: // FIBONACCI LATTICE (Golden Spiral)
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const rF = Math.sqrt(i) * 10;
        const thetaF = i * goldenAngle;
        x = rF * Math.cos(thetaF);
        y = rF * Math.sin(thetaF);
        z = Math.sin(i * 0.1) * 50;
        break;

      case 10: // CRYSTAL MATRIX (Voxelized)
        x = ((i % 25) * 40) - 500;
        y = (Math.floor(i / 25) % 25) * 40 - 500;
        z = (Math.floor(i / 625) % 25) * 40 - 500;
        break;

      case 11: // QUANTUM PRINGLE (Hyperbolic Paraboloid)
        const px = (random() - 0.5) * 800;
        const pz = (random() - 0.5) * 800;
        x = px;
        z = pz;
        y = (px * px) / 400 - (pz * pz) / 400; // z = x²/a - y²/b
        break;
    }

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
};
