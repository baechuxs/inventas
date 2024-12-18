async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('loginMessage');

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        messageDiv.style.display = 'block';

        if (data.success) {
            messageDiv.className = 'message-success';
            messageDiv.textContent = 'Login berhasil! Mengalihkan...';
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            messageDiv.className = 'message-error';
            messageDiv.textContent = data.message || 'Login gagal!';
        }
    } catch (error) {
        console.error('Login error:', error);
        messageDiv.style.display = 'block';
        messageDiv.className = 'message-error';
        messageDiv.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
    }

    return false;
}