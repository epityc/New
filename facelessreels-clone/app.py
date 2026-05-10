import pathlib
import tempfile

import streamlit as st

from modules.footage import ART_STYLES, fetch_pexels, save_uploads
from modules.niches import NICHES
from modules.script_gen import (
    generate_script_groq,
    generate_script_ollama,
    generate_script_openai,
    generate_script_template,
)
from modules.tts import EDGE_VOICES, get_elevenlabs_voices, generate_voice
from modules.video_builder import CAPTION_STYLES, assemble_video

st.set_page_config(page_title="FacelessReels", page_icon="🎬", layout="centered")

# ── Session state defaults ─────────────────────────────────────────────────────
DEFAULTS = {
    "step": 1,
    "niche": None,
    "custom_topic": "",
    "language": "en",
    "voice_engine": "edge",
    "elevenlabs_key": "",
    "elevenlabs_voice_id": "",
    "edge_voice": "en-US-AriaNeural",
    "groq_key": "",
    "openai_key": "",
    "script_engine": "Groq",
    "music_path": "",
    "art_style": "Cinematic",
    "pexels_key": "",
    "footage_source": "Pexels",
    "uploaded_footage": [],
    "caption_style": "Bold Stroke",
    "film_grain": False,
    "glitch": False,
    "script": "",
    "duration": 60,
    "format_type": "short",
    "words_per_sub": 5,
}
for k, v in DEFAULTS.items():
    if k not in st.session_state:
        st.session_state[k] = v

TOTAL_STEPS = 7
STEP_NAMES = ["Niche", "Voix", "Musique", "Style visuel", "Captions", "Effets", "Générer"]


def go_next():
    st.session_state["step"] = min(st.session_state["step"] + 1, TOTAL_STEPS)


def go_prev():
    st.session_state["step"] = max(st.session_state["step"] - 1, 1)


# ── Header ─────────────────────────────────────────────────────────────────────
st.markdown("## 🎬 FacelessReels")
st.caption("Crée des vidéos faceless automatiquement")

# Progress bar
step = st.session_state["step"]
st.progress(step / TOTAL_STEPS, text=f"Étape {step} sur {TOTAL_STEPS} — {STEP_NAMES[step - 1]}")
st.divider()


