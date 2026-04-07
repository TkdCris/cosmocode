"use client";
import { useEffect, useState } from "react";

export default function StarBackground() {
    const [shadows, setShadows] = useState({ s1: "", s2: "", s3: "" });

    useEffect(() => {
        // Função para gerar coordenadas aleatórias de sombras (estrelas)
        const generateStars = (count: number) => {
            let l = "";
            for (let i = 0; i < count; i++) {
                l += `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF${i < count - 1 ? "," : ""}`;
            }
            return l;
        };

        setShadows({
            s1: generateStars(700), // Estrelas pequenas (mais longe)
            s2: generateStars(200), // Estrelas médias
            s3: generateStars(100), // Estrelas grandes (mais perto)
        });
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-950 pointer-events-none">
            <div id="stars" style={{ boxShadow: shadows.s1 }}></div>
            <div id="stars2" style={{ boxShadow: shadows.s2 }}></div>
            <div id="stars3" style={{ boxShadow: shadows.s3 }}></div>
        </div>
    );
}