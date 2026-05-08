# FacelessReels Clone

Clone open-source de FacelessReels.com — génère des vidéos faceless automatiquement.

## Stack

| Composant | Outil | Coût |
|-----------|-------|------|
| Interface | Streamlit | Gratuit |
| Script | Ollama (llama3.2) + template fallback | Gratuit |
| Voix | edge-tts (Microsoft Edge TTS) | Gratuit |
| Footage | Upload local ou Pexels API | Gratuit |
| Montage | MoviePy + FFmpeg | Gratuit |
| Sous-titres | SRT brûlé via FFmpeg | Gratuit |

## Installation

### Prérequis système
- Python 3.10+
- FFmpeg avec libass : `sudo apt install ffmpeg`
- (Optionnel) Ollama : https://ollama.com → `ollama pull llama3.2`

### Installation Python

```bash
pip install -r requirements.txt
```

### Lancer l'app

```bash
streamlit run app.py
```

## Utilisation

1. **Sujet** : entrez le thème de votre vidéo
2. **Script** : générez ou écrivez manuellement le script
3. **Footage** : uploadez vos vidéos MP4 ou connectez Pexels (clé gratuite)
4. **Générer** : cliquez sur "Générer la vidéo" et attendez quelques minutes
5. **Télécharger** : récupérez votre MP4 final avec sous-titres

## Formats supportés

- **Court (9:16)** : TikTok, Reels Instagram, YouTube Shorts — 20s à 3min
- **Long (16:9)** : YouTube — jusqu'à 15min

## Clé Pexels (gratuite)

1. Créer un compte sur https://www.pexels.com/api/
2. Obtenir une clé API gratuite (20 000 requêtes/mois)
3. Entrer la clé dans la barre latérale de l'app
