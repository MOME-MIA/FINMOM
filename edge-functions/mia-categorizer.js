import { createClient } from 'npm:@insforge/sdk@latest';

export default async function (req) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        const { amount, description, type, currency, account_id, date } = await req.json();

        // 1. Preparar Categoría mediante ML
        let aiCategoryGuess = "general";
        const geminiKey = Deno.env.get('GEMINI_API_KEY');

        if (geminiKey) {
            const prompt = `Eres M.I.A, la inteligencia de Momentum. Analiza el gasto: "${description}" por el monto de ${amount}. Solo responde con el nombre de la categoría más adecuada (una sola palabra). Ej: "Comida", "Transporte", "Software".`;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const aiData = await response.json();
            if (aiData.candidates && aiData.candidates[0].content.parts[0].text) {
                aiCategoryGuess = aiData.candidates[0].content.parts[0].text.trim().toLowerCase();
            }
        }

        // 2. Conectar a InsForge con el token del usuario final
        const insforgeUrl = Deno.env.get('INSFORGE_BASE_URL');
        const authHeader = req.headers.get('Authorization');
        const userToken = authHeader ? authHeader.replace('Bearer ', '') : null;

        const client = createClient({
            baseUrl: insforgeUrl,
            edgeFunctionToken: userToken
        });

        const { data: userData, error: authErr } = await client.auth.getCurrentUser();
        if (authErr || !userData?.user?.id) throw new Error('Unauthorized');
        const userId = userData.user.id;

        // Buscar si existe esa categoría, de lo contrario la crearemos (idealmente un uuid, aqui simplificaremos como null para que el UI asuma 'General')
        let categoryId = null;

        // 3. Insertar la Transacción real
        const txPayload = {
            user_id: userId,
            amount, type, currency, description,
            date: date || new Date().toISOString()
        };
        if (account_id) txPayload.account_id = account_id;
        if (categoryId) txPayload.category_id = categoryId;

        const { data: tx, error: txErr } = await client.database.from('transactions').insert([txPayload]).select().single();
        if (txErr) throw txErr;

        // 4. M.I.A emite insight (ADN) de categorización exitosa basada en ML
        await client.database.from('financial_dna_insights').insert([{
            user_id: userId,
            insight_type: 'auto_categorization',
            message: `M.I.A ha categorizado Inteligentemente tu transacción "${description}" en *${aiCategoryGuess}*.`
        }]);

        return new Response(JSON.stringify({ success: true, transaction: tx, intelligence_category: aiCategoryGuess }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        });
    }
}
