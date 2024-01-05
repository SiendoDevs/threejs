import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferGeometry, BufferAttribute, PointsMaterial, Points } from "three";

const Smoke = ({ carRef }) => {
  const ref = useRef();

  const geometry = useMemo(() => {
    const particleCount = 500000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = Math.random() * 0.1 - 0.1;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = 0; // Inicialmente, la velocidad es cero en todas las direcciones
      velocities[i + 1] = 0;
      velocities[i + 2] = 0;
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("velocity", new BufferAttribute(velocities, 3));

    return geo;
  }, []);

  const material = useMemo(
    () =>
      new PointsMaterial({
        color: 0x888888,
        size: 0.0001,
        blending: 1,
        depthTest: false,
        transparent: true,
        opacity: 0.8,
      }),
    []
  );

  useEffect(() => {
    // Actualizar la velocidad de las partículas basándonos en la posición del coche
    const updateSmokeVelocity = () => {
      const carPosition = carRef.current.position;
      const smokePositions = ref.current.geometry.attributes.position.array;
      const smokeVelocities = ref.current.geometry.attributes.velocity.array;

      for (let i = 0; i < smokePositions.length; i += 3) {
        const dx = smokePositions[i] - carPosition.x;
        const dz = smokePositions[i + 2] - carPosition.z;
        const distanceSquared = dx * dx + dz * dz;

        // La velocidad es inversamente proporcional a la distancia al coche
        const speed = 1 / (distanceSquared + 1);
        smokeVelocities[i] = (dx / distanceSquared) * speed;
        smokeVelocities[i + 1] = 0; // No afectar la velocidad en y
        smokeVelocities[i + 2] = (dz / distanceSquared) * speed;
      }

      ref.current.geometry.attributes.velocity.needsUpdate = true;
    };

    // Llamar a la función de actualización en cada frame
    const frameId = requestAnimationFrame(updateSmokeVelocity);

    return () => cancelAnimationFrame(frameId);
  }, [carRef]);

  useFrame(() => {
    const positions = ref.current.geometry.attributes.position.array;
    const velocities = ref.current.geometry.attributes.velocity.array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Envolver las partículas alrededor del espacio para mantenerlas dentro del área visible
      if (positions[i] > 10) positions[i] = -10;
      if (positions[i + 2] > 10) positions[i + 2] = -10;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial attach="material" {...material} />
    </points>
  );
};

export default Smoke;
