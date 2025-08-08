// --- Inisialisasi Library dari CDN ---
const { jsPDF } = window.jspdf;

// --- Variabel Global & Inisialisasi Scene 3D ---
let scene, camera, renderer, controls, containerMesh;
const canvasContainer = document.getElementById('canvas-container');

// Data dimensi kontainer (dalam meter)
const CONTAINER_DIMS = {
    '20ft': { l: 5.898, w: 2.352, h: 2.393, text: "P: 5.90m, L: 2.35m, T: 2.39m" },
    '40ft': { l: 12.032, w: 2.352, h: 2.393, text: "P: 12.03m, L: 2.35m, T: 2.39m" },
    '40hc': { l: 12.032, w: 2.352, h: 2.698, text: "P: 12.03m, L: 2.35m, T: 2.70m" },
    'custom': { l: 0, w: 0, h: 0, text: "Masukkan dimensi custom." }
};

const itemsInScene = []; // Untuk menyimpan semua mesh barang

/**
 * Menginisialisasi scene 3D, kamera, renderer, dan kontrol.
 */
function init3D() {
    // 1. Scene: Wadah untuk semua objek 3D
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // 2. Camera: Sudut pandang kita ke dalam scene
    camera = new THREE.PerspectiveCamera(50, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(10, 8, 15);
    camera.lookAt(0, 0, 0);

    // 3. Renderer: Yang "menggambar" scene ke layar
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);
    
    // 4. Lights: Sumber cahaya untuk menerangi objek
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    scene.add(directionalLight);

    // 5. Controls: Memungkinkan interaksi mouse (putar, zoom, geser)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Efek "rem" agar lebih halus

    // Grid Helper: Untuk membantu orientasi visual
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Loop Animasi: Terus menerus merender scene
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Wajib dipanggil agar kontrol berfungsi
        renderer.render(scene, camera);
    }
    animate();
}

/**
 * Menggambar wireframe kontainer di scene.
 * @param {number} l - Panjang kontainer.
 * @param {number} w - Lebar kontainer.
 * @param {number} h - Tinggi kontainer.
 */
function drawContainer(l, w, h) {
    if (containerMesh) {
        scene.remove(containerMesh);
    }
    if (l > 0 && w > 0 && h > 0) {
        const geometry = new THREE.BoxGeometry(l, h, w); // x=l, y=h, z=w
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        containerMesh = new THREE.Mesh(geometry, material);
        containerMesh.position.set(0, h / 2, 0); // Posisikan agar alasnya di y=0
        scene.add(containerMesh);
    }
}

/**
 * Memperbarui info dan visualisasi kontainer berdasarkan pilihan UI.
 */
function updateContainer() {
    const selection = document.getElementById('container-select').value;
    const infoDiv = document.getElementById('container-info');
    const customDiv = document.getElementById('custom-dims');
    let dims = { ...CONTAINER_DIMS[selection] }; // Salin objek agar tidak mengubah data asli

    if (selection === 'custom') {
        customDiv.classList.remove('hidden');
        dims.l = parseFloat(document.getElementById('custom-l').value) || 0;
        dims.w = parseFloat(document.getElementById('custom-w').value) || 0;
        dims.h = parseFloat(document.getElementById('custom-h').value) || 0;
        infoDiv.innerText = `P: ${dims.l.toFixed(2)}m, L: ${dims.w.toFixed(2)}m, T: ${dims.h.toFixed(2)}m`;
    } else {
        customDiv.classList.add('hidden');
        infoDiv.innerText = dims.text;
    }
    
    drawContainer(dims.l, dims.w, dims.h);
}

/**
 * Menambahkan baris input material baru ke UI.
 */
