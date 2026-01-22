<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animated GitHub Profile</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            color: #fff;
            font-family: 'Courier New', monospace;
            overflow-x: hidden;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
        }

        /* Animated Pac-Man Game */
        .game-container {
            height: 120px;
            background: #000;
            border: 3px solid #00ffff;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            margin: 30px 0;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .pacman {
            width: 40px;
            height: 40px;
            background: #ffff00;
            border-radius: 50%;
            position: absolute;
            top: 40px;
            left: -50px;
            animation: movePacman 8s linear infinite;
            clip-path: polygon(100% 50%, 50% 0, 0 0, 0 100%, 50% 100%);
        }

        .pacman::before {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            background: #000;
            border-radius: 50%;
            top: 8px;
            right: 15px;
        }

        @keyframes movePacman {
            0% { left: -50px; }
            100% { left: 100%; }
        }

        .ghost {
            width: 35px;
            height: 35px;
            position: absolute;
            top: 42px;
            animation: moveGhost 8s linear infinite;
        }

        .ghost1 { left: 20%; animation-delay: 0s; }
        .ghost2 { left: 40%; animation-delay: 0.5s; }
        .ghost3 { left: 60%; animation-delay: 1s; }
        .ghost4 { left: 80%; animation-delay: 1.5s; }

        @keyframes moveGhost {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .ghost-body {
            width: 100%;
            height: 70%;
            background: var(--ghost-color);
            border-radius: 50% 50% 0 0;
            position: relative;
        }

        .ghost-eyes {
            position: absolute;
            top: 10px;
            left: 8px;
        }

        .ghost-eye {
            width: 8px;
            height: 8px;
            background: #fff;
            border-radius: 50%;
            display: inline-block;
            margin: 0 2px;
            position: relative;
        }

        .ghost-eye::after {
            content: '';
            width: 4px;
            height: 4px;
            background: #000;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
        }

        .ghost-tail {
            width: 100%;
            height: 30%;
            position: absolute;
            bottom: 0;
            display: flex;
        }

        .ghost-tail span {
            flex: 1;
            background: var(--ghost-color);
            border-radius: 0 0 50% 50%;
        }

        .dots {
            position: absolute;
            top: 56px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            padding: 0 20px;
        }

        .dot {
            width: 8px;
            height: 8px;
            background: #ffb8ae;
            border-radius: 50%;
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        /* Header */
        header {
            text-align: center;
            padding: 40px 0;
        }

        h1 {
            font-size: 3em;
            background: linear-gradient(45deg, #00ffff, #ffff00, #ff00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.5); }
        }

        .subtitle {
            font-size: 1.2em;
            color: #00ffff;
            margin-top: 10px;
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        /* Stats Section */
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }

        .stat-card {
            background: rgba(26, 26, 46, 0.8);
            border: 2px solid #00ffff;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
            animation: fadeIn 1s ease-in;
        }

        .stat-card:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 10px 30px rgba(0, 255, 255, 0.5);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .stat-number {
            font-size: 3em;
            color: #ffff00;
            font-weight: bold;
            text-shadow: 0 0 10px #ffff00;
        }

        .stat-label {
            font-size: 1em;
            color: #00ffff;
            margin-top: 10px;
        }

        /* Progress Bar */
        .progress-section {
            margin: 40px 0;
        }

        .progress-item {
            margin: 20px 0;
        }

        .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            color: #00ffff;
        }

        .progress-bar {
            width: 100%;
            height: 30px;
            background: rgba(26, 26, 46, 0.8);
            border: 2px solid #00ffff;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00ffff, #ffff00, #ff00ff);
            border-radius: 13px;
            animation: progressFlow 2s ease-in-out;
            position: relative;
            overflow: hidden;
        }

        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: shine 2s infinite;
        }

        @keyframes progressFlow {
            from { width: 0; }
        }

        @keyframes shine {
            to { left: 200%; }
        }

        /* Footer */
        footer {
            text-align: center;
            margin-top: 60px;
            padding: 20px;
            color: #00ffff;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
        }

        .social-btn {
            padding: 10px 20px;
            background: rgba(0, 255, 255, 0.2);
            border: 2px solid #00ffff;
            border-radius: 10px;
            color: #00ffff;
            text-decoration: none;
            transition: all 0.3s;
        }

        .social-btn:hover {
            background: #00ffff;
            color: #000;
            transform: scale(1.1);
            box-shadow: 0 0 20px #00ffff;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎮 Irfanafifiromzi 🎮</h1>
            <p class="subtitle">Level 99 Code Warrior | Bug Hunter | High Score Chaser</p>
        </header>

        <div class="game-container">
            <div class="pacman"></div>
            
            <div class="ghost ghost1" style="--ghost-color: #ff0000;">
                <div class="ghost-body">
                    <div class="ghost-eyes">
                        <span class="ghost-eye"></span>
                        <span class="ghost-eye"></span>
                    </div>
                </div>
                <div class="ghost-tail">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <div class="ghost ghost2" style="--ghost-color: #00ffff;">
                <div class="ghost-body">
                    <div class="ghost-eyes">
                        <span class="ghost-eye"></span>
                        <span class="ghost-eye"></span>
                    </div>
                </div>
                <div class="ghost-tail">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <div class="ghost ghost3" style="--ghost-color: #ffb8ae;">
                <div class="ghost-body">
                    <div class="ghost-eyes">
                        <span class="ghost-eye"></span>
                        <span class="ghost-eye"></span>
                    </div>
                </div>
                <div class="ghost-tail">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <div class="ghost ghost4" style="--ghost-color: #ffb852;">
                <div class="ghost-body">
                    <div class="ghost-eyes">
                        <span class="ghost-eye"></span>
                        <span class="ghost-eye"></span>
                    </div>
                </div>
                <div class="ghost-tail">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <div class="dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">500+</div>
                <div class="stat-label">⭐ Commits</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">25</div>
                <div class="stat-label">🚀 Projects</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">1000+</div>
                <div class="stat-label">☕ Coffees</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">∞</div>
                <div class="stat-label">🐛 Bugs Fixed</div>
            </div>
        </div>

        <div class="progress-section">
            <h2 style="color: #00ffff; text-align: center; margin-bottom: 30px;">⚡ SKILL LEVELS ⚡</h2>
            
            <div class="progress-item">
                <div class="progress-label">
                    <span>JavaScript / TypeScript</span>
                    <span>90%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 90%;"></div>
                </div>
            </div>

            <div class="progress-item">
                <div class="progress-label">
                    <span>React / Next.js</span>
                    <span>85%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 85%;"></div>
                </div>
            </div>

            <div class="progress-item">
                <div class="progress-label">
                    <span>Python</span>
                    <span>80%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 80%;"></div>
                </div>
            </div>

            <div class="progress-item">
                <div class="progress-label">
                    <span>Problem Solving</span>
                    <span>95%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 95%;"></div>
                </div>
            </div>
        </div>

        <footer>
            <h3 style="margin-bottom: 20px;">🎯 GAME OVER? PRESS START! 🎯</h3>
            <div class="social-links">
                <a href="#" class="social-btn">GitHub</a>
                <a href="#" class="social-btn">LinkedIn</a>
                <a href="#" class="social-btn">Twitter</a>
                <a href="#" class="social-btn">Portfolio</a>
            </div>
            <p style="margin-top: 30px; color: #666;">⚡ Powered by code, coffee, and retro gaming ⚡</p>
        </footer>
    </div>
</body>
</html>
