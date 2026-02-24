const { createClient } = require('@supabase/supabase-js')
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

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY missing')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const admins = [
    { name: 'Luis', email: 'luis@cimapropiedades.mx', id: '505b47be-c704-4ecb-a2be-458750dc4d0e' },
    { name: 'Yair', email: 'yair@cimapropiedades.mx', id: '99deb334-b743-4776-b940-2c3300954a4d' },
    { name: 'Stefano', email: 'stefano@cimapropiedades.mx', id: '49d8af16-6bb6-4bcd-8d74-af0907c4bb62' }
]

async function run() {
    console.log('--- Restableciendo Contraseñas de Admins ---')

    for (const admin of admins) {
        const tempPass = Math.random().toString(36).slice(-8) + 'Cima1!'
        console.log(`Actualizando a ${admin.name} (${admin.email})...`)

        const { error } = await supabase.auth.admin.updateUserById(admin.id, {
            password: tempPass
        })

        if (error) {
            console.error(`Error actualizando a ${admin.name}:`, error.message)
        } else {
            console.log(`- ${admin.name}: ${tempPass}`)
        }
    }
    console.log('\n--- PROCESO COMPLETADO ---')
}

run()
