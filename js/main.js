// Трёхмерный фон
let scene, camera, renderer, torus;
function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Освещение и объект
    const ambient = new THREE.AmbientLight(0x404060);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 16);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00d4aa,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: false,
    });
    torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Частицы
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 800;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
        starsPositions[i] = (Math.random() - 0.5) * 20;
        starsPositions[i+1] = (Math.random() - 0.5) * 20;
        starsPositions[i+2] = (Math.random() - 0.5) * 10;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({color: 0x8888cc, size: 0.02});
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (torus) {
        torus.rotation.x += 0.002;
        torus.rotation.y += 0.003;
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Прелоадер
window.addEventListener('load', () => {
    document.getElementById('preloader').classList.add('hidden');
});

// Анимация появления секций
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Фильтр публикаций
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.pub-item').forEach(item => {
            if (filter === 'all' || item.dataset.cat === filter) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Обработка формы (показывает статус без перезагрузки)
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        status.textContent = 'Отправка...';
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                status.textContent = '✅ Сообщение отправлено!';
                form.reset();
            } else {
                status.textContent = '❌ Ошибка. Попробуйте позже.';
            }
        } catch (error) {
            status.textContent = '❌ Ошибка соединения.';
        }
    });
}

// Запуск 3D
initThree();
