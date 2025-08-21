import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting cleanup of expired content...')

    // Delete expired posts (this will cascade to comments and reactions)
    const { data: deletedPosts, error: postsError } = await supabase
      .from('posts')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id')

    if (postsError) {
      console.error('Error deleting expired posts:', postsError)
      throw postsError
    }

    // Delete expired comments that might not have been cascaded
    const { data: deletedComments, error: commentsError } = await supabase
      .from('comments')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id')

    if (commentsError) {
      console.error('Error deleting expired comments:', commentsError)
      throw commentsError
    }

    // Delete expired reactions that might not have been cascaded
    const { data: deletedReactions, error: reactionsError } = await supabase
      .from('reactions')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id')

    if (reactionsError) {
      console.error('Error deleting expired reactions:', reactionsError)
      throw reactionsError
    }

    const result = {
      success: true,
      deleted: {
        posts: deletedPosts?.length || 0,
        comments: deletedComments?.length || 0,
        reactions: deletedReactions?.length || 0
      },
      timestamp: new Date().toISOString()
    }

    console.log('Cleanup completed:', result)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in cleanup-expired function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to cleanup expired content',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})