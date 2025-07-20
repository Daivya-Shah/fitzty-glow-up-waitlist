
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { imageBase64, description, userId } = await req.json();
    
    console.log('Generating avatar for user:', userId);

    // First, analyze the clothing image with GPT-4 Vision to get detailed description
    console.log('Analyzing clothing image with GPT-4 Vision...');
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this clothing item image in extreme detail. Describe the exact clothing item, including: type of garment, color, pattern, texture, style, fit, any logos or text, decorative elements, fabric appearance, and any unique features. Be very specific and detailed as this description will be used to recreate the exact same clothing item on an avatar.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      }),
    });

    if (!visionResponse.ok) {
      const visionError = await visionResponse.text();
      console.error('GPT-4 Vision API error:', visionError);
      throw new Error(`Vision analysis failed: ${visionResponse.status} - ${visionError}`);
    }

    const visionData = await visionResponse.json();
    const detailedClothingDescription = visionData.choices[0].message.content;
    
    console.log('Clothing analysis complete:', detailedClothingDescription);

    // Generate avatar wearing the exact clothing item using DALL-E 3
    console.log('Generating avatar with DALL-E 3...');
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Create a single 2D fashion avatar showing ONE PERSON ONLY wearing this exact clothing item: ${detailedClothingDescription}. Requirements: 1) Show exactly ONE person, not multiple people or duplicates 2) The person should be wearing the EXACT same clothing item as described in detail 3) Clean white studio background 4) Professional fashion photography style 5) Good lighting showcasing the clothing 6) Modern attractive person 7) Full body or 3/4 view to show the complete clothing item clearly. Make it look exactly like a fashion closet app avatar.`,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const generatedImageUrl = data.data[0].url;
    
    console.log('Avatar generated successfully');

    // Download the generated image
    const imageResponse = await fetch(generatedImageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image');
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageFile = new Uint8Array(imageBuffer);

    // Upload to Supabase storage
    const fileName = `${userId}/${crypto.randomUUID()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wardrobes')
      .upload(fileName, imageFile, {
        contentType: 'image/png'
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('wardrobes')
      .getPublicUrl(fileName);

    // Save to database
    const { data: dbData, error: dbError } = await supabase
      .from('wardrobes')
      .insert({
        user_id: userId,
        image_url: urlData.publicUrl,
        description: description || 'AI-generated avatar wearing uploaded item'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw dbError;
    }

    console.log('Avatar saved to wardrobe successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      wardrobeItem: dbData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-avatar function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate avatar' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
