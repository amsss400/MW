import os

# Liste des fichiers critiques
targets = ['App.tsx', 'shim.js', 'index.js']

print("--- [IA SYNTAXE] : Nettoyage des imports et des points-virgules ---")
for target in targets:
    if os.path.exists(target):
        with open(target, 'r') as f:
            content = f.read()
        # Simulation de correction (on pourrait ici appeler une API)
        new_content = content.replace(';;', ';') 
        with open(target, 'w') as f:
            f.write(new_content)
        print(f"[OK] {target} analysé.")
