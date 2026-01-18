import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email, fullName }: WelcomeEmailRequest = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
          .header p { color: rgba(255,255,255,0.9); margin-top: 10px; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1e293b; margin-top: 0; }
          .content p { color: #64748b; line-height: 1.6; }
          .features { margin: 30px 0; }
          .feature { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; }
          .feature h3 { margin: 0 0 5px 0; color: #1e293b; font-size: 16px; }
          .feature p { margin: 0; color: #64748b; font-size: 14px; }
          .cta { text-align: center; margin-top: 30px; }
          .cta a { background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
          .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Welcome to Brainware!</h1>
            <p>Your Campus Marketplace</p>
          </div>
          <div class="content">
            <h2>Hi ${fullName || "there"}! 👋</h2>
            <p>We're thrilled to have you join the Brainware Marketplace community! You're now part of a trusted network of students buying, selling, and connecting on campus.</p>
            
            <div class="features">
              <div class="feature">
                <h3>🛒 Buy & Sell</h3>
                <p>Find amazing deals on textbooks, electronics, furniture, and more from fellow students.</p>
              </div>
              <div class="feature">
                <h3>💼 Offer Services</h3>
                <p>Share your skills! Tutoring, design, development - monetize your talents.</p>
              </div>
              <div class="feature">
                <h3>🔒 Safe & Verified</h3>
                <p>All users are verified campus members for secure transactions.</p>
              </div>
            </div>

            <div class="cta">
              <a href="https://brainware-marketplace.lovable.app">Start Exploring →</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Brainware Marketplace. Made with ❤️ for students.</p>
            <p>This is a test email from panchu7216@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Brainware Marketplace <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Brainware Marketplace! 🎓",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Welcome email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);