function addMaterialItem() {
    const template = document.getElementById('material-item-template');
    const clone = template.content.cloneNode(true);
    const materialList = document.getElementById('material-list');
    materialList.appendChild(clone);
    // Tambahkan event listener untuk elemen yang baru dibuat
    const newItem = materialList.lastElementChild;
    newItem.querySelector('.remove-material-btn').addEventListener('click', () => newItem.remove());
    newItem.querySelector('.shape-select').addEventListener('change', handleShapeChange);
}

/**
 * Mengatur tampilan input dimensi berdasarkan pilihan bentuk (kotak/bulat).
 * @param {Event} event - Event dari elemen select.
 */
function handleShapeChange(event) {
    const itemDiv = event.target.closest('.material-item');
    const shape = event.target.value;
    const boxDims = itemDiv.querySelector('.dims-box');
    const cylDims = itemDiv.querySelector('.dims-cylinder');

    boxDims.classList.toggle('hidden', shape !== 'box');
    cylDims.classList.toggle('hidden', shape !== 'cylinder');
}

/**
 * Membaca data dari UI, lalu memvisualisasikan barang di dalam kontainer.
 */
function visualizeItems() {
    // 1. Bersihkan semua barang lama dari scene
    itemsInScene.forEach(item => scene.remove(item));
    itemsInScene.length = 0;

    // 2. Dapatkan dimensi kontainer saat ini
    const containerSelection = document.getElementById('container-select').value;
    const containerDims = { ...CONTAINER_DIMS[containerSelection] }; // Salin objek
    if (containerSelection === 'custom') {
        containerDims.l = parseFloat(document.getElementById('custom-l').value) || 0;
        containerDims.w = parseFloat(document.getElementById('custom-w').value) || 0;
        containerDims.h = parseFloat(document.getElementById('custom-h').value) || 0;
    }
    if (containerDims.l <= 0 || containerDims.w <= 0 || containerDims.h <= 0) {
        alert("Dimensi kontainer tidak valid!");
        return;
    }

    // 3. Siapkan variabel untuk algoritma packing
    let currentX = -containerDims.l / 2;
    let currentY = 0;
    let currentZ = -containerDims.w / 2;
    let rowMaxZ = 0;

    // 4. Loop semua material dari UI
    const materialItems = document.querySelectorAll('.material-item');
    materialItems.forEach(item => {
        const shape = item.querySelector('.shape-select').value;
        const quantity = parseInt(item.querySelector('.quantity').value) || 0;
        const color = new THREE.Color(Math.random() * 0xffffff);
        const material = new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 });

        let geom, itemL, itemW, itemH;

        if (shape === 'box') {
            itemL = parseFloat(item.querySelector('.dim-l').value) || 0;
            itemW = parseFloat(item.querySelector('.dim-w').value) || 0;
            itemH = parseFloat(item.querySelector('.dim-h').value) || 0;
            if (itemL <= 0 || itemW <= 0 || itemH <= 0) return; // Skip jika dimensi tidak valid
            geom = new THREE.BoxGeometry(itemL, itemH, itemW);
        } else { // Cylinder
            const diameter = parseFloat(item.querySelector('.dim-d').value) || 0;
            itemH = parseFloat(item.querySelector('.dim-h-cyl').value) || 0;
            if (diameter <= 0 || itemH <= 0) return; // Skip jika dimensi tidak valid
            itemL = diameter;
            itemW = diameter;
            geom = new THREE.CylinderGeometry(diameter / 2, diameter / 2, itemH, 32);
        }

        // --- Algoritma Packing Sederhana ---
        for (let i = 0; i < quantity; i++) {
            // Cek apakah muat di baris ini (sumbu X)
            if (currentX + itemL > containerDims.l / 2) {
                currentX = -containerDims.l / 2; // Reset X ke awal
                currentZ += rowMaxZ; // Pindah ke baris Z berikutnya
                rowMaxZ = 0; // Reset lebar baris maks
            }
            // Cek apakah muat di 'lantai' (sumbu Z)
            if (currentZ + itemW > containerDims.w / 2) {
                currentZ = -containerDims.w / 2; // Reset Z
                currentX = -containerDims.l / 2; // Reset X
                currentY += itemH; // Naik ke level berikutnya (simplifikasi)
                rowMaxZ = 0;
            }
            // Cek apakah muat secara vertikal (sumbu Y)
            if (currentY + itemH > containerDims.h) {
                console.warn("Barang tidak muat lagi di kontainer!");
                continue; // Lanjut ke tipe barang berikutnya
            }

            const mesh = new THREE.Mesh(geom, material);
            // Posisikan barang
            mesh.position.set(
                currentX + itemL / 2,
                currentY + itemH / 2,
                currentZ + itemW / 2
            );
            scene.add(mesh);
            itemsInScene.push(mesh);
            
            // Pindahkan posisi X untuk barang berikutnya
            currentX += itemL;
            if (itemW > rowMaxZ) rowMaxZ = itemW;
        }
    });
}

