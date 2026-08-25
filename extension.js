const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('cancaoLouvor.start', function () {
        const panel = vscode.window.createWebviewPanel(
            'cancaoLouvorPlayer',
            '🎵 Canção e Louvor DevPlayer',
            vscode.ViewColumn.Two,
            { enableScripts: true }
        );

        panel.webview.html = getWebviewContent();

        // Tratamento de mensagens enviadas pela interface (Webview)
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'buscarMusica':
                        const query = encodeURIComponent(message.text);
                        // Abre a busca direto no navegador do desenvolvedor
                        vscode.env.openExternal(vscode.Uri.parse(`https://youtube.com{query}`));
                        vscode.window.showInformationMessage(`Buscando por: Canção e Louvor - ${message.text}`);
                        return;
                    case 'playMusic':
                        vscode.env.openExternal(vscode.Uri.parse(message.url));
                        vscode.window.showInformationMessage(`Tocando agora: ${message.title}`);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Canção e Louvor Player</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1e1e24 0%, #111115 100%);
                color: #e0e0e0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .container {
                width: 100%;
                max-width: 400px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 0, 128, 0.3);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 8px 32px 0 rgba(255, 0, 128, 0.1);
                backdrop-filter: blur(4px);
            }
            h2 {
                color: #ff007f;
                text-align: center;
                margin-top: 0;
                text-shadow: 0 0 10px rgba(255, 0, 128, 0.5);
                font-size: 1.5rem;
            }
            p.subtitle {
                text-align: center;
                color: #00ffff;
                font-size: 0.85rem;
                margin-top: -10px;
                margin-bottom: 25px;
                text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
            }
            .search-box {
                display: flex;
                gap: 8px;
                margin-bottom: 25px;
            }
            input[type="text"] {
                flex: 1;
                background: #252526;
                border: 1px solid #ff007f;
                border-radius: 6px;
                padding: 10px;
                color: #fff;
                outline: none;
            }
            input[type="text"]:focus {
                border-color: #00ffff;
                box-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
            }
            button {
                background: #ff007f;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 10px 15px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            button:hover {
                background: #00ffff;
                color: #000;
                box-shadow: 0 0 12px #00ffff;
            }
            .playlist {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .track {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.05);
                padding: 12px;
                border-radius: 8px;
                transition: transform 0.2s;
                border-left: 4px solid #ff007f;
            }
            .track:hover {
                transform: translateX(5px);
                background: rgba(255, 255, 255, 0.08);
            }
            .track-info-title {
                font-weight: 600;
                font-size: 0.95rem;
            }
            .track-info-artist {
                font-size: 0.75rem;
                color: #888;
            }
            .btn-play {
                background: transparent;
                border: 1px solid #00ffff;
                color: #00ffff;
                padding: 5px 10px;
                font-size: 0.8rem;
            }
            .btn-play:hover {
                background: #00ffff;
                color: #000;
            }
            .footer-links {
                margin-top: 25px;
                display: flex;
                justify-content: space-around;
                width: 100%;
                font-size: 0.8rem;
            }
            .footer-links a {
                color: #888;
                text-decoration: none;
                transition: color 0.2s;
            }
            .footer-links a:hover {
                color: #ff007f;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Canção & Louvor</h2>
            <p class="subtitle">Devotional Soundtrack Mode</p>
            
            <div class="search-box">
                <input type="text" id="musicInput" placeholder="Buscar mais hinos da dupla...">
                <button onclick="buscar()">Buscar</button>
            </div>

            <div class="playlist">
                <div class="track">
                    <div>
                        <div class="track-info-title">Calmaria</div>
                        <div class="track-info-artist">Canção e Louvor</div>
                    </div>
                    <button class="btn-play" onclick="play('Calmaria', 'https://youtube.com')">Ouvir</button>
                </div>
                <div class="track">
                    <div>
                        <div class="track-info-title">O Rei Está Voltando</div>
                        <div class="track-info-artist">Canção e Louvor</div>
                    </div>
                    <button class="btn-play" onclick="play('O Rei Está Voltando', 'https://youtube.com')">Ouvir</button>
                </div>
                <div class="track">
                    <div>
                        <div class="track-info-title">As Três Horas</div>
                        <div class="track-info-artist">Canção e Louvor</div>
                    </div>
                    <button class="btn-play" onclick="play('As Três Horas', 'https://youtube.com')">Ouvir</button>
                </div>
            </div>

            <div class="footer-links">
                <a href="#" onclick="buscarPlataforma('spotify')">🎵 Spotify</a>
                <a href="#" onclick="buscarPlataforma('deezer')">🎧 Deezer</a>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();

            function buscar() {
                const text = document.getElementById('musicInput').value;
                if(text) {
                    vscode.postMessage({ command: 'buscarMusica', text: text });
                }
            }

            function play(title, url) {
                vscode.postMessage({ command: 'playMusic', title: title, url: url });
            }

            function buscarPlataforma(plataforma) {
                let url = plataforma === 'spotify' 
                    ? 'https://spotify.com' 
                    : 'https://deezer.com';
                vscode.postMessage({ command: 'playMusic', title: plataforma, url: url });