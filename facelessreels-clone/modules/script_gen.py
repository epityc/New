import requests
from openai import OpenAI


def _build_prompt(topic: str, duration: int, language: str, prompt_hint: str = "") -> str:
    lang = "en français" if language == "fr" else "in English"
    word_count = int(duration * 2.2)
    hint = prompt_hint or "Write an engaging faceless video script"
    return (
        f"{hint} {lang} about: {topic}. "
        f"Target length: {word_count} words. "
        f"Start with a powerful hook in the first 10 words to grab attention instantly. "
        f"Use short, punchy sentences. Be dramatic and engaging. "
        f"End with a strong call-to-action (like/subscribe/follow for more). "
        f"Output ONLY the script text — no title, no stage directions, no metadata."
    )


def generate_script_groq(
    topic: str, duration: int, language: str, api_key: str, prompt_hint: str = ""
) -> str:
    client = OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": _build_prompt(topic, duration, language, prompt_hint)}],
        temperature=0.85,
        max_tokens=2000,
    )
    return response.choices[0].message.content.strip()


def generate_script_openai(
    topic: str, duration: int, language: str, api_key: str, prompt_hint: str = ""
) -> str:
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": _build_prompt(topic, duration, language, prompt_hint)}],
        temperature=0.85,
        max_tokens=2000,
    )
    return response.choices[0].message.content.strip()


def generate_script_ollama(
    topic: str, duration: int, language: str, prompt_hint: str = ""
) -> str:
    try:
        r = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2",
                "prompt": _build_prompt(topic, duration, language, prompt_hint),
                "stream": False,
            },
            timeout=90,
        )
        r.raise_for_status()
        return r.json()["response"].strip()
    except Exception:
        return generate_script_template(topic, duration, language)


def generate_script_template(topic: str, duration: int, language: str) -> str:
    if language == "fr":
        return (
            f"Ce que je vais vous révéler sur {topic} va changer votre façon de voir les choses. "
            f"Préparez-vous, car cette histoire est incroyable. "
            f"Premièrement, la réalité est bien plus complexe qu'on ne le croit. "
            f"Les experts eux-mêmes sont surpris par ces découvertes récentes. "
            f"Deuxièmement, ceux qui maîtrisent ce sujet ont un avantage considérable. "
            f"Et troisièmement, vous pouvez appliquer ces principes dès aujourd'hui. "
            f"Ne manquez pas la suite — abonnez-vous maintenant !"
        )
    else:
        return (
            f"What I'm about to tell you about {topic} will change everything you thought you knew. "
            f"Get ready, because this story is absolutely incredible. "
            f"First, the reality is far more complex than anyone imagines. "
            f"Even experts are shocked by these recent discoveries. "
            f"Second, those who master this subject gain an enormous advantage. "
            f"And third, you can apply these principles starting today. "
            f"Don't miss what's coming next — subscribe now!"
        )
