export interface ModelAnalysis {
  dimensionX: number;
  dimensionY: number;
  dimensionZ: number;
  volumeCm3: number;
  surfaceArea: number;
  triangleCount: number;
}

function readFloat32LE(buffer: Buffer, offset: number): number {
  return buffer.readFloatLE(offset);
}

// Binary STL: 80-byte header + 4-byte triangle count + N×50 bytes per triangle
export function analyzeSTL(buffer: Buffer): ModelAnalysis {
  // Check for ASCII STL
  const header = buffer.slice(0, 5).toString("ascii");
  if (header.toLowerCase().startsWith("solid")) {
    return analyzeASCIISTL(buffer.toString("utf8"));
  }
  return analyzeBinarySTL(buffer);
}

function analyzeBinarySTL(buffer: Buffer): ModelAnalysis {
  if (buffer.length < 84) throw new Error("File too small to be a valid STL");

  const triangleCount = buffer.readUInt32LE(80);
  const expectedSize = 84 + triangleCount * 50;

  if (buffer.length < expectedSize) throw new Error("Truncated STL file");

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let volume = 0;
  let surfaceArea = 0;

  for (let i = 0; i < triangleCount; i++) {
    const offset = 84 + i * 50;
    // Skip 12 bytes for normal vector
    const v1x = readFloat32LE(buffer, offset + 12);
    const v1y = readFloat32LE(buffer, offset + 16);
    const v1z = readFloat32LE(buffer, offset + 20);
    const v2x = readFloat32LE(buffer, offset + 24);
    const v2y = readFloat32LE(buffer, offset + 28);
    const v2z = readFloat32LE(buffer, offset + 32);
    const v3x = readFloat32LE(buffer, offset + 36);
    const v3y = readFloat32LE(buffer, offset + 40);
    const v3z = readFloat32LE(buffer, offset + 44);

    minX = Math.min(minX, v1x, v2x, v3x);
    minY = Math.min(minY, v1y, v2y, v3y);
    minZ = Math.min(minZ, v1z, v2z, v3z);
    maxX = Math.max(maxX, v1x, v2x, v3x);
    maxY = Math.max(maxY, v1y, v2y, v3y);
    maxZ = Math.max(maxZ, v1z, v2z, v3z);

    // Signed volume contribution via divergence theorem
    volume += (v1x * (v2y * v3z - v3y * v2z) -
               v1y * (v2x * v3z - v3x * v2z) +
               v1z * (v2x * v3y - v3x * v2y)) / 6.0;

    // Triangle area via cross product
    const ax = v2x - v1x, ay = v2y - v1y, az = v2z - v1z;
    const bx = v3x - v1x, by = v3y - v1y, bz = v3z - v1z;
    const cx = ay * bz - az * by;
    const cy = az * bx - ax * bz;
    const cz = ax * by - ay * bx;
    surfaceArea += Math.sqrt(cx * cx + cy * cy + cz * cz) / 2;
  }

  // Dimensions in mm
  const dimensionX = maxX - minX;
  const dimensionY = maxY - minY;
  const dimensionZ = maxZ - minZ;

  // Convert mm³ to cm³
  const volumeCm3 = Math.abs(volume) / 1000;
  const surfaceAreaCm2 = surfaceArea / 100;

  return {
    dimensionX: Math.round(dimensionX * 100) / 100,
    dimensionY: Math.round(dimensionY * 100) / 100,
    dimensionZ: Math.round(dimensionZ * 100) / 100,
    volumeCm3: Math.round(volumeCm3 * 1000) / 1000,
    surfaceArea: Math.round(surfaceAreaCm2 * 100) / 100,
    triangleCount,
  };
}

function analyzeASCIISTL(content: string): ModelAnalysis {
  const vertexRegex = /vertex\s+([-\d.e+]+)\s+([-\d.e+]+)\s+([-\d.e+]+)/gi;
  const vertices: [number, number, number][] = [];
  let match;

  while ((match = vertexRegex.exec(content)) !== null) {
    vertices.push([parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])]);
  }

  if (vertices.length === 0) throw new Error("No vertices found in STL");
  if (vertices.length % 3 !== 0) throw new Error("Invalid vertex count");

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let volume = 0;
  let surfaceArea = 0;

  for (let i = 0; i < vertices.length; i++) {
    const [x, y, z] = vertices[i];
    minX = Math.min(minX, x); minY = Math.min(minY, y); minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); maxZ = Math.max(maxZ, z);
  }

  for (let i = 0; i < vertices.length; i += 3) {
    const [v1x, v1y, v1z] = vertices[i];
    const [v2x, v2y, v2z] = vertices[i + 1];
    const [v3x, v3y, v3z] = vertices[i + 2];

    volume += (v1x * (v2y * v3z - v3y * v2z) -
               v1y * (v2x * v3z - v3x * v2z) +
               v1z * (v2x * v3y - v3x * v2y)) / 6.0;

    const ax = v2x - v1x, ay = v2y - v1y, az = v2z - v1z;
    const bx = v3x - v1x, by = v3y - v1y, bz = v3z - v1z;
    const cx = ay * bz - az * by, cy = az * bx - ax * bz, cz = ax * by - ay * bx;
    surfaceArea += Math.sqrt(cx * cx + cy * cy + cz * cz) / 2;
  }

  return {
    dimensionX: Math.round((maxX - minX) * 100) / 100,
    dimensionY: Math.round((maxY - minY) * 100) / 100,
    dimensionZ: Math.round((maxZ - minZ) * 100) / 100,
    volumeCm3: Math.round((Math.abs(volume) / 1000) * 1000) / 1000,
    surfaceArea: Math.round((surfaceArea / 100) * 100) / 100,
    triangleCount: vertices.length / 3,
  };
}

// For STEP/OBJ/3MF files — return a size-based estimate when full parsing isn't available
export function estimateFromFileSize(fileSizeBytes: number): Partial<ModelAnalysis> {
  // Rough heuristic: 1MB binary STL ≈ 20K triangles ≈ 50cm³ part
  const estimatedVolumeCm3 = (fileSizeBytes / (1024 * 1024)) * 50;
  const side = Math.cbrt(estimatedVolumeCm3 * 1000); // back to mm³
  return {
    dimensionX: Math.round(side),
    dimensionY: Math.round(side * 0.8),
    dimensionZ: Math.round(side * 0.6),
    volumeCm3: Math.round(estimatedVolumeCm3 * 10) / 10,
  };
}
