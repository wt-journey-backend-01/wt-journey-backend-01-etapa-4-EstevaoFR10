async function testarAPI() {
    try {
        console.log('🧪 Testando apenas o endpoint /usuarios/me...\n');
        
        // 1. Fazer login primeiro
        console.log('1. Fazendo login...');
        const loginResponse = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@policia.gov.br',
                senha: 'Admin@123'
            })
        });
        
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            const token = loginData.access_token;
            console.log('✅ Login bem-sucedido!');
            
            // 2. Testar endpoint /usuarios/me
            console.log('\n2. Testando endpoint /usuarios/me...');
            const usuariosMeResponse = await fetch('http://localhost:3000/usuarios/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Status /usuarios/me:', usuariosMeResponse.status);
            if (usuariosMeResponse.ok) {
                const userData = await usuariosMeResponse.json();
                console.log('✅ /usuarios/me funcionou!', userData);
            } else {
                const error = await usuariosMeResponse.text();
                console.log('❌ /usuarios/me erro:', error);
            }
        } else {
            console.log('❌ Falha no login:', loginResponse.status);
            const error = await loginResponse.text();
            console.log('Erro:', error);
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

testarAPI();
