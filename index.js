const dominio = window.location.origin + window.location.pathname

async function getPalabra() {
    await fetch(dominio + "palabras.json")
        .then(res => res.json())
        .then(data => {
            palabra = data[Math.floor(Math.random()*data.length)]
        })
    return palabra
}

async function getPalabras() {
    await fetch(dominio + "palabras.json")
        .then(res => res.json())
        .then(data => {
            palabras = data
        })
    return palabras
}

function volverJugar() {
    
    document.getElementById("resultado").innerHTML = ""
    
    Array.from(document.getElementsByClassName("palabra")).forEach((element) => {
        element.className = "palabra not-selected"
        element.value = ""
        element.disabled = true
    })
    
    document.getElementsByClassName("palabra")[0].className = "palabra selected"
    document.getElementsByClassName("palabra")[0].disabled = false

    Array.from(document.getElementsByClassName("input-letras")).forEach((element) => element.className = "input-letras")

    i = 0
    while (i < 5) {
        document.getElementsByClassName("input-letras")[i].className = "input-letras seleccionado"
        i++
    }

    Array.from(document.getElementsByClassName("selected")).forEach((element) => element.focus())

    palabra = getPalabra()
    palabras = getPalabras()
    secuencia = ""
}

function copiar() {
    nuevaSecuencia = secuencia.replaceAll("<br>", "\n")
    navigator.clipboard.writeText(nuevaSecuencia)
}

palabra = getPalabra()
palabras = getPalabras()
secuencia = ""

document.addEventListener("keypress", (e) => {
    if (e.key == "Enter" && document.getElementsByClassName("selected")[0].value.length == 5 && palabras.includes(document.getElementsByClassName("selected")[0].value.toUpperCase())) {
        const lista = document.getElementsByClassName("palabra")
        Array.from(lista).forEach((element, index) => {
            if (element.className == "palabra selected") {
                indiceLista = index
                indiceSiguiente = index+1
            }
        });

        const inputPalabra = lista[indiceLista].value.toUpperCase()

        if (inputPalabra == palabra) {
            ganador = true
        } else {
            ganador = false
        }

        const palabraLista = Array.from(palabra)

        let listaDivs = Array.from(document.getElementsByClassName("div-palabra"))

        const listaHuecos = Array.from(listaDivs[indiceLista].getElementsByClassName("input-letras"))
        const listaHuecosSiguientes =  listaDivs[indiceSiguiente] ? Array.from(listaDivs[indiceSiguiente].getElementsByClassName("input-letras")) : []

        let listaLetrasInput = {}
        let listaLetrasPalabra = {}

        Array.from(inputPalabra).forEach((element) => {
            listaLetrasInput[element] ? listaLetrasInput[element]++ : listaLetrasInput[element] = 1
        })

        palabraLista.forEach((element) => {
            listaLetrasPalabra[element] ? listaLetrasPalabra[element]++ : listaLetrasPalabra[element] = 1
        })

        Array.from(inputPalabra).forEach((element, index) => {
            if (element == palabraLista[index] && listaLetrasInput[element] && listaLetrasPalabra[element]) {
                listaHuecos[index].className = "input-letras verde"
                listaLetrasInput[element]-- 
                listaLetrasPalabra[element]--
                secuencia += "🟩"
            } else if (palabraLista.includes(element) && listaLetrasInput[element] && listaLetrasPalabra[element]) {
                listaHuecos[index].className = "input-letras amarillo"
                listaLetrasInput[element]-- 
                listaLetrasPalabra[element]--
                secuencia += "🟨"
            } else {
                listaHuecos[index].className = "input-letras gris"
                secuencia += "⬛"
            }
        })

        secuencia += "<br>"

        lista[indiceLista].className = "palabra not-selected"
        lista[indiceLista].disabled = true
        if (lista[indiceSiguiente]) {
            lista[indiceSiguiente].className = "palabra selected"
            lista[indiceSiguiente].disabled = false
            lista[indiceSiguiente].focus()
        } else {
            const divResultado = document.getElementById("resultado")
            divResultado.innerHTML = "<h1>PERDEDOR</h1><br><span>La palabra era:" + palabra + "</span><br><button id='volver-jugar' onclick='volverJugar()'>Volver a jugar</button><br><span>Resultado: </span><br><span>" + secuencia + "</span><br><button id='copiar' onclick='copiar()'>Copiar</button>"
        }

        if (ganador) {
            const divResultado = document.getElementById("resultado")
            divResultado.innerHTML = "<h1>GANADOR</h1><br><button id='volver-jugar' onclick='volverJugar()'>Volver a jugar</button><br><span>Resultado: </span><br><span>" + secuencia + "</span><br><button id='copiar' onclick='copiar()'>Copiar</button>"
        } else {
            listaHuecosSiguientes.forEach((element) => element.className = "input-letras seleccionado")
        }
    } else if (e.key == "Enter" && !palabras.includes(document.getElementsByClassName("selected")[0].value.toUpperCase())) {
        alert("Palabra no existente")
    }
})

document.getElementsByClassName('selected')[0].addEventListener('blur', () => {
    document.getElementsByClassName('selected')[0].focus();
});
