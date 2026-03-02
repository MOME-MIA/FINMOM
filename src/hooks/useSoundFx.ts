"use client";

import { useCallback, useRef, useEffect } from "react";

export function useSoundFx() {
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    const getContext = () => {
        if (!audioContextRef.current) {
            const Ctx = (window.AudioContext || (window as any).webkitAudioContext);
            if (Ctx) audioContextRef.current = new Ctx();
        }
        return audioContextRef.current;
    };

    const playTone = (freq: number, type: OscillatorType, duration: number, delay = 0, vol = 0.1) => {
        const ctx = getContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
    };

    const playHover = useCallback(() => {
        // Soft Glass Tap (Sine wave, lower pitch)
        playTone(400, "sine", 0.1, 0, 0.05);
    }, []);

    const playClick = useCallback(() => {
        // Mechanical Switch (Square + Triangle, tight envelope)
        playTone(800, "square", 0.05, 0, 0.02);
        playTone(300, "triangle", 0.05, 0, 0.05);
    }, []);

    const playError = useCallback(() => {
        // Digital Glitch (Sawtooth, dissonant)
        const ctx = getContext();
        if (!ctx) return;
        [110, 105, 100].forEach((f, i) => {
            playTone(f, "sawtooth", 0.2, i * 0.05, 0.08);
        });
    }, []);

    const playSuccess = useCallback(() => {
        // Ethereal Chime (Major 7th Chord)
        const ctx = getContext();
        if (!ctx) return;

        // C Major 7 (C5, E5, G5, B5)
        playTone(523.25, "sine", 0.5, 0, 0.1);    // C5
        playTone(659.25, "sine", 0.5, 0.05, 0.1); // E5
        playTone(783.99, "sine", 0.5, 0.1, 0.1);  // G5
        playTone(987.77, "sine", 0.8, 0.15, 0.08); // B5
    }, []);

    const playBoot = useCallback(() => {
        // System Boot (Deep Swell + High Pung)
        const ctx = getContext();
        if (!ctx) return;

        // 1. Deep Swell (Low frequency ramp up)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(50, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.0);

        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.5);
        gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 1.5);

        // 2. High Pung (Digital Chime)
        playTone(1200, "sine", 0.8, 0.8, 0.05);
        playTone(2400, "triangle", 0.3, 0.8, 0.02);
    }, []);

    const playSubBassSweep = useCallback(() => {
        // Haptic UI Confirm (Apple-like 80Hz -> 40Hz drop)
        const ctx = getContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    }, []);

    return { playHover, playClick, playError, playSuccess, playBoot, playSubBassSweep };
}
