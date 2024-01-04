import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import {
  CubeCamera,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import "./style.css";
import { Boxes } from "./Boxes";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { FloatingGrid } from "./FloatingGrid";
import { Rings } from "./Rings";
import Navbar from "./Navbar";
import { Html } from "@react-three/drei";

function InfoRectangle({ position, title, description }) {
  return (
    <Html position={position} center>
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
      <OrbitControls 
        target={[0, 0.35, 0]}
        maxPolarAngle={1.45}
      />

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
        {/* <DepthOfField focusDistance={0.0035} focalLength={0.01} bokehScale={3} height={480} /> */}
        <Bloom
          blendFunction={BlendFunction.ADD}
          intensity={1.3} // The bloom intensity.
          width={300} // render width
          height={300} // render height
          kernelSize={5} // blur kernel size
          luminanceThreshold={0.15} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[0.0005, 0.0012]} // color offset
        />
      </EffectComposer>

      {/* Agregar tres rectángulos con información */}
      <InfoRectangle position={[-4, 2, 0]} title="Feature 1" description="Descripción del rectángulo 1" />
      <InfoRectangle position={[0, 2, 0]} title="Feature 2" description="Descripción del rectángulo 2" />
      <InfoRectangle position={[4, 2, 0]} title="Feature 3" description="Descripción del rectángulo 3" />

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
          <Html>
            <div style={{ position: "absolute", top: 10, left: 10, color: "white" }}>
              <h1>Contenido HTML Superpuesto</h1>
              <p>¡Puedes agregar cualquier cosa aquí!</p>
            </div>
          </Html>
        </Canvas>
      </div>
    </Suspense>
  );
}

export default App;