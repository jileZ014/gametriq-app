
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to?: string;
  subject?: string;
  html?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function invoked");
    const { to = "jilez60202@gmail.com", subject = "Gametriq Email Delivery Test (Production)", html = "" }: EmailRequest = await req.json();
    
    console.log(`Attempting to send email to: ${to}, subject: ${subject}`);
    
    // Ensure API key is available
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("Has RESEND_API_KEY?", !!apiKey);
    
    if (!apiKey) {
      console.error("RESEND_API_KEY not found in environment");
      return new Response(
        JSON.stringify({ success: false, error: "Resend API key not configured" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    console.log("API key detected, preparing to send email via Resend API");
    
    const payload = {
      from: "noreply@gametriq.com", // Updated to use verified domain
      to: to,
      subject: subject,
      html: html || `
        <p>This is a live test email sent from Supabase using Resend with a verified domain.</p>
      `,
      text: "This is a live test email sent from Supabase using Resend with a verified domain."
    };
    
    console.log("Request payload:", JSON.stringify(payload, null, 2));
    
    // Call Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
    
    const responseData = await response.json();
    console.log("Resend API response:", JSON.stringify(responseData, null, 2));
    
    if (!response.ok) {
      console.error("Error from Resend API:", responseData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to send email via Resend API", 
          details: responseData 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status 
        }
      );
    }
    
    console.log("Email sent successfully via Resend API");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully", 
        result: responseData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
