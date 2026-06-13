// Mobile Menu
document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

// Slider Iklan
function initAdsSlider() {
    const track = document.getElementById('adsTrack');
    const dotsContainer = document.getElementById('adsDots');
    const slides = track.querySelectorAll('.ads-slide');
    let current = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `ads-dot ${i === 0 ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.ads-dot');

    function goTo(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        current = index;
    }

    setInterval(() => goTo(current + 1), 4000);
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
}
initAdsSlider();

// Fungsi Slider Produk
function initSlider(id) {
    const track = document.getElementById('track' + id);
    const dotsContainer = document.getElementById('dots' + id);
    const prevBtn = document.getElementById('prev' + id);
    const nextBtn = document.getElementById('next' + id);
    if (!track || !dotsContainer || !prevBtn || !nextBtn) return;

    const slides = track.querySelectorAll('.product-slide');
    let current = 0;

    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `product-dot ${i === 0 ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.product-dot');

    function goTo(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        current = index;
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
}

// Inisialisasi semua slider
initSlider(1);
initSlider(2);

// Data Keranjang
let keranjang = [];

// Pilihan Ukuran
document.querySelectorAll('.option[data-ukuran]').forEach(opt => {
    opt.addEventListener('click', function() {
        const parent = this.closest('.mb-5');
        parent.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');

        const harga = parseInt(this.dataset.harga);
        const idProduk = this.closest('.tambah-keranjang').dataset.id;
        document.getElementById('harga' + idProduk).textContent = 'Rp ' + harga.toLocaleString('id-ID');
    });
});

// Pilihan Warna
document.querySelectorAll('.option[data-warna]').forEach(opt => {
    opt.addEventListener('click', function() {
        const parent = this.closest('.mb-6');
        parent.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Tambah ke Keranjang
document.querySelectorAll('.tambah-keranjang').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.dataset.id;
        const nama = this.dataset.nama;
        const container = this.closest('.bg-white');

        const ukuranEl = container.querySelector('.option[data-ukuran].selected');
        const warnaEl = container.querySelector('.option[data-warna].selected');

        if (!ukuranEl || !warnaEl) {
            alert('Silakan pilih ukuran dan warna terlebih dahulu!');
            return;
        }

        const item = {
            id: id,
            nama: nama,
            ukuran: ukuranEl.dataset.ukuran,
            ld: ukuranEl.dataset.ld,
            pb: ukuranEl.dataset.pb,
            warna: warnaEl.dataset.warna,
            harga: parseInt(ukuranEl.dataset.harga),
            jumlah: 1
        };

        const index = keranjang.findIndex(i => 
            i.id === item.id && i.ukuran === item.ukuran && i.warna === item.warna
        );
        if (index !== -1) keranjang[index].jumlah += 1;
        else keranjang.push(item);

        updateKeranjang();
        alert('Produk ditambahkan ke keranjang!');
    });
});

// Update Tampilan Keranjang
function updateKeranjang() {
    const countEl = document.getElementById('cartCount');
    const emptyEl = document.getElementById('cartEmpty');
    const contentEl = document.getElementById('cartContent');
    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('totalHarga');

    const totalItem = keranjang.reduce((s, i) => s + i.jumlah, 0);
    const totalHarga = keranjang.reduce((s, i) => s + (i.harga * i.jumlah), 0);

    countEl.textContent = totalItem;

    if (keranjang.length === 0) {
        emptyEl.classList.remove('hidden');
        contentEl.classList.add('hidden');
        return;
    }

    emptyEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
    totalEl.textContent = 'Rp ' + totalHarga.toLocaleString('id-ID');

    itemsEl.innerHTML = keranjang.map((item, idx) => `
        <div class="border p-3 rounded-lg">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-semibold">${item.nama}</h4>
                    <p class="text-sm text-gray-600">Ukuran: ${item.ukuran} | LD: ${item.ld} | PB: ${item.pb}</p>
                    <p class="text-sm text-gray-600">Warna: ${item.warna}</p>
                    <p class="font-medium text-secondary mt-1">Rp ${item.harga.toLocaleString('id-ID')}</p>
                </div>
                <button class="text-danger hapus-item" data-index="${idx}"><i class="fa fa-trash"></i></button>
            </div>
            <div class="flex items-center gap-2 mt-2">
                <button class="px-2 py-1 border rounded kurangi-jumlah" data-index="${idx}">-</button>
                <span>${item.jumlah}</span>
                <button class="px-2 py-1 border rounded tambah-jumlah" data-index="${idx}">+</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.kurangi-jumlah').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            keranjang[idx].jumlah > 1 ? keranjang[idx].jumlah-- : keranjang.splice(idx, 1);
            updateKeranjang();
        });
    });

    document.querySelectorAll('.tambah-jumlah').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            keranjang[idx].jumlah++;
            updateKeranjang();
        });
    });

    document.querySelectorAll('.hapus-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            keranjang.splice(idx, 1);
            updateKeranjang();
        });
    });
}

// Buka/Tutup Keranjang
document.getElementById('cartBtn').addEventListener('click', () => {
    updateKeranjang();
    document.getElementById('cartModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
});

document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
    document.body.style.overflow = 'auto';
});

document.getElementById('batalPesanan').addEventListener('click', () => {
    if (confirm('Yakin batalkan semua pesanan?')) {
        keranjang = [];
        updateKeranjang();
        document.getElementById('cartModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.getElementById('lanjutPesan').addEventListener('click', () => {
    if (keranjang.length === 0) return;
    const detailEl = document.getElementById('detailPesanan');
    const total = keranjang.reduce((s, i) => s + (i.harga * i.jumlah), 0);

    detailEl.innerHTML = keranjang.map(item => `
        <p>• ${item.nama} - ${item.ukuran} - ${item.warna} (${item.jumlah} x Rp ${item.harga.toLocaleString('id-ID')}) = Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}</p>
    `).join('');

    document.getElementById('totalPesanan').textContent = 'Rp ' + total.toLocaleString('id-ID');
    document.getElementById('invoiceNumber').textContent = generateInvoice();
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('orderModal').style.display = 'block';
});

document.getElementById('batalForm').addEventListener('click', () => {
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = 'auto';
});

document.getElementById('closeOrder').addEventListener('click', () => {
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

function generateInvoice() {
    const d = new Date();
    const dateStr = d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
    const rand = String(Math.floor(Math.random()*10000)).padStart(4,'0');
    return `INV-${dateStr}-${rand}`;
}

// Kirim ke WhatsApp
document.getElementById('orderForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const inv = document.getElementById('invoiceNumber').textContent;
    let pesan = `*PEMESANAN BARU*\nNo: ${inv}\nStatus: PRE ORDER\n\n`;
    pesan += `*DATA PEMBELI*\nNama: ${form.get('nama')}\nWA: ${form.get('wa')}\nAlamat: ${form.get('alamat')}\n\n`;
    pesan += `*DETAIL PRODUK*\n`;
    keranjang.forEach((p, i) => {
        pesan += `${i+1}. ${p.nama}\nUkuran: ${p.ukuran} | LD: ${p.ld} | PB: ${p.pb}\nWarna: ${p.warna}\nJumlah: ${p.jumlah} x Rp ${p.harga.toLocaleString('id-ID')}\n\n`;
    });
    const total = keranjang.reduce((s, i) => s + (i.harga * i.jumlah), 0);
    pesan += `*TOTAL: Rp ${total.toLocaleString('id-ID')}*\n\nPengiriman 7-14 hari kerja setelah pembayaran.`;

    const wa = '6281298765432'; // Ganti nomor WA kamu
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(pesan)}`, '_blank');

    keranjang = [];
    updateKeranjang();
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    e.target.reset();
});


