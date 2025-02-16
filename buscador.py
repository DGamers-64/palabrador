import json, re

with open("palabras.json", "r", encoding="utf-8") as f:
    palabras = json.load(f)

filtro = input("Filtro regexp > ")
patron = re.compile(filtro)

lista = []

for i in palabras:
    if patron.match(i):
        lista.append(i)

print(lista)