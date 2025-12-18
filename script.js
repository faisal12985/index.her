
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const overlay = document.getElementById('overlay');
    const music = document.getElementById('bg-music');
    
    let width, height;
    let flowers = [];
    let musicStarted = false;

    // Resize canvas to full screen
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Tulip Class
    class Tulip {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // Randomize tulip properties
            this.height = Math.random() * 150 + 200; // Stem height between 200-350
            this.growth = 0; // Current growth state
            this.speed = Math.random() * 2 + 1;
            this.color = this.getRandomColor();
            this.angle = (Math.random() - 0.5) * 0.2; // Slight random tilt
            this.maxBloomSize = Math.random() * 10 + 20; // Size of flower head
            this.bloomSize = 0;
            this.leafSide = Math.random() < 0.5 ? -1 : 1; // Left or right leaf
        }

        getRandomColor() {
            const hue = Math.floor(Math.random() * 360);
            // Tulips are often Red, Pink, Yellow, Purple (warm colors mostly)
            // But let's allow a full spectrum for that "neon" look
            return `hsl(${hue}, 80%, 60%)`;
        }

        grow() {
            if (this.growth < this.height) {
                this.growth += this.speed;
            } else if (this.bloomSize < this.maxBloomSize) {
                this.bloomSize += 0.5; // Bloom slowly after stem finishes
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            // 1. Draw Stem
            ctx.beginPath();
            // Create a slight curve for natural look
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(10, -this.growth / 2, 0, -this.growth);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#2d6a4f'; // Dark green stem
            ctx.stroke();

            // 2. Draw Leaf (only if stem has grown enough)
            if (this.growth > 100) {
                ctx.beginPath();
                ctx.moveTo(0, -50);
                // Draw a long thin leaf
                ctx.quadraticCurveTo(30 * this.leafSide, -100, 40 * this.leafSide, -150);
                ctx.quadraticCurveTo(10 * this.leafSide, -100, 0, -80);
                ctx.fillStyle = '#40916c';
                ctx.fill();
            }

            // 3. Draw Tulip Head (Cup Shape)
            if (this.bloomSize > 0) {
                ctx.translate(0, -this.growth);
                ctx.beginPath();
                
                // Tulip Cup Logic
                const s = this.bloomSize; 
                // Bottom of cup
                ctx.moveTo(0, 0);
                // Left side
                ctx.bezierCurveTo(-s, 0, -s, -s * 1.5, -s * 0.8, -s * 2); 
                // Top jagged edges (Petals)
                ctx.lineTo(-s * 0.4, -s * 1.5);
                ctx.lineTo(0, -s * 2.2);
                ctx.lineTo(s * 0.4, -s * 1.5);
                ctx.lineTo(s * 0.8, -s * 2);
                // Right side
                ctx.bezierCurveTo(s, -s * 1.5, s, 0, 0, 0);

                // Styling for glowing effect
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 20;
                ctx.shadowColor = this.color;
                ctx.fill();
            }

            ctx.restore();
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height); // Clear screen
        
        // Draw all flowers
        flowers.forEach(flower => {
            flower.grow();
            flower.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();

    // Interaction
    window.addEventListener('click', (e) => {
        // Hide overlay text after first click
        overlay.style.opacity = '0';

        // Play music on first click
        if (!musicStarted) {
            music.play().catch(err => console.log("Audio playback failed:", err));
            musicStarted = true;
        }

        // Add a new tulip at the bottom of the screen, horizontally aligned with click
        // The y-position is fixed to the bottom (height) so they grow from ground
        const x = e.clientX;
        const y = height; 
        
        flowers.push(new Tulip(x, y));
    });

    // Support for touch devices
    window.addEventListener('touchstart', (e) => {
        if(e.touches.length > 0) {
            const touch = e.touches[0];
            const clickEvent = new MouseEvent('click', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            window.dispatchEvent(clickEvent);
        }
    });

