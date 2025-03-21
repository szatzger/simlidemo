"use client";
import React, { use, useEffect, useState } from "react";
import SimliOpenAI from "./SimliOpenAI";
import SimliAgent from "./SimliAgent";
import DottedFace from "./Components/DottedFace";
import SimliHeaderLogo from "./Components/Logo";
import Navbar from "./Components/Navbar";
import Image from "next/image";
import GitHubLogo from "@/media/github-mark-white.svg";

interface avatarSettings {
  name: string;
  openai_voice: "alloy"|"ash"|"ballad"|"coral"|"echo"|"sage"|"shimmer"|"verse";
  openai_model: string;
  simli_faceid: string;
  initialPrompt: string;
}

// Customize your avatar here
const avatar: avatarSettings = {
  name: "Frank",
  openai_voice: "echo",
  openai_model: "gpt-4o-mini-realtime-preview-2024-12-17", // Use "gpt-4o-mini-realtime-preview-2024-12-17" for cheaper and faster responses
 // simli_faceid: "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215",
 simli_faceid: "3af51cbb-21ee-44c5-8949-8d3a1c3ce5a0",
  initialPrompt:
    "Te egy segítőkész AI asszisztens vagy, Franknek hívnak. Barátságos és tömör válaszokat adsz. Feladatod, hogy segíts a felhasználóknak bármilyen kérdésben. Válaszaid rövidek és lényegretörőek legyenek. Mindig magyarul beszélj. A beszélgetést a következő mondattal kezdd: 'Szia! Miben segíthetek ma?'",
};

const Demo: React.FC = () => {
  const [showDottedFace, setShowDottedFace] = useState(true);
  const [modelType, setModelType] = useState<"openai" | "simli">("openai");

  const onStart = () => {
    console.log("Setting setshowDottedface to false...");
    setShowDottedFace(false);
  };

  const onClose = () => {
    console.log("Setting setshowDottedface to true...");
    setShowDottedFace(true);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center font-abc-repro font-normal text-sm text-white p-8">
      <SimliHeaderLogo />
      <Navbar />
      <div className="absolute top-[32px] right-[32px]">
        <text
          onClick={() => {
            window.open("https://github.com/simliai/create-simli-app-openai");
          }}
          className="font-bold cursor-pointer mb-8 text-xl leading-8"
        >
          <Image className="w-[20px] inline mr-2" src={GitHubLogo} alt="" />
          create-simli-app (OpenAI)
        </text>
      </div>
      
      {/* Model váltókapcsoló */}
      <div className="flex items-center justify-center mb-4 bg-[#1a1a1a] p-2 rounded-lg">
        <button 
          className={`px-4 py-2 rounded-md transition-all ${modelType === "openai" ? "bg-simliblue text-white" : "bg-transparent text-gray-400 hover:text-white"}`}
          onClick={() => setModelType("openai")}
        >
          OpenAI Realtime
        </button>
        <button 
          className={`px-4 py-2 rounded-md transition-all ${modelType === "simli" ? "bg-simliblue text-white" : "bg-transparent text-gray-400 hover:text-white"}`}
          onClick={() => setModelType("simli")}
        >
          Simli
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-6 bg-effect15White p-6 pb-[40px] rounded-xl w-full">
        <div>
          {showDottedFace && <DottedFace />}
          {modelType === "openai" ? (
            <SimliOpenAI
              openai_voice={avatar.openai_voice}
              openai_model={avatar.openai_model}
              simli_faceid={avatar.simli_faceid}
              initialPrompt={avatar.initialPrompt}
              onStart={onStart}
              onClose={onClose}
              showDottedFace={showDottedFace}
            />
          ) : (
            <SimliAgent
              simli_faceid={avatar.simli_faceid}
              initialPrompt={avatar.initialPrompt}
              onStart={onStart}
              onClose={onClose}
              showDottedFace={showDottedFace}
            />
          )}
        </div>
      </div>

      <div className="max-w-[350px] font-thin flex flex-col items-center ">
        <span className="font-bold mb-[8px] leading-5 ">
          {" "}
          {modelType === "openai" 
            ? "Ez egy Simli avatár, melyet az Open AI Whisper API-ja lát el hangfelismeréssel." 
            : "Ez egy Simli avatár, mely a Simli Agent API-t használja."}
        </span>
        <span className=" mt-[16px]">
          {modelType === "openai" 
            ? "Egy kicsit döcög a hangfelismerés, de ha szépen beszélsz, megérti."
            : "A Simli Agent egy teljes körű megoldást kínál avatárok létrehozására és kezelésére."}
        </span>
      </div>
    </div>
  );
};

export default Demo;
