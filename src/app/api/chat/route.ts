import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, context } = body;

        // 1. Authenticate user
        const { data: sessionData } = await insforge.auth.getCurrentSession();
        if (!sessionData.session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = sessionData.session.user.id;

        // 2. Check MIA Credits
        const { data: profile, error: profileError } = await insforge.database
            .from('profiles')
            .select('mia_credits, subscription_tier')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            console.error("Error fetching profile credits", profileError);
            return NextResponse.json({ error: "No se encontró el perfil" }, { status: 404 });
        }

        if (Number(profile.mia_credits) <= 0) {
            return NextResponse.json({
                error: "Límite de M.I.A alcanzado",
                code: "INSUFFICIENT_CREDITS",
                message: "Has consumido todos tus créditos de inteligencia artificial para este ciclo. Actualiza tu plan para seguir utilizando a M.I.A."
            }, { status: 402 }); // 402 Payment Required
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            tools: [{
                functionDeclarations: [
                    {
                        name: "navigateTo",
                        description: "Navega al usuario a una sección específica de la aplicación móvil (ej. Home '/', Gastos '/expenses', Crypto '/crypto', Añadir Gasto '/add', Analítica '/analytics', Presupuestos '/budgets', Historial '/history', Auditoria '/audit'). Úsalo SIEMPRE que el usuario te pida ir o abrir una pantalla en particular.",
                        parameters: {
                            type: SchemaType.OBJECT,
                            properties: {
                                route: {
                                    type: SchemaType.STRING,
                                    description: "La ruta estricta autorizada de destino (/, /expenses, /crypto, /add, /analytics, /budgets, /history, /audit)."
                                }
                            },
                            required: ["route"]
                        }
                    },
                    {
                        name: "createTransaction",
                        description: "Crea una nueva transacción financiera (gasto, ingreso, ahorro, etc.) y la guarda estructuralmente en la base de datos. Úsalo SOLO cuando el usuario te indique explícitamente que realizó un movimiento (ej. 'gasté 30 lucas en sushi', 'me pagaron el sueldo').",
                        parameters: {
                            type: SchemaType.OBJECT,
                            properties: {
                                amountARS: {
                                    type: SchemaType.NUMBER,
                                    description: "El monto exacto en pesos argentinos (ARS). Si el usuario mencionó dólares sin aclarar pesos, asume 0 o haz la conversión estimada."
                                },
                                amountUSD: {
                                    type: SchemaType.NUMBER,
                                    description: "El monto en dólares (USD). Si el usuario habló en pesos, pon 0."
                                },
                                type: {
                                    type: SchemaType.STRING,
                                    description: "El tipo de transacción financiero estrictamente formateado. Debe ser exactamente UNO de los siguientes strings sin equivocarse: 'Ingreso', 'Gasto Fijo', 'Gasto Semanal', 'Ahorro', 'Inversión', 'Transferencia'."
                                },
                                category: {
                                    type: SchemaType.STRING,
                                    description: "La categoría genérica o entidad del gasto/ingreso (ej. 'Comida', 'Transporte', 'Sueldo', 'Varios', 'Coto')."
                                },
                                description: {
                                    type: SchemaType.STRING,
                                    description: "Una breve descripción o título semántico de la transacción (ej. 'Supermercado Coto', 'Sueldo mensual octubre', 'Salida con amigos')."
                                },
                                date: {
                                    type: SchemaType.STRING,
                                    description: "La fecha ISO estricta o formateada en la que ocurrió, asume la fecha actual usando YYYY-MM-DD si no especificó otra."
                                }
                            },
                            required: ["amountARS", "type", "category", "description", "date"]
                        }
                    }
                ]
            }]
        });

        const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });

        const systemPrompt = `Sos M.I.A., la Compañera Virtual Financiera de élite (Warm Authority) del ecosistema premium FINMOM.
Tono: Profesional, empático, altamente seguro, ultra-conciso y argentino (vos/tenés). Actúas como un 'Behavioral Coach' financiero.
Reglas estrictas del Persona:
1. Cero Juicios: NUNCA juzgues emociones o gastos. Sé empática y orientada a soluciones (ej. 'Ajustemos la estrategia' en vez de 'Gastaste de más'). Alivia la ansiedad financiera.
2. Minimalismo Cognitivo: Respuestas directas, al grano. Sin emojis.
3. Transparencia (XAI): Usa Markdown religiosamente. Resalta números, métricas (KPIs) y conceptos clave en **negrita**. Si recomiendas algo, explica brevemente el 'por qué' lógico-cuantitativo.
7. Acción Proactiva: Si detectas un patrón de gasto o reporta algo, sugiere sutilmente el siguiente paso lógico para preservar su patrimonio.
8. Herramientas Mágicas: Si pide ver una pantalla → ejecuta navigateTo. Si reporta un movimiento de dinero → ejecuta createTransaction INMEDIATAMENTE sin pedir permiso.
9. Generative UI (Widgets): NUNCA devuelvas tablas de texto plano. INVOCARÁS SIEMPRE interfaces visuales interactivas respondiendo estrictamente con un bloque de código markdown usando el lenguaje 'widget' y un JSON válido. Formatos exactos:
   - Análisis de Gasto: \`\`\`widget\n{"type": "spending", "amount": 1500, "description": "Suscripciones Mensuales", "trend": "up", "percentage": 12}\n\`\`\`
   - Progreso de Ahorro: \`\`\`widget\n{"type": "savings", "goalName": "Fondo de Emergencia", "currentAmount": 2000, "targetAmount": 5000, "progress": 40}\n\`\`\`
   - Alerta/Anomalía: \`\`\`widget\n{"type": "anomaly", "message": "Tu gasto fijo superó el 60%.", "actionText": "Revisar Presupuesto"}\n\`\`\`
Hoy es: ${currentDate}.
Contexto Financiero Global del Usuario: ${typeof context === 'object' ? JSON.stringify(context, null, 2) : context}`;

        // Cap history to last 4 messages to save tokens
        let formattedHistory = messages.slice(-5, -1).map((m: any) => ({
            role: m.role,
            parts: [{ text: m.content || " " }]
        }));

        // Gemini strictly requires the first message in the history to be from the 'user'
        // Since ChatAssistant starts with a default 'model' greeting, we must strip it if it's the first element.
        while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 500,
            }
        });

        // We append the system prompt invisibly to the user's latest message to guide the assistant
        const latestMessage = messages[messages.length - 1].content;
        const prompt = `${systemPrompt}\n\nPetición del usuario: ${latestMessage}`;

        const result = await chat.sendMessage(prompt);
        const responseText = result.response.text();
        const functionCalls = result.response.functionCalls();

        // 3. Deduct credit
        await insforge.database
            .from('profiles')
            .update({ mia_credits: Number(profile.mia_credits) - 1 })
            .eq('id', userId);

        return NextResponse.json({
            response: responseText,
            functionCalls: functionCalls || null,
            remainingCredits: Number(profile.mia_credits) - 1
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Sistemas de IA offline." }, { status: 500 });
    }
}
