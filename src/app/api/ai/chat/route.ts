import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json({ 
        response: "Maaf, konfigurasi AI belum diatur dengan benar. Silakan hubungi administrator." 
      }, { status: 500 });
    }

    const systemPrompt = `Kamu adalah asisten AI ahli gizi profesional yang membantu pengguna dengan pertanyaan seputar nutrisi, diet, dan kesehatan.

Pedoman:
- Berikan informasi yang akurat dan berbasis ilmiah
- Berikan saran yang praktis dan dapat diterapkan
- Bersikap mendukung dan memotivasi
- Sarankan konsultasi dengan profesional kesehatan untuk masalah serius
- Fokus pada pendekatan nutrisi yang seimbang dan berkelanjutan
- Pertimbangkan kebutuhan dan preferensi individu
- Hindari rekomendasi diet ekstrem atau fad diet
- Jawab dalam Bahasa Indonesia dengan ramah dan profesional

${context ? `Konteks tentang pengguna: ${context}` : ''}

Pertanyaan pengguna: ${message}

Berikan respons yang membantu dan profesional:`;

    const isDev = process.env.NODE_ENV === 'development';
    
    // First, get list of available models
    let availableModels: string[] = [];
    try {
      const modelsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`
      );
      
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        availableModels = modelsData.models
          ?.filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''))
          || [];
        
        if (isDev) {
          console.log(`📋 Found ${availableModels.length} available models`);
        }
      }
    } catch (err) {
      if (isDev) {
        console.log('⚠️  Using default models (could not fetch list)');
      }
    }

    // If no models found, use common defaults
    if (availableModels.length === 0) {
      availableModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    }
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    
    let text = null;
    let lastError = null;
    let successModel = '';
    
    // Try each available model
    for (const modelName of availableModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        text = response.text();
        
        if (text) {
          successModel = modelName;
          break;
        }
      } catch (err) {
        lastError = err;
        // Only log detailed errors in development
        if (isDev && availableModels.indexOf(modelName) < 3) {
          console.log(`⚠️  Model ${modelName} failed:`, err instanceof Error ? err.message.split('\n')[0] : 'Unknown error');
        }
      }
    }

    if (!text) {
      const errorMsg = lastError instanceof Error ? lastError.message : 'No response from Gemini';
      console.error('❌ All models failed. Last error:', errorMsg.split('\n')[0]);
      throw new Error(`All Gemini models failed. Last error: ${errorMsg}`);
    }

    if (isDev) {
      console.log(`✅ Chat response generated using ${successModel}`);
    }
    
    return NextResponse.json({ response: text.trim() });

  } catch (error: unknown) {
    const isDev = process.env.NODE_ENV === 'development';
    
    // Log error concisely
    let errorMessage = "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
    
    if (error instanceof Error) {
      // Only log full details in development
      if (isDev) {
        console.error('❌ Chat error:', error.message.split('\n')[0]);
      } else {
        console.error('❌ Chat error occurred');
      }
      
      // Check for specific error types
      if (error.message.includes('API key')) {
        errorMessage = "Konfigurasi API key tidak valid. Silakan periksa pengaturan.";
      } else if (error.message.includes('quota')) {
        errorMessage = "Kuota API telah habis. Silakan coba lagi nanti.";
      } else if (error.message.includes('network')) {
        errorMessage = "Masalah koneksi jaringan. Silakan coba lagi.";
      }
    } else {
      console.error('❌ Unknown error occurred');
    }
    
    return NextResponse.json({ 
      response: `${errorMessage}\n\nNamun, saya dapat memberikan saran umum: Diet seimbang dengan banyak buah-buahan, sayuran, biji-bijian utuh, dan protein tanpa lemak selalu menjadi fondasi yang baik untuk pola makan sehat!` 
    });
  }
}