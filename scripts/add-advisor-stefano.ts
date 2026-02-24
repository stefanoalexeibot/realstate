import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
    const [key, ...val] = line.split('=')
    if (key && val) env[key.trim()] = val.join('=').trim()
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

async function run() {
    console.log('--- Agregando asesor Stefano ---')

    const agent = { name: 'Stefano', email: 'stefano@cimapropiedades.mx' }
    const tempPass = Math.random().toString(36).slice(-8) + 'A1!'

    console.log(`Creando a ${agent.name} (${agent.email})...`)

    const { data: user, error: userError } = await supabase.auth.admin.createUser({
        email: agent.email,
        password: tempPass,
        email_confirm: true,
        user_metadata: { name: agent.name }
    })

    if (userError) {
        console.error(`Error creando a ${agent.name}:`, userError.message)
        process.exit(1)
    }

    if (user.user) {
        const authId = user.user.id

        // Create profile
        const { error: pError } = await supabase.from('profiles').upsert({
            id: authId,
            role: 'agent',
            onboarding_completed: true
        })
        if (pError) console.error('Error profile:', pError.message)

        // Insert into re_agentes
        const { error: aError } = await supabase.from('re_agentes').insert({
            auth_id: authId,
            name: agent.name,
            email: agent.email,
            active: true
        })
        if (aError) console.error('Error re_agente:', aError.message)

        console.log('\n--- RESULTADO STEFANO ---')
        console.log(JSON.stringify({ name: agent.name, email: agent.email, password: tempPass }, null, 2))
    }
}

run()
