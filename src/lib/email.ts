import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send verification result email to seller
 * @param to - Seller email address
 * @param sellerName - Seller name
 * @param status - 'verified' or 'rejected'
 * @param reason - Rejection reason (optional, only for rejected)
 */
export async function sendVerificationEmail(
  to: string,
  sellerName: string,
  status: 'verified' | 'rejected',
  reason?: string
): Promise<void> {
  try {
    // Skip email if SMTP not configured (development mode)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('⚠️  SMTP not configured. Email notification skipped.');
      console.log(`📧 Would send to ${to}: Verification ${status}`);
      return;
    }

    let subject: string;
    let htmlContent: string;
    let textContent: string;

    if (status === 'verified') {
      subject = '✅ Akun Penjual Anda Telah Diverifikasi - Campus Market';
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .success-icon { font-size: 48px; margin-bottom: 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="success-icon">✅</div>
                <h1>Selamat, ${sellerName}!</h1>
              </div>
              <div class="content">
                <h2>Akun Penjual Anda Telah Diverifikasi</h2>
                <p>Halo <strong>${sellerName}</strong>,</p>
                <p>Kami dengan senang hati mengumumkan bahwa akun penjual Anda di <strong>Campus Market</strong> telah berhasil diverifikasi oleh tim admin kami.</p>
                
                <h3>Apa Selanjutnya?</h3>
                <ul>
                  <li>✅ Login ke akun Anda dengan email dan password yang telah didaftarkan</li>
                  <li>📦 Mulai upload produk yang ingin Anda jual</li>
                  <li>📊 Pantau penjualan Anda melalui dashboard seller</li>
                  <li>💰 Terima pesanan dari pembeli di seluruh Indonesia</li>
                </ul>
                
                <p style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login" class="button">
                    Login Sekarang
                  </a>
                </p>
                
                <p><strong>Informasi Akun:</strong></p>
                <ul>
                  <li>Email: ${to}</li>
                  <li>Status: Verified ✓</li>
                  <li>Tanggal Verifikasi: ${new Date().toLocaleDateString('id-ID', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</li>
                </ul>
                
                <p>Jika Anda memiliki pertanyaan atau butuh bantuan, jangan ragu untuk menghubungi tim support kami.</p>
                
                <p>Terima kasih telah bergabung dengan Campus Market!</p>
                
                <p>Salam,<br><strong>Tim Campus Market</strong></p>
              </div>
              <div class="footer">
                <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
                <p>&copy; ${new Date().getFullYear()} Campus Market. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
      textContent = `
Selamat, ${sellerName}!

Akun Penjual Anda Telah Diverifikasi

Halo ${sellerName},

Kami dengan senang hati mengumumkan bahwa akun penjual Anda di Campus Market telah berhasil diverifikasi oleh tim admin kami.

Apa Selanjutnya?
- Login ke akun Anda dengan email dan password yang telah didaftarkan
- Mulai upload produk yang ingin Anda jual
- Pantau penjualan Anda melalui dashboard seller
- Terima pesanan dari pembeli di seluruh Indonesia

Login di: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login

Informasi Akun:
- Email: ${to}
- Status: Verified
- Tanggal Verifikasi: ${new Date().toLocaleDateString('id-ID')}

Terima kasih telah bergabung dengan Campus Market!

Salam,
Tim Campus Market
      `;
    } else {
      // Rejected
      subject = '❌ Permohonan Verifikasi Akun Ditolak - Campus Market';
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .warning-icon { font-size: 48px; margin-bottom: 10px; }
              .reason-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="warning-icon">⚠️</div>
                <h1>Permohonan Verifikasi Ditolak</h1>
              </div>
              <div class="content">
                <p>Halo <strong>${sellerName}</strong>,</p>
                <p>Terima kasih atas minat Anda untuk menjadi penjual di <strong>Campus Market</strong>.</p>
                
                <p>Setelah melakukan peninjauan, kami mohon maaf untuk memberitahu bahwa permohonan verifikasi akun penjual Anda <strong>belum dapat kami setujui</strong> pada saat ini.</p>
                
                ${reason ? `
                <div class="reason-box">
                  <h3>📋 Alasan Penolakan:</h3>
                  <p><strong>${reason}</strong></p>
                </div>
                ` : ''}
                
                <h3>Apa yang Dapat Anda Lakukan?</h3>
                <ul>
                  <li>✅ Periksa kembali dokumen yang Anda upload (KTP, Foto PIC)</li>
                  <li>✅ Pastikan semua data yang diisi sudah benar dan lengkap</li>
                  <li>✅ Lengkapi informasi toko dengan lebih detail</li>
                  <li>✅ Daftar ulang dengan informasi yang diperbaiki</li>
                </ul>
                
                <p style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/register" class="button">
                    Daftar Ulang
                  </a>
                </p>
                
                <p>Jika Anda memiliki pertanyaan atau butuh klarifikasi lebih lanjut, silakan hubungi tim support kami.</p>
                
                <p>Terima kasih atas pengertian Anda.</p>
                
                <p>Salam,<br><strong>Tim Campus Market</strong></p>
              </div>
              <div class="footer">
                <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
                <p>&copy; ${new Date().getFullYear()} Campus Market. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
      textContent = `
Permohonan Verifikasi Ditolak

Halo ${sellerName},

Terima kasih atas minat Anda untuk menjadi penjual di Campus Market.

Setelah melakukan peninjauan, kami mohon maaf untuk memberitahu bahwa permohonan verifikasi akun penjual Anda belum dapat kami setujui pada saat ini.

${reason ? `Alasan Penolakan:\n${reason}\n` : ''}

Apa yang Dapat Anda Lakukan?
- Periksa kembali dokumen yang Anda upload (KTP, Foto PIC)
- Pastikan semua data yang diisi sudah benar dan lengkap
- Lengkapi informasi toko dengan lebih detail
- Daftar ulang dengan informasi yang diperbaiki

Daftar ulang di: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/register

Jika Anda memiliki pertanyaan, silakan hubungi tim support kami.

Terima kasih atas pengertian Anda.

Salam,
Tim Campus Market
      `;
    }

    await transporter.sendMail({
      from: `"Campus Market" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`✅ Verification email sent to ${to} (${status})`);
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    // Don't throw error - email is nice to have but not critical
  }
}

/**
 * Send thank you email after rating submission
 * @param to - User email address
 * @param userName - User name
 * @param productName - Product name that was rated
 * @param rating - Rating value (1-5)
 */
export async function sendRatingThankYouEmail(
  to: string,
  userName: string,
  productName: string,
  rating: number
): Promise<void> {
  try {
    // Skip email if SMTP not configured (development mode)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('⚠️  SMTP not configured. Email notification skipped.');
      console.log(`📧 Would send thank you to ${to} for rating ${productName}`);
      return;
    }

    const stars = '⭐'.repeat(rating);

    const subject = '💖 Terima Kasih atas Rating Anda - Campus Market';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .heart-icon { font-size: 48px; margin-bottom: 10px; }
            .rating-box { background: white; border: 2px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 10px; text-align: center; }
            .stars { font-size: 32px; color: #ffd700; margin: 10px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="heart-icon">💖</div>
              <h1>Terima Kasih, ${userName}!</h1>
            </div>
            <div class="content">
              <h2>Kami Sangat Menghargai Feedback Anda</h2>
              <p>Halo <strong>${userName}</strong>,</p>
              <p>Terima kasih telah memberikan rating dan komentar untuk produk di <strong>Campus Market</strong>. Feedback Anda sangat berharga bagi kami dan membantu pembeli lain dalam membuat keputusan.</p>
              
              <div class="rating-box">
                <p><strong>Produk yang Anda rating:</strong></p>
                <h3>${productName}</h3>
                <div class="stars">${stars}</div>
                <p>Rating: ${rating}/5</p>
              </div>
              
              <h3>Mengapa Feedback Anda Penting?</h3>
              <ul>
                <li>🎯 Membantu pembeli lain menemukan produk berkualitas</li>
                <li>💡 Memberikan insight berharga untuk penjual</li>
                <li>🏆 Meningkatkan kualitas marketplace kami</li>
                <li>🤝 Membangun komunitas yang lebih baik</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/catalog" class="button">
                  Jelajahi Produk Lainnya
                </a>
              </p>
              
              <p>Kami berharap Anda terus menemukan produk-produk menarik di Campus Market. Jangan ragu untuk memberikan rating pada produk lain yang Anda minati!</p>
              
              <p>Terima kasih telah menjadi bagian dari komunitas Campus Market.</p>
              
              <p>Salam hangat,<br><strong>Tim Campus Market</strong></p>
            </div>
            <div class="footer">
              <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
              <p>&copy; ${new Date().getFullYear()} Campus Market. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    const textContent = `
Terima Kasih, ${userName}!

Kami Sangat Menghargai Feedback Anda

Halo ${userName},

Terima kasih telah memberikan rating dan komentar untuk produk di Campus Market. Feedback Anda sangat berharga bagi kami dan membantu pembeli lain dalam membuat keputusan.

Produk yang Anda rating:
${productName}
Rating: ${stars} (${rating}/5)

Mengapa Feedback Anda Penting?
- Membantu pembeli lain menemukan produk berkualitas
- Memberikan insight berharga untuk penjual
- Meningkatkan kualitas marketplace kami
- Membangun komunitas yang lebih baik

Jelajahi produk lainnya di: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/catalog

Terima kasih telah menjadi bagian dari komunitas Campus Market.

Salam hangat,
Tim Campus Market
    `;

    await transporter.sendMail({
      from: `"Campus Market" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`✅ Thank you email sent to ${to} for rating ${productName}`);
  } catch (error) {
    console.error('❌ Error sending thank you email:', error);
    // Don't throw error - email is nice to have but not critical
  }
}

/**
 * Send registration confirmation email
 * @param to - User email address
 * @param userName - User name
 * @param role - User role (pembeli or penjual)
 */
export async function sendRegistrationEmail(
  to: string,
  userName: string,
  role: string
): Promise<void> {
  try {
    // Skip email if SMTP not configured (development mode)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('⚠️  SMTP not configured. Email notification skipped.');
      console.log(`📧 Would send registration email to ${to}`);
      return;
    }

    const isPenjual = role === 'penjual';
    const subject = isPenjual 
      ? '🎉 Registrasi Berhasil - Menunggu Verifikasi Admin - Campus Market'
      : '🎉 Selamat Datang di Campus Market!';
    
    const htmlContent = isPenjual ? `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .welcome-icon { font-size: 48px; margin-bottom: 10px; }
            .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="welcome-icon">🎉</div>
              <h1>Registrasi Berhasil!</h1>
            </div>
            <div class="content">
              <h2>Selamat Datang, ${userName}!</h2>
              <p>Halo <strong>${userName}</strong>,</p>
              <p>Terima kasih telah mendaftar sebagai <strong>Penjual</strong> di <strong>Campus Market</strong>. Registrasi Anda telah berhasil dan saat ini sedang dalam proses verifikasi.</p>
              
              <div class="info-box">
                <h3>⏳ Status Akun: Menunggu Verifikasi</h3>
                <p>Tim admin kami akan segera meninjau dokumen dan informasi yang Anda berikan. Proses verifikasi biasanya memakan waktu 1-3 hari kerja.</p>
              </div>
              
              <h3>Apa yang Terjadi Selanjutnya?</h3>
              <ol>
                <li>📋 Admin akan meninjau dokumen KTP dan informasi toko Anda</li>
                <li>✅ Anda akan menerima email notifikasi hasil verifikasi</li>
                <li>🏪 Setelah diverifikasi, Anda dapat mulai mengelola toko dan upload produk</li>
              </ol>
              
              <p><strong>Informasi Akun:</strong></p>
              <ul>
                <li>Email: ${to}</li>
                <li>Status: Menunggu Verifikasi</li>
                <li>Tanggal Registrasi: ${new Date().toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</li>
              </ul>
              
              <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim support kami.</p>
              
              <p>Terima kasih telah bergabung dengan Campus Market!</p>
              
              <p>Salam,<br><strong>Tim Campus Market</strong></p>
            </div>
            <div class="footer">
              <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
              <p>&copy; ${new Date().getFullYear()} Campus Market. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .welcome-icon { font-size: 48px; margin-bottom: 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="welcome-icon">🎉</div>
              <h1>Selamat Datang!</h1>
            </div>
            <div class="content">
              <h2>Halo, ${userName}!</h2>
              <p>Terima kasih telah mendaftar sebagai <strong>Pembeli</strong> di <strong>Campus Market</strong>.</p>
              <p>Akun Anda telah berhasil dibuat dan siap digunakan!</p>
              
              <h3>Apa yang Bisa Anda Lakukan?</h3>
              <ul>
                <li>🛍️ Jelajahi ribuan produk dari berbagai penjual terpercaya</li>
                <li>🛒 Tambahkan produk favorit ke keranjang belanja</li>
                <li>💳 Checkout dan lakukan pembayaran dengan mudah</li>
                <li>⭐ Berikan rating dan review untuk produk yang dibeli</li>
                <li>📦 Lacak status pesanan Anda secara real-time</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login" class="button">
                  Login Sekarang
                </a>
              </p>
              
              <p><strong>Informasi Akun:</strong></p>
              <ul>
                <li>Email: ${to}</li>
                <li>Status: Aktif ✓</li>
                <li>Tanggal Registrasi: ${new Date().toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</li>
              </ul>
              
              <p>Selamat berbelanja di Campus Market!</p>
              
              <p>Salam,<br><strong>Tim Campus Market</strong></p>
            </div>
            <div class="footer">
              <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
              <p>&copy; ${new Date().getFullYear()} Campus Market. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = isPenjual ? `
Registrasi Berhasil - Menunggu Verifikasi Admin

Selamat Datang, ${userName}!

Halo ${userName},

Terima kasih telah mendaftar sebagai Penjual di Campus Market. Registrasi Anda telah berhasil dan saat ini sedang dalam proses verifikasi.

Status Akun: Menunggu Verifikasi
Tim admin kami akan segera meninjau dokumen dan informasi yang Anda berikan. Proses verifikasi biasanya memakan waktu 1-3 hari kerja.

Apa yang Terjadi Selanjutnya?
1. Admin akan meninjau dokumen KTP dan informasi toko Anda
2. Anda akan menerima email notifikasi hasil verifikasi
3. Setelah diverifikasi, Anda dapat mulai mengelola toko dan upload produk

Informasi Akun:
- Email: ${to}
- Status: Menunggu Verifikasi
- Tanggal Registrasi: ${new Date().toLocaleDateString('id-ID')}

Terima kasih telah bergabung dengan Campus Market!

Salam,
Tim Campus Market
    ` : `
Selamat Datang di Campus Market!

Halo, ${userName}!

Terima kasih telah mendaftar sebagai Pembeli di Campus Market.
Akun Anda telah berhasil dibuat dan siap digunakan!

Apa yang Bisa Anda Lakukan?
- Jelajahi ribuan produk dari berbagai penjual terpercaya
- Tambahkan produk favorit ke keranjang belanja
- Checkout dan lakukan pembayaran dengan mudah
- Berikan rating dan review untuk produk yang dibeli
- Lacak status pesanan Anda secara real-time

Login di: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login

Informasi Akun:
- Email: ${to}
- Status: Aktif
- Tanggal Registrasi: ${new Date().toLocaleDateString('id-ID')}

Selamat berbelanja di Campus Market!

Salam,
Tim Campus Market
    `;

    await transporter.sendMail({
      from: `"Campus Market" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`✅ Registration email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending registration email:', error);
    throw error; // Re-throw so the caller knows about the failure
  }
}

/**
 * Send email verification link
 * @param to - User email address
 * @param userName - User name
 * @param verificationToken - Verification token
 * @param verificationLink - Full verification link URL
 */
export async function sendEmailVerificationLink(
  to: string,
  userName: string,
  verificationLink: string
): Promise<void> {
  try {
    // Skip email if SMTP not configured (development mode)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('⚠️  SMTP not configured. Email notification skipped.');
      console.log(`📧 Would send verification link to ${to}: ${verificationLink}`);
      return;
    }

    const subject = '✉️ Verifikasi Email Anda - Campus Market';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .verify-icon { font-size: 48px; margin-bottom: 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; text-align: center; width: 200px; }
            .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .code-box { background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace; text-align: center; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="verify-icon">✉️</div>
              <h1>Verifikasi Email Anda</h1>
            </div>
            <div class="content">
              <h2>Halo, ${userName}!</h2>
              <p>Terima kasih telah mendaftar di <strong>Campus Market</strong>.</p>
              <p>Untuk menyelesaikan proses registrasi, silakan verifikasi email Anda dengan mengklik tombol di bawah:</p>
              
              <div style="text-align: center;">
                <a href="${verificationLink}" class="button">Verifikasi Email</a>
              </div>
              
              <p style="text-align: center; font-size: 12px;">Atau copy link berikut jika tombol tidak berfungsi:</p>
              <div class="code-box">
                ${verificationLink}
              </div>
              
              <div class="warning-box">
                <strong>⚠️ Perhatian Penting:</strong>
                <ul>
                  <li>Link verifikasi ini berlaku selama <strong>24 jam</strong></li>
                  <li>Jika link sudah kadaluarsa, Anda dapat mendaftar ulang</li>
                  <li>Jangan membagikan link ini kepada siapa pun</li>
                </ul>
              </div>
              
              <p>Jika Anda tidak mendaftar akun di Campus Market, abaikan email ini.</p>
              
              <p>Salam,<br><strong>Tim Campus Market</strong></p>
            </div>
            <div class="footer">
              <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
              <p>&copy; ${new Date().getFullYear()} Campus Market. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    const textContent = `
Verifikasi Email Anda

Halo, ${userName}!

Terima kasih telah mendaftar di Campus Market.

Untuk menyelesaikan proses registrasi, silakan verifikasi email Anda dengan mengklik link berikut:

${verificationLink}

Link verifikasi ini berlaku selama 24 jam.

Jika Anda tidak mendaftar akun di Campus Market, abaikan email ini.

Salam,
Tim Campus Market
    `;

    await transporter.sendMail({
      from: `"Campus Market" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`✅ Email verification link sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email verification link:', error);
    throw error;
  }
}
