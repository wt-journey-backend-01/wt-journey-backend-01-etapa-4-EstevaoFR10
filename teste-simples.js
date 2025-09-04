const http = require('http');

// Função para fazer requisição HTTP simples
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: body ? JSON.parse(body) : null
                    });
                } catch {
                    resolve({
                        status: res.statusCode,
                        data: body
                    });
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testarEndpoint() {
    try {
        console.log('🧪 Testando /usuarios/me...\n');
        
        // 1. Registrar usuário
        console.log('1. Registrando usuário...');
        const registroOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const registroResult = await makeRequest(registroOptions, {
            nome: 'Teste Usuario',
            email: 'teste' + Date.now() + '@exemplo.com',
            senha: 'MinhaSenh@123'
        });
        
        console.log('Status registro:', registroResult.status);
        
        if (registroResult.status === 201) {
            // 2. Fazer login
            console.log('\n2. Fazendo login...');
            const loginOptions = {
                hostname: 'localhost',
                port: 3000,
                path: '/auth/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            const loginResult = await makeRequest(loginOptions, {
                email: registroResult.data.usuario.email,
                senha: 'MinhaSenh@123'
            });
            
            if (loginResult.status === 200) {
                const token = loginResult.data.access_token;
                console.log('✅ Login bem-sucedido!');
                
                // 3. Testar /usuarios/me
                console.log('\n3. Testando /usuarios/me...');
                const meOptions = {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/usuarios/me',
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                
                const meResult = await makeRequest(meOptions);
                console.log('Status /usuarios/me:', meResult.status);
                
                if (meResult.status === 200) {
                    console.log('✅ /usuarios/me funcionou!');
                    console.log('Dados:', meResult.data);
                } else {
                    console.log('❌ /usuarios/me falhou:', meResult.data);
                }
            } else {
                console.log('❌ Login falhou:', loginResult.status, loginResult.data);
            }
        } else {
            console.log('❌ Registro falhou:', registroResult.status, registroResult.data);
        }
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

testarEndpoint();
