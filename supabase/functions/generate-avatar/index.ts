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

    // Generate avatar wearing the clothing item
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `Create a stylish fashion avatar wearing the clothing item or accessory from the provided image. The avatar should be a modern, attractive person in a clean studio setting, showcasing the fashion item prominently. Style: professional fashion photography, clean background, good lighting. The description of the item is: ${description || 'fashion item'}`,
        n: 1,
        size: '1024x1024',
        quality: 'high'
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate avatar image');
    }

    const data = await response.json();
    const generatedImageUrl = data.data[0].url;
    
    console.log('Avatar generated successfully');

    // Download the generated image
    const imageResponse = await fetch(generatedImageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageFile = new Uint8Array(imageBuffer);

    // Upload to Supabase storage
    const fileName = `${userId}/${crypto.randomUUID()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wardrobes')
      .upload(fileName, imageFile, {
        contentType: 'image/jpeg'
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