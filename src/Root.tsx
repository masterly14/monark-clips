import React from "react";
import {Composition, staticFile, type CalculateMetadataFunction} from "remotion";
import type {Caption} from "@remotion/captions";
import {Testimonial} from "./Testimonial";
import {clips} from "./clips";
import type {ClipConfig, TestimonialProps} from "./types";
import {Reel, type ReelProps} from "./reel/Reel";
import {Video2Motion, FPS as V2_FPS, DURATION_S as V2_DUR} from "./motion/video2/Video2Motion";

import {TestingGptMotion} from "./motion/testing-gpt/TestingGptMotion";
import {DURATION_FRAMES as TESTING_GPT_DURATION, FPS as TESTING_GPT_FPS} from "./motion/testing-gpt/edit";

import {AlexPasaporte} from "./motion/alex-pasaporte/AlexPasaporte";
import {DURATION_FRAMES as ALEX_DURATION, FPS as ALEX_FPS} from "./motion/alex-pasaporte/edit";

import {AlexPasaporteV2} from "./motion/alex-pasaporte-v2/AlexPasaporteV2";
import {DURATION as ALEX_V2_DURATION, FPS as ALEX_V2_FPS} from "./motion/alex-pasaporte-v2/timeline";

import {KitDemo, FPS as KIT_FPS, DURATION_S as KIT_DUR} from "./motion/kit-demo/KitDemo";
import {SfxDemo, FPS as SFX_FPS, DURATION_S as SFX_DUR} from "./motion/kit-demo/SfxDemo";

import {ZapataReelFull} from "./motion/zapata-reel/ZapataReel";
import {INTRO_S as ZR_INTRO} from "./motion/zapata-reel/CallIntro";
import {FPS as ZR_FPS, DURATION_S as ZR_DUR} from "./motion/zapata-reel/beats";

import {CatalinaReelFull} from "./motion/catalina-reel/CatalinaReel";
import {INTRO_S as CR_INTRO} from "./motion/catalina-reel/CallIntro";
import {FPS as CR_FPS, DURATION_S as CR_DUR} from "./motion/catalina-reel/beats";

const FPS = 30;

const calculateMetadata: CalculateMetadataFunction<TestimonialProps> = async ({props}) => {
  let captions: Caption[] = [];
  if (props.captionsFile) {
    const res = await fetch(staticFile(props.captionsFile));
    captions = (await res.json()) as Caption[];
    // Correcciones manuales de Whisper (palabra exacta → palabra correcta)
    const fixes = props.captionFixes ?? {};
    captions = captions.map((c) => {
      const key = c.text.trim();
      return fixes[key] ? {...c, text: c.text.replace(key, fixes[key])} : c;
    });
  }
  const seconds = props.trimEndSec - props.trimStartSec + props.outroSec;
  return {durationInFrames: Math.round(seconds * FPS), props: {...props, captions}};
};

const VIDEO2_FIXES: Record<string, string> = {
  "Zapatospitality,": "Zapata Hospitality,",
  "intervención": "inteligencia",
  "otas,": "OTAs,",
  "Monarch.": "Monark.",
  "Monarch": "Monark",
  "PMIS": "PMS",
  "perseguimos": "percibimos",
};

const reelMetadata: CalculateMetadataFunction<ReelProps> = async ({props}) => {
  const res = await fetch(staticFile("clips/video2.captions.json"));
  const raw = (await res.json()) as Caption[];
  const captions = raw.map((c) => {
    const key = c.text.trim();
    return VIDEO2_FIXES[key] ? {...c, text: c.text.replace(key, VIDEO2_FIXES[key])} : c;
  });
  return {props: {...props, captions}};
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="catalina-reel" component={CatalinaReelFull} width={1080} height={1920} fps={CR_FPS} durationInFrames={Math.round((CR_INTRO + CR_DUR) * CR_FPS)} />
    <Composition id="zapata-reel" component={ZapataReelFull} width={1080} height={1920} fps={ZR_FPS} durationInFrames={Math.round((ZR_INTRO + ZR_DUR) * ZR_FPS)} />
    <Composition id="kit-demo" component={KitDemo} width={1080} height={1920} fps={KIT_FPS} durationInFrames={KIT_DUR * KIT_FPS} />
    <Composition id="sfx-demo" component={SfxDemo} width={1080} height={1920} fps={SFX_FPS} durationInFrames={SFX_DUR * SFX_FPS} />
    <Composition
      id="alex-pasaporte-v2"
      component={AlexPasaporteV2}
      width={1080}
      height={1920}
      fps={ALEX_V2_FPS}
      durationInFrames={ALEX_V2_DURATION}
    />
    <Composition
      id="alex-pasaporte"
      component={AlexPasaporte}
      width={1080}
      height={1920}
      fps={ALEX_FPS}
      durationInFrames={ALEX_DURATION}
    />
    <Composition
      id="testing-gpt-motion"
      component={TestingGptMotion}
      width={1080}
      height={1920}
      fps={TESTING_GPT_FPS}
      durationInFrames={TESTING_GPT_DURATION}
    />
    <Composition
      id="video2-motion"
      component={Video2Motion}
      width={1080}
      height={1920}
      fps={V2_FPS}
      durationInFrames={Math.round(V2_DUR * V2_FPS)}
    />
    <Composition
      id="video2-editado"
      component={Reel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={Math.floor(61.55 * FPS)}
      defaultProps={{video: "clips/video2-raw.mp4", captions: []} as ReelProps}
      calculateMetadata={reelMetadata}
    />
    {clips.map((clip: ClipConfig) => (
      <Composition
        key={clip.id}
        id={clip.id}
        component={Testimonial}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={Math.round((clip.trimEndSec - clip.trimStartSec + clip.outroSec) * FPS)}
        defaultProps={{...clip, captions: []} as TestimonialProps}
        calculateMetadata={calculateMetadata}
      />
    ))}
  </>
);
