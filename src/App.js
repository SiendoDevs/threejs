import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { CubeCamera, Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Html } from "@react-three/drei";

import "./style.css";
import { Boxes } from "./Boxes";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { FloatingGrid } from "./FloatingGrid";
import { Rings } from "./Rings";
import Navbar from "./Navbar";


function InfoRectangle({ position, title, description }) {
  return (
    <Html position={position}>
      <div className="info-rectangle">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Html>
  );
}

function CarShow() {
  return (
    <>
      <OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} />

      <PerspectiveCamera makeDefault fov={50} position={[3, 2, 5]} />

      <color args={[0, 0, 0]} attach="background" />

      <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <Car />
          </>
        )}
      </CubeCamera>

      <spotLight
        color={[1, 0.25, 0.7]}
        intensity={1.5}
        angle={0.6}
        penumbra={0.5}
        position={[5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <spotLight
        color={[0.14, 0.5, 1]}
        intensity={2}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <Ground />
      <FloatingGrid />
      <Boxes />
      <Rings />

      <EffectComposer>
        <Bloom
          blendFunction={BlendFunction.ADD}
          intensity={1}
          width={300}
          height={300}
          kernelSize={5}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.025}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0005, 0.0012]}
        />
      </EffectComposer>

      {/* Agregar tres rectángulos con información */}
      <InfoRectangle
        position={[-4, 2, 0]}
        title="Feature 1"
        description="Descripción del rectángulo 1"
      />
      <InfoRectangle
        position={[0, 2, 0]}
        title="Feature 2"
        description="Descripción del rectángulo 2"
      />
      <InfoRectangle
        position={[4, 2, 0]}
        title="Feature 3"
        description="Descripción del rectángulo 3"
      />
    </>
  );
}

function App() {
  return (
    <Suspense fallback={null}>
      <div>
        <Navbar />
        <Canvas shadows>
          <CarShow />
        </Canvas>
      </div>
    </Suspense>
  );
}

export default App;
