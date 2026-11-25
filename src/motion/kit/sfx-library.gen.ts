// Generado por scripts/sfx-gen.mjs a partir de public/sfx/sfx.manifest.json. No editar a mano.
export type SfxAncla = "inicio" | "pico" | "fin";
export type SfxDef = {volumen: number; ancla: SfxAncla; archivos: {src: string; duracionMs: number; ataqueMs: number; picoMs: number}[]};
export type SfxName = "pop" | "tick" | "clic" | "tecleo" | "confirmacion" | "alerta" | "notificacion" | "conteo" | "swipe" | "whoosh" | "riser" | "glitch" | "golpe" | "impacto" | "destello" | "logo" | "maleta-ruedas" | "sobre-enviado";
export const SFX_LIBRARY: Partial<Record<SfxName, SfxDef>> = {
  "pop": {
    "volumen": 0.35,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/ui/pop-v1.wav",
        "duracionMs": 480,
        "ataqueMs": 150,
        "picoMs": 159
      },
      {
        "src": "sfx/ui/pop-v2.wav",
        "duracionMs": 480,
        "ataqueMs": 0,
        "picoMs": 1
      },
      {
        "src": "sfx/ui/pop-v3.wav",
        "duracionMs": 135,
        "ataqueMs": 0,
        "picoMs": 27
      }
    ]
  },
  "tick": {
    "volumen": 0.3,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/ui/tick-v1.wav",
        "duracionMs": 204,
        "ataqueMs": 24,
        "picoMs": 95
      },
      {
        "src": "sfx/ui/tick-v2.wav",
        "duracionMs": 264,
        "ataqueMs": 24,
        "picoMs": 186
      },
      {
        "src": "sfx/ui/tick-v3.wav",
        "duracionMs": 274,
        "ataqueMs": 29,
        "picoMs": 65
      }
    ]
  },
  "clic": {
    "volumen": 0.35,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/ui/clic-v1.wav",
        "duracionMs": 324,
        "ataqueMs": 149,
        "picoMs": 262
      },
      {
        "src": "sfx/ui/clic-v2.wav",
        "duracionMs": 389,
        "ataqueMs": 24,
        "picoMs": 126
      },
      {
        "src": "sfx/ui/clic-v3.wav",
        "duracionMs": 394,
        "ataqueMs": 24,
        "picoMs": 343
      }
    ]
  },
  "tecleo": {
    "volumen": 0.22,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/ui/tecleo-v1.wav",
        "duracionMs": 1864,
        "ataqueMs": 19,
        "picoMs": 278
      },
      {
        "src": "sfx/ui/tecleo-v2.wav",
        "duracionMs": 1969,
        "ataqueMs": 14,
        "picoMs": 1217
      }
    ]
  },
  "confirmacion": {
    "volumen": 0.3,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/ui/confirmacion-v1.wav",
        "duracionMs": 565,
        "ataqueMs": 0,
        "picoMs": 1
      },
      {
        "src": "sfx/ui/confirmacion-v2.wav",
        "duracionMs": 585,
        "ataqueMs": 0,
        "picoMs": 3
      }
    ]
  },
  "alerta": {
    "volumen": 0.28,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/ui/alerta-v1.wav",
        "duracionMs": 500,
        "ataqueMs": 0,
        "picoMs": 82
      },
      {
        "src": "sfx/ui/alerta-v2.wav",
        "duracionMs": 575,
        "ataqueMs": 0,
        "picoMs": 2
      }
    ]
  },
  "notificacion": {
    "volumen": 0.3,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/ui/notificacion-v1.wav",
        "duracionMs": 680,
        "ataqueMs": 0,
        "picoMs": 21
      },
      {
        "src": "sfx/ui/notificacion-v2.wav",
        "duracionMs": 680,
        "ataqueMs": 0,
        "picoMs": 2
      }
    ]
  },
  "conteo": {
    "volumen": 0.22,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/ui/conteo-v1.wav",
        "duracionMs": 1119,
        "ataqueMs": 14,
        "picoMs": 714
      },
      {
        "src": "sfx/ui/conteo-v2.wav",
        "duracionMs": 1200,
        "ataqueMs": 0,
        "picoMs": 102
      }
    ]
  },
  "swipe": {
    "volumen": 0.3,
    "ancla": "pico",
    "archivos": [
      {
        "src": "sfx/transicion/swipe-v1.wav",
        "duracionMs": 409,
        "ataqueMs": 99,
        "picoMs": 184
      },
      {
        "src": "sfx/transicion/swipe-v2.wav",
        "duracionMs": 415,
        "ataqueMs": 70,
        "picoMs": 146
      },
      {
        "src": "sfx/transicion/swipe-v3.wav",
        "duracionMs": 430,
        "ataqueMs": 110,
        "picoMs": 174
      }
    ]
  },
  "whoosh": {
    "volumen": 0.3,
    "ancla": "pico",
    "archivos": [
      {
        "src": "sfx/transicion/whoosh-v1.wav",
        "duracionMs": 350,
        "ataqueMs": 10,
        "picoMs": 75
      },
      {
        "src": "sfx/transicion/whoosh-v2.wav",
        "duracionMs": 535,
        "ataqueMs": 50,
        "picoMs": 141
      },
      {
        "src": "sfx/transicion/whoosh-v3.wav",
        "duracionMs": 570,
        "ataqueMs": 5,
        "picoMs": 113
      }
    ]
  },
  "riser": {
    "volumen": 0.25,
    "ancla": "fin",
    "archivos": [
      {
        "src": "sfx/transicion/riser-v1.wav",
        "duracionMs": 1174,
        "ataqueMs": 539,
        "picoMs": 762
      },
      {
        "src": "sfx/transicion/riser-v2.wav",
        "duracionMs": 1059,
        "ataqueMs": 464,
        "picoMs": 846
      }
    ]
  },
  "glitch": {
    "volumen": 0.22,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/transicion/glitch-v1.wav",
        "duracionMs": 480,
        "ataqueMs": 0,
        "picoMs": 217
      },
      {
        "src": "sfx/transicion/glitch-v2.wav",
        "duracionMs": 480,
        "ataqueMs": 10,
        "picoMs": 395
      }
    ]
  },
  "golpe": {
    "volumen": 0.4,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/impacto/golpe-v1.wav",
        "duracionMs": 680,
        "ataqueMs": 0,
        "picoMs": 6
      },
      {
        "src": "sfx/impacto/golpe-v2.wav",
        "duracionMs": 680,
        "ataqueMs": 0,
        "picoMs": 93
      }
    ]
  },
  "impacto": {
    "volumen": 0.4,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/impacto/impacto-v1.wav",
        "duracionMs": 1480,
        "ataqueMs": 0,
        "picoMs": 0
      },
      {
        "src": "sfx/impacto/impacto-v2.wav",
        "duracionMs": 1480,
        "ataqueMs": 0,
        "picoMs": 28
      }
    ]
  },
  "destello": {
    "volumen": 0.25,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/impacto/destello-v1.wav",
        "duracionMs": 880,
        "ataqueMs": 0,
        "picoMs": 69
      },
      {
        "src": "sfx/impacto/destello-v2.wav",
        "duracionMs": 880,
        "ataqueMs": 0,
        "picoMs": 226
      }
    ]
  },
  "logo": {
    "volumen": 0.35,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/marca/logo-v1.wav",
        "duracionMs": 1760,
        "ataqueMs": 0,
        "picoMs": 147
      },
      {
        "src": "sfx/marca/logo-v2.wav",
        "duracionMs": 1510,
        "ataqueMs": 260,
        "picoMs": 425
      }
    ]
  },
  "maleta-ruedas": {
    "volumen": 0.28,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/objeto/maleta-ruedas-v1.wav",
        "duracionMs": 465,
        "ataqueMs": 10,
        "picoMs": 103
      },
      {
        "src": "sfx/objeto/maleta-ruedas-v2.wav",
        "duracionMs": 879,
        "ataqueMs": 14,
        "picoMs": 20
      }
    ]
  },
  "sobre-enviado": {
    "volumen": 0.32,
    "ancla": "inicio",
    "archivos": [
      {
        "src": "sfx/objeto/sobre-enviado-v1.wav",
        "duracionMs": 804,
        "ataqueMs": 49,
        "picoMs": 493
      },
      {
        "src": "sfx/objeto/sobre-enviado-v2.wav",
        "duracionMs": 625,
        "ataqueMs": 230,
        "picoMs": 415
      }
    ]
  }
};
