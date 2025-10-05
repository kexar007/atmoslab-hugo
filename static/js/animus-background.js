// static/js/animus-background.js

const canvas = document.getElementById("animus");
const ctx = canvas.getContext("2d");

// --- Configuration ---
const MAX_DIST = 150;
const DENSITY_DIVISOR = 20; 
const MARGIN_PERCENT = 0.20; 

let points = [];
let numPoints;

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    numPoints = Math.floor((canvas.width + canvas.height) / DENSITY_DIVISOR);
    points = [];
    const marginX = canvas.width * MARGIN_PERCENT;
    const marginY = canvas.height * MARGIN_PERCENT;
    const deadZone = {
        left: marginX,
        right: canvas.width - marginX,
        top: marginY,
        bottom: canvas.height - marginY
    };
    for (let i = 0; i < numPoints; i++) {
        let x, y;
        const region = Math.floor(Math.random() * 4);
        if (region === 0) { x = Math.random() * canvas.width; y = Math.random() * deadZone.top; } 
        else if (region === 1) { x = Math.random() * canvas.width; y = canvas.height - (Math.random() * deadZone.top); }
        else if (region === 2) { x = Math.random() * deadZone.left; y = Math.random() * canvas.height; }
        else { x = canvas.width - (Math.random() * deadZone.left); y = Math.random() * canvas.height; }
        points.push({ x: x, y: y, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numPoints; i++) {
        for (let j = i + 1; j < numPoints; j++) {
            let dx = points[i].x - points[j].x;
            let dy = points[i].y - points[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
                ctx.strokeStyle = "rgba(103, 170, 230, " + (1 - dist / MAX_DIST) + ")";
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        }
    }
    ctx.fillStyle = "rgba(103, 170, 193, 0.76)";
    const marginX = canvas.width * MARGIN_PERCENT;
    const marginY = canvas.height * MARGIN_PERCENT;
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        if (p.x > marginX && p.x < marginX + 1 && p.y > marginY && p.y < canvas.height - marginY) p.vx *= -1;
        if (p.x < canvas.width - marginX && p.x > canvas.width - marginX -1 && p.y > marginY && p.y < canvas.height - marginY) p.vx *= -1;
        if (p.y > marginY && p.y < marginY + 1 && p.x > marginX && p.x < canvas.width - marginX) p.vy *= -1;
        if (p.y < canvas.height - marginY && p.y > canvas.height - marginY -1 && p.x > marginX && p.x < canvas.width - marginX) p.vy *= -1;
    }
    requestAnimationFrame(animate);
}

window.addEventListener("resize", init);
init();
animate();
