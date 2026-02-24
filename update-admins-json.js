const fs = require('fs')
const path = require('path')

// Manually parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
    const [key, ...val] = line.split('=')
    if (key && val) env[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '')
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

const admins = [
    { name: 'Luis', email: 'luis@cimapropiedades.mx', id: '505b47be-c704-4ecb-a2be-458750dc4d0e' },
    { name: 'Yair', email: 'yair@cimapropiedades.mx', id: '99deb334-b743-4776-b940-2c3300954a4d' },
    { name: 'Stefano', email: 'stefano@cimapropiedades.mx', id: '49d8af16-6bb6-4bcd-8d74-af0907c4bb62' }
]

async function run() {
    const results = []

    for (const admin of admins) {
        const tempPass = Math.random().toString(36).slice(-8) + 'Cima1!'
        const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${admin.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey
            },
            body: JSON.stringify({ password: tempPass })
        })

        if (response.ok) {
            results.push({ name: admin.name, email: admin.email, password: tempPass })
        }
    }

    fs.writeFileSync('passwords.json', JSON.stringify(results, null, 2))
    console.log('Resultados guardados en passwords.json')
}

run()