# ══════════════════════════════════════════════════════════════════════════════
# STEP 1 — Niche
# ══════════════════════════════════════════════════════════════════════════════
if step == 1:
    st.subheader("Choisis ta niche")
    st.caption("Sélectionne un preset ou décris ta propre niche")

    cols = st.columns(2)
    for i, (name, data) in enumerate(NICHES.items()):
        with cols[i % 2]:
            selected = st.session_state["niche"] == name
            border = "2px solid #7c3aed" if selected else "1px solid #e5e7eb"
            if st.button(
                f"{data['icon']} **{name}**\n\n_{data['description']}_",
                key=f"niche_{name}",
                use_container_width=True,
            ):
                st.session_state["niche"] = name

    if st.session_state["niche"] == "Custom":
        st.session_state["custom_topic"] = st.text_input(
            "Décris ta niche / ton sujet",
            value=st.session_state["custom_topic"],
            placeholder="Ex: Les secrets des milliardaires, Mythologie nordique...",
        )

    st.divider()
    fmt = st.selectbox("Format vidéo", ["Court 9:16 — Reels / TikTok / Shorts", "Long 16:9 — YouTube"])
    st.session_state["format_type"] = "short" if fmt.startswith("Court") else "long"
    st.session_state["duration"] = st.slider(
        "Durée cible (secondes)", 20, 600,
        60 if st.session_state["format_type"] == "short" else 300, step=10,
    )

    ready = st.session_state["niche"] is not None and (
        st.session_state["niche"] != "Custom" or st.session_state["custom_topic"].strip()
    )
    st.button("Continuer →", on_click=go_next, disabled=not ready, type="primary", use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# STEP 2 — Voice
# ══════════════════════════════════════════════════════════════════════════════
elif step == 2:
    st.subheader("Langue & Voix")

    lang = st.selectbox("Langue", ["Français", "English"])
    st.session_state["language"] = "fr" if lang == "Français" else "en"

    st.markdown("**Moteur de voix**")
    engine = st.radio("", ["ElevenLabs (haute qualité)", "edge-tts (gratuit)"], horizontal=True)
    st.session_state["voice_engine"] = "elevenlabs" if engine.startswith("Eleven") else "edge"

    if st.session_state["voice_engine"] == "elevenlabs":
        key = st.text_input("Clé API ElevenLabs", type="password",
                            value=st.session_state["elevenlabs_key"],
                            placeholder="elevenlabs.io → Profile → API Key (gratuit jusqu'à 10k chars/mois)")
        st.session_state["elevenlabs_key"] = key
        if key:
            voices = get_elevenlabs_voices(key)
            if voices:
                voice_name = st.selectbox("Voix", list(voices.keys()))
                st.session_state["elevenlabs_voice_id"] = voices[voice_name]
            else:
                st.warning("Clé invalide ou erreur de connexion.")
    else:
        voice_opts = EDGE_VOICES[st.session_state["language"]]
        voice_label = st.selectbox("Voix", list(voice_opts.keys()))
        st.session_state["edge_voice"] = voice_opts[voice_label]

    st.divider()
    st.markdown("**Moteur de script IA**")
    engine_opts = ["Groq (gratuit, recommandé)", "OpenAI GPT-4o-mini", "Template (sans clé)", "Ollama (local)"]
    sel = st.radio("", engine_opts, horizontal=False)
    st.session_state["script_engine"] = sel.split(" ")[0]

    if st.session_state["script_engine"] == "Groq":
        st.session_state["groq_key"] = st.text_input(
            "Clé Groq", type="password", value=st.session_state["groq_key"],
            placeholder="console.groq.com → Free API Key")
        st.caption("Gratuit · 14 400 req/jour · Inscription en 1 min")
    elif st.session_state["script_engine"] == "OpenAI":
        st.session_state["openai_key"] = st.text_input(
            "Clé OpenAI", type="password", value=st.session_state["openai_key"],
            placeholder="platform.openai.com/api-keys")

    col1, col2 = st.columns(2)
    col1.button("← Retour", on_click=go_prev, use_container_width=True)
    col2.button("Continuer →", on_click=go_next, type="primary", use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# STEP 3 — Music
# ══════════════════════════════════════════════════════════════════════════════
elif step == 3:
    st.subheader("Musique de fond")
    st.caption("Optionnel — ajoute une musique de fond à ta vidéo")

    music_option = st.radio("", ["Sans musique", "Uploader ma propre musique (MP3)"], horizontal=True)

    if music_option == "Uploader ma propre musique (MP3)":
        music_file = st.file_uploader("Importer un fichier MP3 / WAV", type=["mp3", "wav", "m4a"])
        if music_file:
            tmp = pathlib.Path(tempfile.gettempdir()) / f"music_{music_file.name}"
            tmp.write_bytes(music_file.read())
            st.session_state["music_path"] = str(tmp)
            st.success(f"Musique chargée : {music_file.name}")
        st.caption("La musique sera mixée à 20% du volume pour ne pas couvrir la voix.")
    else:
        st.session_state["music_path"] = ""

    col1, col2 = st.columns(2)
    col1.button("← Retour", on_click=go_prev, use_container_width=True)
    col2.button("Continuer →", on_click=go_next, type="primary", use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# STEP 4 — Art Style / Footage
# ══════════════════════════════════════════════════════════════════════════════
elif step == 4:
    st.subheader("Style visuel")
    st.caption("Choisis le style des vidéos de fond")

    cols = st.columns(4)
    for i, (name, data) in enumerate(ART_STYLES.items()):
        with cols[i % 4]:
            selected = st.session_state["art_style"] == name
            label = f"{data['icon']} **{name}**" if selected else f"{data['icon']} {name}"
            if st.button(label, key=f"style_{name}", use_container_width=True):
                st.session_state["art_style"] = name
            if selected:
                st.caption(f"✓ {data['description']}")

    st.divider()
    st.markdown("**Source du footage**")
    src = st.radio("", ["Pexels API (automatique)", "Upload local (MP4)"], horizontal=True)
    st.session_state["footage_source"] = src

    if src == "Pexels API (automatique)":
        st.session_state["pexels_key"] = st.text_input(
            "Clé API Pexels", type="password",
            value=st.session_state["pexels_key"],
            placeholder="pexels.com/api → Gratuit")
        if not st.session_state["pexels_key"]:
            st.warning("Une clé Pexels est requise pour le footage automatique.")
    else:
        uploaded = st.file_uploader("Importer des vidéos MP4", type=["mp4", "mov"], accept_multiple_files=True)
        if uploaded:
            st.session_state["uploaded_footage"] = uploaded
            st.success(f"{len(uploaded)} fichier(s) chargé(s)")

    footage_ready = (
        (st.session_state["footage_source"] == "Pexels API (automatique)" and st.session_state["pexels_key"])
        or (st.session_state["footage_source"] == "Upload local (MP4)" and st.session_state["uploaded_footage"])
    )

    col1, col2 = st.columns(2)
    col1.button("← Retour", on_click=go_prev, use_container_width=True)
    col2.button("Continuer →", on_click=go_next, disabled=not footage_ready, type="primary", use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# STEP 5 — Caption Style
# ══════════════════════════════════════════════════════════════════════════════
elif step == 5:
    st.subheader("Style des sous-titres")

    CAPTION_PREVIEWS = {
        "Bold Stroke": "Blanc · Contour noir épais",
        "Red Highlight": "Rouge · Accrocheur",
        "Sleek": "Blanc · Minimaliste",
        "Majestic": "Or · Épique",
        "Beast": "Jaune · Style MrBeast",
        "Elegant": "Blanc · Italique fin",
        "Pixel": "Vert · Style gaming",
        "Clarity": "Blanc · Ombre douce",
    }

    cols = st.columns(3)
    for i, (name, desc) in enumerate(CAPTION_PREVIEWS.items()):
        with cols[i % 3]:
            selected = st.session_state["caption_style"] == name
            label = f"✓ **{name}**" if selected else name
            if st.button(f"{label}\n\n_{desc}_", key=f"cap_{name}", use_container_width=True):
                st.session_state["caption_style"] = name

    st.divider()
    st.session_state["words_per_sub"] = st.slider("Mots par sous-titre", 3, 10, st.session_state["words_per_sub"])

    col1, col2 = st.columns(2)
    col1.button("← Retour", on_click=go_prev, use_container_width=True)
    col2.button("Continuer →", on_click=go_next, type="primary", use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# STEP 6 — Effects
# ══════════════════════════════════════════════════════════════════════════════
elif step == 6:
    st.subheader("Effets visuels")
    st.caption("Optionnel — ajoute des effets pour rendre ta vidéo plus immersive")

    st.session_state["film_grain"] = st.toggle(
        "🎞️ Film grain",
        value=st.session_state["film_grain"],
        help="Ajoute un aspect grain de film ancien, parfait pour le contenu historique et vintage",
    )
    st.session_state["glitch"] = st.toggle(
        "⚡ Glitch effect",
        value=st.session_state["glitch"],
        help="Ajoute du bruit et un effet de distorsion, parfait pour le contenu horror et thriller",
    )

    col1, col2 = st.columns(2)
    col1.button("← Retour", on_click=go_prev, use_container_width=True)
    col2.button("Continuer →", on_click=go_next, type="primary", use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# STEP 7 — Generate
# ══════════════════════════════════════════════════════════════════════════════
elif step == 7:
    st.subheader("Générer la vidéo")

    niche = st.session_state["niche"]
    niche_data = NICHES.get(niche, NICHES["Custom"])
    topic = st.session_state["custom_topic"] if niche == "Custom" else niche

    # Summary
    with st.expander("📋 Récapitulatif de ta vidéo", expanded=True):
        col1, col2 = st.columns(2)
        with col1:
            st.write(f"**Niche :** {niche_data['icon']} {niche}")
            st.write(f"**Durée :** {st.session_state['duration']}s")
            st.write(f"**Format :** {'9:16 Court' if st.session_state['format_type'] == 'short' else '16:9 Long'}")
            st.write(f"**Voix :** {'ElevenLabs' if st.session_state['voice_engine'] == 'elevenlabs' else 'edge-tts (gratuit)'}")
        with col2:
            st.write(f"**Style visuel :** {ART_STYLES[st.session_state['art_style']]['icon']} {st.session_state['art_style']}")
            st.write(f"**Captions :** {st.session_state['caption_style']}")
            st.write(f"**Musique :** {'Oui' if st.session_state['music_path'] else 'Non'}")
            st.write(f"**Effets :** {'Film grain ' if st.session_state['film_grain'] else ''}{'Glitch' if st.session_state['glitch'] else ''}" or "Aucun")

    # Script section
    st.markdown("**Script**")
    if not st.session_state["script"]:
        if st.button("✍️ Générer le script automatiquement"):
            with st.spinner("Génération du script..."):
                hint = niche_data["prompt_hint"]
                eng = st.session_state["script_engine"]
                dur = st.session_state["duration"]
                lang = st.session_state["language"]
                try:
                    if eng == "Groq" and st.session_state["groq_key"]:
                        st.session_state["script"] = generate_script_groq(topic, dur, lang, st.session_state["groq_key"], hint)
                    elif eng == "OpenAI" and st.session_state["openai_key"]:
                        st.session_state["script"] = generate_script_openai(topic, dur, lang, st.session_state["openai_key"], hint)
                    elif eng == "Ollama":
                        st.session_state["script"] = generate_script_ollama(topic, dur, lang, hint)
                    else:
                        st.session_state["script"] = generate_script_template(topic, dur, lang)
                    st.success("Script généré !")
                except Exception as e:
                    st.error(f"Erreur script : {e}")
                    st.session_state["script"] = generate_script_template(topic, dur, lang)

    st.session_state["script"] = st.text_area(
        "Script (modifiable)",
        value=st.session_state["script"],
        height=200,
        placeholder="Cliquez sur 'Générer le script' ou écrivez votre script ici...",
    )

    st.divider()
    col1, col2 = st.columns(2)
    col1.button("← Retour", on_click=go_prev, use_container_width=True)

    can_generate = bool(st.session_state["script"].strip())
    if col2.button("🎬 Générer la vidéo", disabled=not can_generate, type="primary", use_container_width=True):
        progress = st.progress(0, text="Démarrage...")
        status = st.empty()
        try:
            # Voice
            status.text("🔊 Génération de la voix...")
            progress.progress(15)
            voice_path = tempfile.mktemp(suffix=".mp3")
            generate_voice(
                text=st.session_state["script"],
                output_path=voice_path,
                elevenlabs_key=st.session_state["elevenlabs_key"],
                elevenlabs_voice_id=st.session_state["elevenlabs_voice_id"],
                edge_voice=st.session_state["edge_voice"],
            )

            # Footage
            status.text("📹 Récupération du footage...")
            progress.progress(35)
            style_query = ART_STYLES[st.session_state["art_style"]]["pexels_query"]
            niche_query = niche_data["pexels_query"]
            combined_query = f"{niche_query} {style_query}"
            orientation = "portrait" if st.session_state["format_type"] == "short" else "landscape"

            if st.session_state["footage_source"] == "Upload local (MP4)":
                footage_paths = save_uploads(st.session_state["uploaded_footage"])
            else:
                footage_paths = fetch_pexels(combined_query, count=6, api_key=st.session_state["pexels_key"], orientation=orientation)

            # Assemble
            status.text("🎞️ Assemblage de la vidéo...")
            progress.progress(60)
            output_path = assemble_video(
                footage_paths=footage_paths,
                audio_path=voice_path,
                format_type=st.session_state["format_type"],
                words_per_seg=st.session_state["words_per_sub"],
                script=st.session_state["script"],
                caption_style=st.session_state["caption_style"],
                film_grain=st.session_state["film_grain"],
                glitch=st.session_state["glitch"],
                music_path=st.session_state["music_path"],
            )

            progress.progress(100, text="Terminé !")
            status.empty()
            st.success("✅ Vidéo générée avec succès !")
            st.video(output_path)

            filename = f"faceless_{topic[:20].replace(' ', '_')}.mp4"
            with open(output_path, "rb") as f:
                st.download_button("⬇️ Télécharger le MP4", data=f,
                                   file_name=filename, mime="video/mp4", use_container_width=True)

        except Exception as exc:
            progress.empty()
            status.empty()
            st.error(f"Erreur : {exc}")
