// Función global para obtener números ordenados y sin repetir (con formato 00)
function obtenerNumeros(cantidad, maximo) {
    const numeros = [];
    while (numeros.length < cantidad) {
        const num = Math.floor(Math.random() * maximo) + 1;
        if (!numeros.includes(num)) {
            numeros.push(num);
        }
    }
    return numeros.sort((a, b) => a - b).map(n => String(n).padStart(2, '0'));
}

// Función con efecto de parada secuencial bola por bola conectada al movimiento del bombo e interactividad de botones
function mostrarBoletoConEfecto(bolasNormales, bolaEspecial = null, esEstrella = false, idBotonActivo) {
    const contenedor = document.getElementById('resultado');
    const bombo = document.getElementById('bomboEsfera');
    
    // 1. Manejo de botones: Apagamos todos en gris y resaltamos el botón pulsado en azul oscuro
    const botones = document.querySelectorAll('button');
    botones.forEach(btn => btn.disabled = true);
    
    const botonActivo = document.getElementById(idBotonActivo);
    if (botonActivo) {
        botonActivo.classList.add('boton-activo');
    }

    // Iniciamos la rotación real completa del bombo de oro
    bombo.classList.add('girando');

    // Combinamos los resultados reales
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

    // Bucle rápido para simular la rotación aleatoria de los números en el panel
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

    // Detención progresiva bola por bola
    const temporizadorParada = setInterval(() => {
        elementosFijos++;
        
        if (elementosFijos > totalElementos) {
            clearInterval(animacion);
            clearInterval(temporizadorParada);
            
            // Detenemos el giro de la esfera dorada
            bombo.classList.remove('girando');
            
            // Inyectamos el texto de éxito
            contenedor.innerHTML += `<div class="mensaje-suerte">¡Molta sort! 🍀</div>`;
            
            // Reactivamos los botones y devolvemos su color original quitando la clase activa
            botones.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('boton-activo');
            });
        }
    }, 400); 
}

// --- CONFIGURACIÓN DE LOS 5 SORTEOS PASANDO SU ID DE BOTÓN ---
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
