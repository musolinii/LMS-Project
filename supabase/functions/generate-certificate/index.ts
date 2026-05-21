import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: req.headers.get("Authorization")! } },
      }
    );

    const { course_id } = await req.json();

    if (!course_id) {
      return new Response(
        JSON.stringify({ error: "course_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    // Get course details
    const { data: course } = await supabase
      .from("courses")
      .select("title, instructor_id")
      .eq("id", course_id)
      .single();

    // Get instructor name
    const { data: instructor } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", course?.instructor_id)
      .single();

    // Verify enrollment is completed
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("status, completed_at")
      .eq("student_id", user.id)
      .eq("course_id", course_id)
      .single();

    if (!enrollment || enrollment.status !== "completed") {
      return new Response(
        JSON.stringify({ error: "Course not completed yet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate certificate data
    const certificate = {
      id: crypto.randomUUID(),
      student_name: profile?.full_name || "Student",
      course_title: course?.title || "Course",
      instructor_name: instructor?.full_name || "Instructor",
      completion_date: enrollment.completed_at || new Date().toISOString(),
      issued_at: new Date().toISOString(),
      verification_url: `${Deno.env.get("SUPABASE_URL")}/certificates/verify/${crypto.randomUUID()}`,
    };

    return new Response(
      JSON.stringify({ message: "Certificate generated", certificate }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
