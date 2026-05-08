import requests
from openai import OpenAI


def _build_prompt(topic: str, duration: int, language: str) -> str:
    lang = "en français" if language == "fr" else "in English"
    word_count = int(duration * 2.2)
    return (
        f"Write a {word_count}-word faceless video script {lang} about: {topic}. "
        f"Start with a strong hook in the first 10 words. "
        f"Be engaging, informative, use short punchy sentences. "
        f"End with a call-to-action (like/subscribe/follow). "
        f"Output ONLY the script text, no title, no instructions, no metadata."
    )


def generate_script_groq(topic: str, duration: int, language: str, api_key: str) -> str:
    client = OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": _build_prompt(topic, duration, language)}],
        temperature=0.8,
        max_tokens=2000,
    )
    return response.choices[0].message.content.strip()


def generate_script_openai(topic: str, duration: int, language: str, api_key: str) -> str:
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": _build_prompt(topic, duration, language)}],
        temperature=0.8,
        max_tokens=2000,
    )
    return response.choices[0].message.content.strip()


def generate_script_ollama(topic: str, duration: int, language: str) -> str:
    try:
        r = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama3.2", "prompt": _build_prompt(topic, duration, language), "stream": False},
            timeout=90,
        )
        r.raise_for_status()
        return r.json()["response"].strip()
    except Exception:
        return generate_script_template(topic, duration, language)


def generate_script_template(topic: str, duration: int, language: str) -> str:
    if language == "fr":
        return (
            f"Saviez-vous que {topic} peut littéralement changer votre vie ? "
            f"Voici les trois points essentiels que vous devez absolument connaître. "
            f"Premièrement, comprendre les fondamentaux est la base de tout succès. "
            f"Sans cette étape, rien d'autre ne fonctionne vraiment. "
            f"Deuxièmement, la régularité et la constance font toute la différence. "
            f"Les personnes qui réussissent ne sont pas plus intelligentes, elles sont plus constantes. "
            f"Troisièmement, votre entourage influence directement vos résultats. "
            f"Entourez-vous de personnes qui vous poussent vers le haut. "
            f"Appliquez ces trois principes dès aujourd'hui et observez les changements. "
            f"Abonnez-vous pour ne manquer aucun contenu comme celui-ci !"
        )
    else:
        return (
            f"Did you know that {topic} can literally change your life? "
            f"Here are the three key points you absolutely need to know. "
            f"First, mastering the fundamentals is the foundation of all success. "
            f"Without this step, nothing else truly works. "
            f"Second, consistency makes all the difference in the world. "
            f"Successful people aren't smarter, they're more consistent. "
            f"Third, your environment directly influences your results. "
            f"Surround yourself with people who push you higher. "
            f"Apply these three principles today and watch the transformation. "
            f"Follow for more content like this!"
        )
