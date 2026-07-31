let cropper;
let cropTarget = '';
let imagemFundoCustomizada = '';

function abrirCropper(input, target) {
    if (!input.files || !input.files[0]) return;
    cropTarget = target;

    const reader = new FileReader();
    reader.onload = (e) => {
        const cropImg = document.getElementById('crop-image');
        if (cropImg) cropImg.src = e.target.result;
        const modal = document.getElementById('crop-modal');
        if (modal) modal.style.display = 'flex';

        if (cropper) cropper.destroy();
        cropper = new Cropper(cropImg, {
            aspectRatio: target === 'avatar' ? 3 / 4 : NaN,
            viewMode: 2,
            background: false,
            guides: true,
            autoCropArea: 0.9
        });
    };
    reader.readAsDataURL(input.files[0]);
    input.value = '';
}

function fecharCropper() {
    const modal = document.getElementById('crop-modal');
    if (modal) modal.style.display = 'none';
    if (cropper) cropper.destroy();
}

function aplicarCrop() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas();
    if (!canvas) return;

    const base64 = canvas.toDataURL('image/jpeg', 0.85);

    if (cropTarget === 'avatar') {
        const img = document.getElementById('char-avatar');
        if (img) {
            img.src = base64;
            img.style.display = 'block';
        }
        const ph = document.getElementById('avatar-placeholder');
        if (ph) ph.style.display = 'none';
        const btn = document.getElementById('avatar-reset-btn');
        if (btn) btn.style.display = 'block';
    } else if (cropTarget === 'bg') {
        imagemFundoCustomizada = base64;
        aplicarFundoCustomizado();
    }

    fecharCropper();
}

function aplicarFundoCustomizado() {
    if (!imagemFundoCustomizada) return;
    let st = document.getElementById('__bg-image-override__');
    if (!st) {
        st = document.createElement('style');
        st.id = '__bg-image-override__';
        document.head.appendChild(st);
    }
    st.textContent = `body { background-image: url("${imagemFundoCustomizada}") !important; background-size: cover !important; background-attachment: fixed !important; background-position: center !important; }`;
}

async function listarCamposDoPDF(input) {
    if (!input.files[0]) return;

    try {
        const arrayBuffer = await input.files[0].arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        console.log("--- CAMPOS DO PDF ---");
        fields.forEach(field => {
            console.log(`Nome do campo: "${field.getName()}" | Tipo: ${field.constructor.name}`);
        });
        console.log("---------------------");

        alert("Campos listados no Console (F12)!");
    } catch (err) {
        console.error("Erro ao ler o PDF:", err);
    }
}

function resetAvatar() {
    const img = document.getElementById('char-avatar');
    if (img) {
        img.src = '';
        img.style.display = 'none';
    }
    const ph = document.getElementById('avatar-placeholder');
    if (ph) ph.style.display = 'flex';
    const btn = document.getElementById('avatar-reset-btn');
    if (btn) btn.style.display = 'none';
    const input = document.getElementById('avatar-input');
    if (input) input.value = '';
}