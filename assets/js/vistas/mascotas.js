////////////////////////// VARIABLES //////////////////////////
// (por ahora sin variables propias)

////////////////////////// FUNCIONES //////////////////////////
async function initMisMascotas() {
    const response = await fetch('api/mascotas.php');
    const { success, datos } = await response.json();

    if (!success) return;

    const galeria = document.querySelector('#galeria-mascotas');

    if (datos.length == 0) {
        const p = document.createElement('p');
        p.classList.add('mascotas-vacio');
        p.textContent = 'Aún no tienes mascotas registradas. ¡Añade la primera!';
        galeria.appendChild(p);
        return;
    }

    datos.forEach(function (mascota) {
        const card = document.createElement('div');
        card.classList.add('mascota-card');

        const fotoHTML = mascota.foto
            ? '<img src="' + mascota.foto + '" alt="' + mascota.nombre + '" class="mascota-foto">'
            : '<div class="mascota-foto-placeholder">' + (mascota.nombre_especie == 'Perro' ? '🐶' : '🐱') + '</div>';

        card.innerHTML = fotoHTML + `
    <div class="mascota-info">
        <p class="mascota-nombre">${mascota.nombre}</p>
        <p class="mascota-detalle"><strong>Especie:</strong> ${mascota.nombre_especie}</p>
        <p class="mascota-detalle"><strong>Raza:</strong> ${mascota.raza || 'Sin raza'}</p>
        <p class="mascota-detalle"><strong>Edad:</strong> ${mascota.edad ? mascota.edad + ' años' : 'Desconocida'}</p>
        <p class="mascota-detalle"><strong>Sexo:</strong> ${mascota.sexo}</p>
    </div>
    <div class="mascota-acciones">
        <button class="btn-editar" data-id="${mascota.id_mascota}">✏️</button>
        <button class="btn-eliminar" data-id="${mascota.id_mascota}">🗑️</button>
    </div>
`;

        galeria.appendChild(card);
    });
}