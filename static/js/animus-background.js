// static/js/animus-background.js

const canvas = document.getElementById("animus");
const ctx = canvas.getContext("2d");

// --- Configuration ---
const MAX_DIST = 155;
const MAX_DIST_SQ = MAX_DIST * MAX_DIST; // Optimization: pre-calculate squared distance
const DENSITY_DIVISOR = 40; // Increased slightly to reduce clutter on huge screens
const MARGIN_PERCENT = 0.20; 

let points = [];
let numPoints;
let width, height;
let deadZone = {};

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Calculate Dead Zone Dimensions
    const marginX = width * MARGIN_PERCENT;
    const marginY = height * MARGIN_PERCENT;
    deadZone = {
        left: marginX,
        right: width - marginX,
        top: marginY,
        bottom: height - marginY
    };

    // Calculate point count (capped to prevent lag on 4k screens)
    numPoints = Math.floor((width + height) / DENSITY_DIVISOR);
    if (numPoints > 200) numPoints = 200; 

    points = [];
    
    for (let i = 0; i < numPoints; i++) {
        let x, y;
        // Spawn particles in 4 safe quadrants to ensure they start outside the box
        const region = Math.floor(Math.random() * 4);
        
        // Top Strip
        if (region === 0) { 
            x = Math.random() * width; 
            y = Math.random() * deadZone.top; 
        } 
        // Bottom Strip
        else if (region === 1) { 
            x = Math.random() * width; 
            y = deadZone.bottom + (Math.random() * (height - deadZone.bottom)); 
        }
        // Left Strip
        else if (region === 2) { 
            x = Math.random() * deadZone.left; 
            y = Math.random() * height; 
        }
        // Right Strip
        else { 
            x = deadZone.right + (Math.random() * (width - deadZone.right)); 
            y = Math.random() * height; 
        }

        points.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw Lines
    // Optimization: Compare squared distance to avoid Math.sqrt()
    for (let i = 0; i < numPoints; i++) {
        for (let j = i + 1; j < numPoints; j++) {
            let dx = points[i].x - points[j].x;
            let dy = points[i].y - points[j].y;
            let distSq = dx * dx + dy * dy;
            
            if (distSq < MAX_DIST_SQ) {
                // Calculate alpha based on distance
                let alpha = 1 - (distSq / MAX_DIST_SQ); // Linear falloff approximation
                ctx.strokeStyle = "rgba(100, 170, 230, " + alpha + ")";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        }
    }

    ctx.fillStyle = "rgba(100, 153, 225, 0.58)";
    
    // Update and Draw Points
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // --- Collision Detection ---

        // 1. Canvas Boundary Bounce
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // 2. Dead Zone Bounce (The Fix)
        // Check if point is INSIDE the dead zone
        if (p.x > deadZone.left && p.x < deadZone.right && 
            p.y > deadZone.top && p.y < deadZone.bottom) {
            
            // Determine which side was hit based on previous position (velocity)
            // If moving Right and currently inside the box near the Left wall -> Bounce Left
            // We use the absolute distance to the closest wall to determine which way to flip.
            
            let distToLeft = Math.abs(p.x - deadZone.left);
            let distToRight = Math.abs(p.x - deadZone.right);
            let distToTop = Math.abs(p.y - deadZone.top);
            let distToBottom = Math.abs(p.y - deadZone.bottom);

            let min = Math.min(distToLeft, distToRight, distToTop, distToBottom);

            if (min === distToLeft) {
                p.x = deadZone.left; // Push out
                p.vx *= -1;
            } else if (min === distToRight) {
                p.x = deadZone.right; // Push out
                p.vx *= -1;
            } else if (min === distToTop) {
                p.y = deadZone.top; // Push out
                p.vy *= -1;
            } else if (min === distToBottom) {
                p.y = deadZone.bottom; // Push out
                p.vy *= -1;
            }
        }
    }
    requestAnimationFrame(animate);
}

// Optimization: Debounce resize to prevent thousands of init calls while dragging window
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(init, 100);
});

init();
animate();