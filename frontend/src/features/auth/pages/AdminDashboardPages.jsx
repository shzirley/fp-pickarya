import { useEffect, useState } from 'react';

const STATUS_LABEL = {
  waiting: 'Menunggu',
  accepted: 'Diterima Artist',
  rejected_by_artist: 'Ditolak Artist',
  buyer_confirmed_payment: '⏳ Menunggu Konfirmasi Bayar',
  paid_confirmed: '✅ Pembayaran Terkonfirmasi',
  result_uploaded: 'Hasil Diupload',
  revision_requested: 'Revisi Diminta',
  revision_uploaded: 'Revisi Diupload',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const STATUS_COLOR = {
  buyer_confirmed_payment: '#f6ad55',
  paid_confirmed: '#68d391',
  completed: '#63b3ed',
  cancelled: '#fc8181',
  rejected_by_artist: '#fc8181',
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('buyer_confirmed_payment');
  const [confirmingId, setConfirmingId] = useState(null);

  const token = sessionStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      window.location.href = '/admin';
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'x-admin-token': token },
      });
      if (res.status === 403) {
        window.location.href = '/admin';
        return;
      }
      const data = await res.json();
      setOrders(data);
    } catch {
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (orderId) => {
    if (!window.confirm('Konfirmasi pembayaran order ini?')) return;
    setConfirmingId(orderId);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/confirm-payment`, {
        method: 'PATCH',
        headers: { 'x-admin-token': token },
      });
      if (res.ok) {
        await fetchOrders();
        alert('✅ Pembayaran berhasil dikonfirmasi! Artist sudah bisa mengerjakan order.');
      }
    } catch {
      alert('Gagal konfirmasi');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    window.location.href = '/admin';
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>🛠 Pickarya Admin</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: 14 }}>{orders.length} total order</span>
          <button onClick={fetchOrders} style={styles.refreshBtn}>🔄 Refresh</button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.tabs}>
        {[
          { key: 'buyer_confirmed_payment', label: '⏳ Perlu Dikonfirmasi' },
          { key: 'paid_confirmed', label: '✅ Sudah Dikonfirmasi' },
          { key: 'all', label: 'Semua Order' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{ ...styles.tab, ...(filter === tab.key ? styles.tabActive : {}) }}
          >
            {tab.label}
            <span style={styles.tabCount}>
              {tab.key === 'all' ? orders.length : orders.filter(o => o.status === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {loading ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>Tidak ada order di kategori ini.</p>
        ) : (
          filtered.map(order => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
                  <span style={{ ...styles.statusBadge, background: STATUS_COLOR[order.status] || '#e2e8f0' }}>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>
                <span style={styles.date}>
                  {new Date(order.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Buyer</span>
                    <span style={styles.infoValue}>{order.buyer}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Artist</span>
                    <span style={styles.infoValue}>{order.artist}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Produk</span>
                    <span style={styles.infoValue}>{order.product}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Total Harga</span>
                    <span style={{ ...styles.infoValue, fontWeight: 700, color: '#1a1a1a' }}>
                      {order.totalPrice && order.totalPrice !== '' && order.totalPrice !== 'null'
                       ? `Rp ${Number(String(order.totalPrice).replace(/[^0-9]/g, '')).toLocaleString('id-ID')}`
                       : '-'}
                    </span>
                  </div>
                </div>

                {order.paymentProofLink && (
                  <div style={styles.proofBox}>
                    <span style={styles.infoLabel}>Bukti Pembayaran (GDrive)</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                      <span style={styles.linkText}>{order.paymentProofLink}</span>
                      <a
                        href={order.paymentProofLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.openLinkBtn}
                      >
                        Buka Link ↗
                      </a>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <span style={styles.infoLabel}>Deskripsi Order</span>
                  <p style={styles.desc}>{order.description}</p>
                </div>
              </div>

              {order.status === 'buyer_confirmed_payment' && (
                <div style={styles.cardFooter}>
                  <button
                    onClick={() => handleConfirmPayment(order._id)}
                    disabled={confirmingId === order._id}
                    style={styles.confirmBtn}
                  >
                    {confirmingId === order._id ? 'Mengkonfirmasi...' : '✅ Konfirmasi Pembayaran'}
                  </button>
                  <span style={styles.confirmNote}>
                    Pastikan uang sudah masuk ke rekening Pickarya sebelum konfirmasi.
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#f7f8fa', fontFamily: 'sans-serif' },
  header: {
    background: '#fff', borderBottom: '1px solid #eee',
    padding: '16px 32px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    position: 'sticky', top: 0, zIndex: 10,
  },
  headerTitle: { fontWeight: 700, fontSize: 18, color: '#1a1a1a' },
  refreshBtn: { padding: '7px 14px', background: '#f0f0f0', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  logoutBtn: { padding: '7px 14px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  tabs: { display: 'flex', gap: 8, padding: '20px 32px 0', borderBottom: '1px solid #eee', background: '#fff' },
  tab: { padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: '#666', borderBottom: '2px solid transparent', display: 'flex', gap: 8, alignItems: 'center' },
  tabActive: { color: '#1a1a1a', fontWeight: 600, borderBottom: '2px solid #1a1a1a' },
  tabCount: { background: '#eee', borderRadius: 20, padding: '1px 8px', fontSize: 12 },
  content: { maxWidth: 800, margin: '0 auto', padding: '24px 32px' },
  card: { background: '#fff', borderRadius: 12, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' },
  orderId: { fontWeight: 700, fontSize: 13, color: '#555', marginRight: 10 },
  statusBadge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  date: { color: '#aaa', fontSize: 13 },
  cardBody: { padding: '16px 20px' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 12 },
  infoItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  infoLabel: { fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, color: '#333' },
  proofBox: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', marginTop: 10 },
  linkText: { fontSize: 12, color: '#555', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 },
  openLinkBtn: { padding: '5px 12px', background: '#1a1a1a', color: '#fff', borderRadius: 6, fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap' },
  desc: { fontSize: 13, color: '#555', marginTop: 4, lineHeight: 1.5 },
  cardFooter: { padding: '14px 20px', borderTop: '1px solid #f0f0f0', background: '#f9fffe', display: 'flex', alignItems: 'center', gap: 14 },
  confirmBtn: { padding: '10px 20px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' },
  confirmNote: { fontSize: 12, color: '#888', lineHeight: 1.4 },
};