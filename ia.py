import os
import time
from rich.console import Console
from rich.panel import Panel
from rich.live import Live
from rich.table import Table
from langchain_ollama import OllamaLLM

console = Console()

# Initialisation des 4 Cerveaux
ia_build = OllamaLLM(model="codestral:latest")
ia_syntax = OllamaLLM(model="codellama:34b")
ia_design = OllamaLLM(model="command-r:latest")
ia_boss = OllamaLLM(model="phind-codellama:34b")

def traiter_fichier(chemin):
    with open(chemin, 'r') as f:
        code_initial = f.read()

    console.rule(f"[bold gold1]ANALYSE DE {chemin}")

    # 1. IA BUILD (DeepSeek/Codestral)
    with console.status("[bold blue]L'Ingénieur Build analyse les dépendances..."):
        diag_build = ia_build.invoke(f"Analyse ce code. Liste les erreurs de build/imports en français. Donne ensuite le code corrigé sans bla-bla inutile.\n\nCODE:\n{code_initial}")
    console.print(Panel(diag_build, title="[IA BUILD]", border_style="blue"))

    # 2. IA SYNTAXE (CodeLlama 34B)
    with console.status("[bold magenta]L'Expert Syntaxe traque les fautes de frappe..."):
        diag_syntax = ia_syntax.invoke(f"Identifie les erreurs de syntaxe TSX. Liste le nombre d'erreurs en français et fournis le code corrigé :\n\n{diag_build}")
    console.print(Panel(diag_syntax, title="[IA SYNTAXE]", border_style="magenta"))

    # 3. IA DESIGN (Command-R)
    with console.status("[bold yellow]Le Designer applique le thème Gold..."):
        diag_design = ia_design.invoke(f"Prends ce code et rends-le luxueux (Dark Gold Theme). Explique tes changements UI en français :\n\n{diag_syntax}")
    console.print(Panel(diag_design, title="[IA DESIGN]", border_style="yellow"))

    # 4. IA BOSS (Phind 34B)
    with console.status("[bold green]Le Boss valide la sécurité non-custodial..."):
        verdict = ia_boss.invoke(f"Vérifie la sécurité de ce portefeuille. Fais un rapport final en français (Erreurs restantes, Sécurité, Esthétique) :\n\n{diag_design}")
    console.print(Panel(verdict, title="[VERDICT DU BOSS]", border_style="green"))

    # Sauvegarde finale
    nom_final = f"FIXED_{chemin}"
    with open(nom_final, "w") as f:
        # On essaie d'extraire uniquement le code de la réponse du Boss/Designer
        f.write(diag_design)
    
    console.print(f"\n[bold green]✅ {chemin} terminé ! Fichier créé : {nom_final}[/bold green]\n")

# Lancement sur ton dossier
fichiers_cibles = ["App.tsx", "package.json"]
for f in fichiers_cibles:
    if os.path.exists(f):
        traiter_fichier(f)
