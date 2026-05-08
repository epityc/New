import pathlib
import tempfile

import streamlit as st

from modules.footage import fetch_pexels, save_uploads
from modules.script_gen import (
    generate_script_groq,
    generate_script_ollama,
    generate_script_openai,
    generate_script_template,
)
from modules.tts import VOICES, generate_voice
from modules.video_builder import assemble_video

st.set_page_config(page_title="FacelessReels Clone", page_icon="🎬", layout="wide")
st.title("🎬 FacelessReels Clone")
st.caption("Génère des vidéos faceless automatiquement — 100 % gratuit & local")

# ── Sidebar ────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.header("⚙️ Paramètres")

    fmt = st.selectbox("Format vidéo", ["Court 9:16 — Reels / TikTok / Shorts", "Long 16:9 — YouTube"])
    format_type = "short" if fmt.startswith("Court") else "long"

    default_duration = 60 if format_type == "short" else 300
    duration = st.slider("Durée cible (secondes)", 20, 900, default_duration, step=10)

    lang = st.selectbox("Langue", ["Français", "English"])
    language = "fr" if lang == "Français" else "en"

    voice_options = list(VOICES[language].keys())
    voice_label = st.selectbox("Voix", voice_options)
    voice_id = VOICES[language][voice_label]

    words_per_sub = st.slider("Mots par sous-titre", 3, 10, 5)

    st.divider()
    st.subheader("📹 Footage")
    footage_source = st.radio("Source", ["Upload local (MP4)", "Pexels API (gratuit)"])
    pexels_key = ""
    if footage_source == "Pexels API (gratuit)":
        pexels_key = st.text_input(
            "Clé API Pexels",
            type="password",
            placeholder="Créer un compte gratuit sur pexels.com/api",
        )

    st.divider()
    st.subheader("🤖 Génération de script")
    script_engine = st.radio(
        "Moteur IA",
        [
            "Groq — Gratuit & rapide (recommandé)",
            "OpenAI GPT-4o-mini",
            "Template intégré (sans clé)",
            "Ollama (local uniquement)",
        ],
    )

    groq_key = ""
    openai_key = ""
    if script_engine.startswith("Groq"):
        groq_key = st.text_input(
            "Clé API Groq",
            type="password",
            placeholder="console.groq.com → Free API key",
        )
        st.caption("Gratuit · 14 400 req/jour · Inscription en 1 min")
    elif script_engine.startswith("OpenAI"):
        openai_key = st.text_input(
            "Clé API OpenAI",
            type="password",
            placeholder="platform.openai.com/api-keys",
        )
        st.caption("Payant · ~0.0001 $/script · Très haute qualité")

# ── Layout principal ───────────────────────────────────────────────────────────
col1, col2 = st.columns([1, 1], gap="large")

with col1:
    st.subheader("1 · Sujet & Script")
    topic = st.text_input(
        "Sujet de la vidéo",
        placeholder="Ex : Les habitudes des millionnaires, Comment perdre du poids…",
    )

    engine_ready = (
        (script_engine.startswith("Groq") and groq_key)
        or (script_engine.startswith("OpenAI") and openai_key)
        or script_engine.startswith("Template")
        or script_engine.startswith("Ollama")
    )

    if script_engine.startswith("Groq") and not groq_key:
        st.warning("Entrez votre clé Groq dans la barre latérale.")
    if script_engine.startswith("OpenAI") and not openai_key:
        st.warning("Entrez votre clé OpenAI dans la barre latérale.")

    if st.button("✍️ Générer le script", disabled=not (topic and engine_ready)):
        with st.spinner("Génération en cours…"):
            if script_engine.startswith("Groq"):
                st.session_state["script"] = generate_script_groq(topic, duration, language, groq_key)
            elif script_engine.startswith("OpenAI"):
                st.session_state["script"] = generate_script_openai(topic, duration, language, openai_key)
            elif script_engine.startswith("Ollama"):
                st.session_state["script"] = generate_script_ollama(topic, duration, language)
            else:
                st.session_state["script"] = generate_script_template(topic, duration, language)
        st.success("Script généré !")

    script_text = st.text_area(
        "Script (modifiable avant génération)",
        value=st.session_state.get("script", ""),
        height=320,
        placeholder="Le script apparaîtra ici après génération. Vous pouvez aussi l'écrire manuellement.",
        key="script_area",
    )
    st.session_state["script"] = script_text

with col2:
    st.subheader("2 · Footage vidéo")
    uploaded_files = []
    if footage_source == "Upload local (MP4)":
        uploaded_files = st.file_uploader(
            "Importer des vidéos de fond (MP4, MOV)",
            type=["mp4", "mov"],
            accept_multiple_files=True,
        )
        if uploaded_files:
            st.success(f"{len(uploaded_files)} fichier(s) chargé(s)")
        else:
            st.info("Importez au moins une vidéo de fond. Elle sera bouclée si trop courte.")
    else:
        st.info(
            "Les vidéos seront récupérées automatiquement depuis Pexels "
            "en fonction du sujet de votre vidéo."
        )
        if not pexels_key:
            st.warning("Entrez votre clé API Pexels dans la barre latérale.")

# ── Vérification des prérequis ─────────────────────────────────────────────────
st.divider()
st.subheader("3 · Générer la vidéo")

script_ready = bool(st.session_state.get("script", "").strip())
footage_ready = (footage_source == "Upload local (MP4)" and uploaded_files) or (
    footage_source == "Pexels API (gratuit)" and pexels_key
)

missing = []
if not script_ready:
    missing.append("script")
if not footage_ready:
    missing.append("footage (upload ou clé Pexels)")

if missing:
    st.warning(f"Manquant avant de générer : {', '.join(missing)}")

generate_btn = st.button(
    "🎬 Générer la vidéo",
    disabled=not (script_ready and footage_ready),
    type="primary",
    use_container_width=True,
)

# ── Pipeline de génération ─────────────────────────────────────────────────────
if generate_btn:
    progress = st.progress(0, text="Démarrage…")
    status = st.empty()

    try:
        status.text("🔊 Génération de la voix (edge-tts)…")
        progress.progress(10, text="Voix en cours…")
        voice_path = tempfile.mktemp(suffix=".mp3")
        generate_voice(st.session_state["script"], voice_id, voice_path)

        status.text("📹 Préparation du footage…")
        progress.progress(30, text="Footage…")
        if footage_source == "Upload local (MP4)":
            footage_paths = save_uploads(uploaded_files)
        else:
            orientation = "portrait" if format_type == "short" else "landscape"
            footage_paths = fetch_pexels(
                query=topic or "motivation business",
                count=6,
                api_key=pexels_key,
                orientation=orientation,
            )

        status.text("🎞️ Assemblage vidéo (peut prendre quelques minutes)…")
        progress.progress(55, text="Assemblage…")
        output_path = assemble_video(
            footage_paths=footage_paths,
            audio_path=voice_path,
            format_type=format_type,
            words_per_seg=words_per_sub,
            script=st.session_state["script"],
        )

        progress.progress(100, text="Terminé !")
        status.empty()
        st.success("✅ Vidéo générée avec succès !")

        st.video(output_path)
        filename = f"faceless_{(topic or 'video')[:25].replace(' ', '_')}.mp4"
        with open(output_path, "rb") as f:
            st.download_button(
                "⬇️ Télécharger le MP4",
                data=f,
                file_name=filename,
                mime="video/mp4",
                use_container_width=True,
            )

    except Exception as exc:
        progress.empty()
        status.empty()
        st.error(f"Erreur lors de la génération : {exc}")
