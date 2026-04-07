'use client';

export default function Muzakere() {
  return (
    <div className="fondaco-panel">
      <div className="section-head">
        <h2>🤝 Müzakere</h2>
      </div>
      <p className="note">
        Diğer kaptanlarla veya NPC&apos;lerle diplomatik görüşmeler yap.
      </p>

      <div className="chat-placeholder">
        <div className="chat-tabs">
          <button className="chat-tab active">Genel</button>
          <button className="chat-tab">Özel Mesaj</button>
        </div>
        <div className="chat-body">
          <p className="chat-system-msg">
            💬 Müzakere sistemi çok oyunculu modda aktif olacak.
          </p>
          <p className="chat-system-msg">
            Tek oyunculu modda NPC diyalogları burada görünecek.
          </p>
        </div>
        <div className="chat-input-row">
          <input className="chat-input" type="text" placeholder="Mesaj yaz..." disabled />
          <button disabled>Gönder</button>
        </div>
      </div>
    </div>
  );
}
