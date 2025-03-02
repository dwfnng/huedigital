import { useCallback } from "react";
import { loadSlim } from "@tsparticles/slim";
import Particles from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1
        },
        particles: {
          number: {
            value: 20,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#65000b"
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.1,
            random: true
          },
          size: {
            value: 5,
            random: true
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            outModes: "out",
            bounce: false,
          },
          links: {
            enable: true,
            distance: 150,
            color: "#65000b",
            opacity: 0.1,
            width: 1
          }
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: "grab"
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.3
              }
            }
          }
        },
        retina_detect: true,
        background: {
          color: "transparent"
        }
      }}
    />
  );
}