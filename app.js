// --- 1. FUNCIÓN GLOBAL PARA OBTENER NÚMEROS ORDENADOS Y SIN REPETIR ---
function obtenerNumeros(cantidad, maximo) {
    const numeros = [];
    while (numeros.length < cantidad) { // <-- ¡CORREGIDO AQUÍ! Antes ponía quantity
        const num = Math.floor(Math.random() * maximo) + 1;
        if (!numeros.includes(num)) {
            numeros.push(num);
        }
    }
    return numeros.sort((a, b) => a - b).map(n => String(n).padStart(2, '0'));
}

// --- 2. FUNCIÓN PARA COPIAR Y ENVIAR A TU LOTERO ---
function enviarATuLotero(numeros, especial = null) {
    let mensaje = `Mi combinación: ${numeros.join(', ')}`;
    if (especial) {
        mensaje += ` | Especial: ${Array.isArray(especial) ? especial.join('-') : especial}`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mensaje).then(() => {
            alert("¡Números copiados! Te redirigimos a TuLotero.");
            window.open("https://tulotero.es", "_blank");
        }).catch(() => fallbackCopiar(mensaje));
    } else {
        fallbackCopiar(mensaje);
    }
}

function fallbackCopiar(texto) {
    const textarea = document.createElement("textarea");
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand("copy");
        alert("¡Números copiados! Te redirigimos a TuLotero.");
        window.open("https://tulotero.es", "_blank");
    } catch (err) {
        alert("Te redirigimos a TuLotero. Tus números generados son: " + texto);
        window.open("https://tulotero.es", "_blank");
    }
    document.body.removeChild(textarea);
}

// --- 3. EFECTO VISUAL, ANIMACIÓN Y PARADA PROGRESIVA ---
function mostrarBoletoConEfecto(bolasNormales, bolaEspecial = null, esEstrella = false, idBotonActivo) {
    const contenedor = document.getElementById('resultado');
    const bombo = document.getElementById('bomboEsfera');
    
    const botones = document.querySelectorAll('button');
    botones.forEach(btn => btn.disabled = true);
    
    const botonActivo = document.getElementById(idBotonActivo);
    if (botonActivo) {
        botonActivo.classList.add('boton-activo');
    }

    if (bombo) bombo.classList.add('girando');

    const resultadoReal = [...bolasNormales];
    if (bolaEspecial !== null) {
        if (esEstrella) {
            resultadoReal.push(...bolaEspecial); 
        } else {
            resultadoReal.push(bolaEspecial); 
        }
    }

    const totalElementos = resultadoReal.length;
    let elementosFijos = 0; 

    const animacion = setInterval(() => {
        let htmlContent = '<div class="boleto">';
        for (let i = 0; i < totalElementos; i++) {
            const esPosicionEstrella = esEstrella && (i >= bolasNormales.length);
            if (i < elementosFijos) {
                if (esPosicionEstrella) {
                    htmlContent += `<div class="estrella">${resultadoReal[i]}</div>`;
                } else {
                    htmlContent += `<div class="bola">${resultadoReal[i]}</div>`;
                }
            } else {
                if (esPosicionEstrella) {
                    const estrellaFalsa = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
                    htmlContent += `<div class="estrella">${estrellaFalsa}</div>`;
                } else {
                    const numeroFalso = String(Math.floor(Math.random() * 45) + 1).padStart(2, '0');
                    htmlContent += `<div class="bola">${numeroFalso}</div>`;
                }
            }
        }
        htmlContent += '</div>';
        contenedor.innerHTML = htmlContent;
    }, 60);

    const temporizadorParada = setInterval(() => {
        elementosFijos++;
        
        if (elementosFijos > totalElementos) {
            clearInterval(animacion);
            clearInterval(temporizadorParada);
            
            if (bombo) bombo.classList.remove('girando');
            
            // 1. Mensaje de Éxito
            const divSuerte = document.createElement('div');
            divSuerte.className = 'mensaje-suerte';
            divSuerte.innerHTML = '¡Molta sort! 🍀';
            contenedor.appendChild(divSuerte);
            
            // 2. Creación del Botón TuLotero
            const btnEnlace = document.createElement('button');
            btnEnlace.innerText = "Jugar combinación en TuLotero 📱";
            btnEnlace.style.marginTop = "12px";
            btnEnlace.style.backgroundColor = "#27ae60"; 
            btnEnlace.style.borderRadius = "30px";
            btnEnlace.style.padding = "10px 15px";
            btnEnlace.style.fontSize = "14px";
            btnEnlace.style.color = "white";
            btnEnlace.onclick = () => enviarATuLotero(bolasNormales, bolaEspecial);
            contenedor.appendChild(btnEnlace);
            
            // 3. Liberar botones de la interfaz
            botones.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('boton-activo');
            });
        }
    }, 400); 
}

// --- 4. CONFIGURACIÓN DE LOS 5 SORTEOS ---
function generarPrimitiva() {
    const combinacion = obtenerNumeros(6, 49);
    const reintegro = Math.floor(Math.random() * 10);
    mostrarBoletoConEfecto(combinacion, String(reintegro).padStart(2, '0'), false, 'btn-primitiva');
}

function generarBonoloto() {
    const combinacion = obtenerNumeros(6, 49);
    const reintegro = Math.floor(Math.random() * 10);
    mostrarBoletoConEfecto(combinacion, String(reintegro).padStart(2, '0'), false, 'btn-bonoloto');
}

function generarElGordo() {
    const combinacion = obtenerNumeros(5, 54);
    const clave = Math.floor(Math.random() * 10);
    mostrarBoletoConEfecto(combinacion, String(clave).padStart(2, '0'), false, 'btn-gordo');
}

function generarEuromillones() {
    const combinacion = obtenerNumeros(5, 50);
    const estrellas = obtenerNumeros(2, 12);
    mostrarBoletoConEfecto(combinacion, estrellas, true, 'btn-euromillones');
}

function generarEuroDreams() {
    const combinacion = obtenerNumeros(6, 40);
    const sueno = Math.floor(Math.random() * 5) + 1;
    mostrarBoletoConEfecto(combinacion, String(sueno).padStart(2, '0'), false, 'btn-eurodreams');
}
// --- 5. REGISTRO FORZADO DEL SERVICE WORKER (EVITA EL BLOQUEO EN MÓVILES) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Añadimos ?v=2 para obligar al móvil a borrar el código viejo y pintar el botón verde
        navigator.serviceWorker.register('./sw.js?v=2')
            .then(reg => {
                // Forzamos la actualización inmediata en el teléfono
                reg.update();
                console.log('Caché renovada en el móvil');
            })
            .catch(err => console.warn('Error', err));
    });
}
