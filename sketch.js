// Sketch p5.js - Animação interativa da Princesinha Sofia

let container;
let canvasWidth = 500;
let canvasHeight = 500;
let particles = [];
let sofia = {};
let amulet = {};

function setup() {
    container = document.getElementById('p5-container');
    if (container) {
        canvasWidth = Math.min(container.offsetWidth - 40, 600);
        canvasHeight = 500;
        
        let canvas = createCanvas(canvasWidth, canvasHeight);
        canvas.parent('p5-container');
    }

    // Inicializar a Sofia (centro)
    sofia = {
        x: width / 2,
        y: height / 2,
        size: 60,
        color: [255, 182, 193], // rosa claro
        angle: 0
    };

    // Inicializar o amuleto
    amulet = {
        x: sofia.x,
        y: sofia.y - 40,
        size: 25,
        rotation: 0,
        glow: 0
    };

    // Criar partículas mágicas
    for (let i = 0; i < 30; i++) {
        particles.push(new MagicalParticle(sofia.x, sofia.y));
    }
}

function draw() {
    // Fundo com degradado
    background(245, 247, 250);
    
    // Desenhar céu estrelado
    drawStarfield();

    // Atualizar e desenhar partículas
    for (let p of particles) {
        p.update(sofia.x, sofia.y);
        p.display();
    }

    // Animar Sofia
    sofia.angle += 0.02;
    sofia.x = width / 2 + sin(sofia.angle) * 15;
    sofia.y = height / 2 + cos(sofia.angle) * 15;

    // Desenhar Sofia
    drawSofia(sofia.x, sofia.y);

    // Animar e desenhar amuleto
    amulet.x = sofia.x;
    amulet.y = sofia.y - 50;
    amulet.rotation += 0.05;
    amulet.glow = sin(frameCount * 0.05) * 10 + 25;
    
    drawAmulet(amulet.x, amulet.y, amulet.rotation, amulet.glow);

    // Desenhar animais ao redor
    drawAnimalsAroundSofia(sofia.x, sofia.y);

    // Desenhar informações
    drawInfo();
}

function drawSofia(x, y) {
    push();
    translate(x, y);
    
    // Cabeça
    fill(255, 224, 189); // tom de pele
    circle(0, -20, 30);
    
    // Coroa
    fill(255, 215, 0); // dourado
    rect(-15, -35, 30, 8, 3);
    triangle(-12, -35, -8, -42, -4, -35);
    triangle(-4, -35, 0, -45, 4, -35);
    triangle(4, -35, 8, -42, 12, -35);
    
    // Olhos
    fill(30, 144, 255); // azul
    circle(-8, -22, 4);
    circle(8, -22, 4);
    
    // Boca
    stroke(200, 100, 150);
    strokeWeight(2);
    noFill();
    arc(0, -16, 8, 6, 0, PI);
    noStroke();
    
    // Corpo (vestido)
    fill(255, 105, 180); // rosa quente
    bezier(-15, -8, -20, 10, -18, 25, -10, 28);
    bezier(15, -8, 20, 10, 18, 25, 10, 28);
    rect(-15, -8, 30, 20, 5);
    
    // Braços
    fill(255, 224, 189);
    rect(-25, -5, 10, 18, 5);
    rect(15, -5, 10, 18, 5);
    
    pop();
}

function drawAmulet(x, y, rotation, glow) {
    push();
    translate(x, y);
    rotate(rotation);
    
    // Brilho mágico
    for (let i = 3; i > 0; i--) {
        fill(102, 126, 234, 30 / i);
        circle(0, 0, (amulet.size + glow) * i);
    }
    
    // Amuleto principal (forma de estrela/jóia)
    fill(255, 215, 0);
    stroke(218, 165, 32);
    strokeWeight(2);
    star(0, 0, amulet.size / 2, amulet.size, 5);
    
    // Centro brilhante
    fill(255, 255, 200);
    circle(0, 0, amulet.size / 3);
    
    pop();
}

function drawAnimalsAroundSofia(cx, cy) {
    let animals = [
        { angle: 0, emoji: '🦉' },
        { angle: PI / 2, emoji: '🦋' },
        { angle: PI, emoji: '🐰' },
        { angle: 3 * PI / 2, emoji: '🦊' }
    ];
    
    for (let animal of animals) {
        let x = cx + cos(animal.angle + frameCount * 0.02) * 120;
        let y = cy + sin(animal.angle + frameCount * 0.02) * 120;
        
        push();
        fill(255);
        stroke(102, 126, 234);
        strokeWeight(2);
        circle(x, y, 25);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(15);
        text(animal.emoji, x, y);
        pop();
    }
}

function drawStarfield() {
    randomSeed(42); // para ter um padrão consistente
    fill(255, 255, 150, 180);
    noStroke();
    
    for (let i = 0; i < 20; i++) {
        let x = random(width);
        let y = random(height * 0.3);
        let size = random(2, 5);
        circle(x, y, size);
    }
}

function drawInfo() {
    fill(102, 126, 234);
    textAlign(CENTER, TOP);
    textSize(14);
    text('Clique para atualizar • Sofia e seu Amuleto de Avalor', width / 2, height - 20);
}

function mousePressed() {
    // Efeito ao clicar
    for (let i = 0; i < 15; i++) {
        particles.push(new MagicalParticle(mouseX, mouseY));
    }
}

// Classe de partículas mágicas
class MagicalParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-3, 3);
        this.vy = random(-3, 3);
        this.life = 255;
        this.decay = random(2, 5);
        this.size = random(3, 8);
        this.color = [
            random([102, 126, 234]),
            random([118, 75, 162]),
            random([255, 215, 0])
        ];
    }
    
    update(sofiaX, sofiaY) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vy += 0.1; // gravidade
        
        // Atrair para Sofia
        let dx = sofiaX - this.x;
        let dy = sofiaY - this.y;
        let distance = sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            this.vx += dx * 0.001;
            this.vy += dy * 0.001;
        }
    }
    
    display() {
        if (this.life <= 0) return;
        
        push();
        fill(this.color[0], this.color[1], this.color[2], this.life);
        noStroke();
        circle(this.x, this.y, this.size);
        pop();
    }
}

// Função para desenhar estrela
function star(x, y, innerRadius, outerRadius, points) {
    let angle = TWO_PI / points;
    beginShape();
    for (let i = 0; i < TWO_PI; i += angle) {
        let sx = x + cos(i) * outerRadius;
        let sy = y + sin(i) * outerRadius;
        vertex(sx, sy);
        
        sx = x + cos(i + angle / 2) * innerRadius;
        sy = y + sin(i + angle / 2) * innerRadius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

// Responsividade
function windowResized() {
    if (container && container.offsetWidth) {
        canvasWidth = Math.min(container.offsetWidth - 40, 600);
        resizeCanvas(canvasWidth, canvasHeight);
    }
}