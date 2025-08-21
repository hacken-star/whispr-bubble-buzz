import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ModerationRequest {
  content: string
  type: 'post' | 'comment'
}

interface OpenAIModerationResponse {
  results: Array<{
    flagged: boolean
    categories: {
      sexual: boolean
      hate: boolean
      harassment: boolean
      'self-harm': boolean
      'sexual/minors': boolean
      'hate/threatening': boolean
      'violence/graphic': boolean
      'self-harm/intent': boolean
      'self-harm/instructions': boolean
      'harassment/threatening': boolean
      violence: boolean
    }
  }>
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, type }: ModerationRequest = await req.json()

    if (!content || !content.trim()) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get OpenAI API key from secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Call OpenAI Moderation API
    const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: content,
      }),
    })

    if (!moderationResponse.ok) {
      console.error('OpenAI moderation failed:', await moderationResponse.text())
      return new Response(
        JSON.stringify({ error: 'Content moderation failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const moderationResult: OpenAIModerationResponse = await moderationResponse.json()
    const isBlocked = moderationResult.results[0]?.flagged || false

    console.log(`Content moderation result for ${type}:`, {
      flagged: isBlocked,
      categories: moderationResult.results[0]?.categories
    })

    return new Response(
      JSON.stringify({
        approved: !isBlocked,
        flagged: isBlocked,
        categories: moderationResult.results[0]?.categories || {},
        message: isBlocked 
          ? 'Content violates community guidelines and cannot be posted.'
          : 'Content approved for posting.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in moderate-content function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error during content moderation' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})