/**
 * Mengatur posisi kamera untuk sudut pandang yang berbeda.
 * @param {'3d'|'top'|'front'|'side'} pos - Nama posisi yang diinginkan.
 */
function setCameraView(pos) {
    const containerSelect = document.getElementById('container-select');
    let dims = { ...CONTAINER_DIMS[containerSelect.value] };
    if (containerSelect.value === 'custom') {
        dims.l = parseFloat(document.getElementById('custom-l').value) || 5;
        dims.w = parseFloat(document.getElementById('custom-w').value) || 2.5;
        dims.h = parseFloat(document.getElementById('custom-h').value) || 2.5;
    }
    
    const center = new THREE.Vector3(0, dims.h / 2, 0);
    const maxDim = Math.max(dims.l, dims.w, dims.h) * 1.5;

    if (pos === '3d') camera.position.set(dims.l * 0.7, dims.h * 2, dims.w * 2);
    if (pos === 'top') camera.position.set(0, maxDim, 0);
    if (pos === 'front') camera.position.set(0, dims.h / 2, maxDim);
    if (pos === 'side') camera.position.set(maxDim, dims.h / 2, 0);
    
    camera.lookAt(center);
    controls.target.copy(center); // Arahkan OrbitControls ke pusat kontainer
}

/**
 * Mengambil screenshot dari canvas 3D dan menyimpannya sebagai file PDF.
 */
function saveToPdf() {
    const canvas = canvasContainer.querySelector('canvas');
    if (!canvas) return;

    html2canvas(canvas).then(canvasImg => {
        const imgData = canvasImg.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvasImg.width, canvasImg.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvasImg.width, canvasImg.height);
        pdf.save("container-plan.pdf");
    });
}

// --- Event Listeners Utama ---
window.addEventListener('DOMContentLoaded', () => {
    init3D();

    // Event listener untuk semua elemen UI
    document.getElementById('container-select').addEventListener('change', updateContainer);
    ['input', 'change'].forEach(evt => {
        document.getElementById('custom-l').addEventListener(evt, updateContainer);
        document.getElementById('custom-w').addEventListener(evt, updateContainer);
        document.getElementById('custom-h').addEventListener(evt, updateContainer);
    });
    
    document.getElementById('add-material-btn').addEventListener('click', addMaterialItem);
    document.getElementById('visualize-btn').addEventListener('click', visualizeItems);
    
    document.getElementById('view-3d').addEventListener('click', () => setCameraView('3d'));
    document.getElementById('view-top').addEventListener('click', () => setCameraView('top'));
    document.getElementById('view-front').addEventListener('click', () => setCameraView('front'));
    document.getElementById('view-side').addEventListener('click', () => setCameraView('side'));
    
    document.getElementById('save-pdf-btn').addEventListener('click', saveToPdf);

    // Inisialisasi tampilan awal
    updateContainer();
    addMaterialItem(); // Tambah satu item material kosong saat pertama kali dimuat
});