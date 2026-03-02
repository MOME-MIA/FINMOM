"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CosmicSimulation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth mouse for gravity well
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let nebulas: Nebula[] = [];

        // Deep Spectrum Colors
        const colors = ["#8B5CF6", "#A3E635", "#F59E0B"]; // Violet, Lime, Amber

        class Nebula {
            x: number;
            y: number;
            radius: number;
            color: string;
            vx: number;
            vy: number;

            constructor(width: number, height: number) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 300 + 200; // Large clouds
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.vx = (Math.random() - 0.5) * 0.2; // Slow drift
                this.vy = (Math.random() - 0.5) * 0.2;
            }

            update(width: number, height: number) {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around
                if (this.x > width + this.radius) this.x = -this.radius;
                if (this.x < -this.radius) this.x = width + this.radius;
                if (this.y > height + this.radius) this.y = -this.radius;
                if (this.y < -this.radius) this.y = height + this.radius;
            }

            draw(ctx: CanvasRenderingContext2D) {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                gradient.addColorStop(0, this.color + "15"); // Very low opacity (Hex + Alpha)
                gradient.addColorStop(1, "transparent");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class Particle {
            x: number;
            y: number;
            size: number;
            color: string;
            speedX: number;
            speedY: number;
            baseX: number;
            baseY: number;

            constructor(width: number, height: number) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 2 + 0.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.speedY = (Math.random() - 0.5) * 0.2;
            }

            update(width: number, height: number, mx: number, my: number) {
                this.x += this.speedX;
                this.y += this.speedY;

                // Gravitational Lensing
                const dx = mx - this.x;
                const dy = my - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 300;

                if (distance < maxDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * 2;
                    const directionY = forceDirectionY * force * 2;

                    this.x += directionX;
                    this.y += directionY;
                }

                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.6;
                ctx.fill();
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
            }
        }

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            nebulas = [];

            // Create Nebula Clouds
            for (let i = 0; i < 5; i++) {
                nebulas.push(new Nebula(canvas.width, canvas.height));
            }

            // Create Stars
            for (let i = 0; i < 60; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Void Asphalt Background
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width
            );
            gradient.addColorStop(0, "#0a0a12");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Nebulas First (Background Layer)
            nebulas.forEach(nebula => {
                nebula.update(canvas.width, canvas.height);
                nebula.draw(ctx);
            });

            const mx = smoothX.get();
            const my = smoothY.get();

            // Draw Stars (Foreground Layer)
            particles.forEach(particle => {
                particle.update(canvas.width, canvas.height, mx, my);
                particle.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => init();
        window.addEventListener("resize", handleResize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [smoothX, smoothY, mouseX, mouseY]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ willChange: "transform" }}
        />
    );
}
