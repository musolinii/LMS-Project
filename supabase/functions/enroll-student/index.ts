import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
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

    // Check if course exists and is published
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, status, title")
      .eq("id", course_id)
      .single();

    if (courseError || !course) {
      return new Response(
        JSON.stringify({ error: "Course not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (course.status !== "published") {
      return new Response(
        JSON.stringify({ error: "Course is not available for enrollment" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id, status")
      .eq("student_id", user.id)
      .eq("course_id", course_id)
      .single();

    if (existing) {
      if (existing.status === "active") {
        return new Response(
          JSON.stringify({ error: "Already enrolled in this course" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Re-activate dropped enrollment
      const { data: updated, error: updateError } = await supabase
        .from("enrollments")
        .update({ status: "active", completed_at: null })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({ message: "Re-enrolled successfully", enrollment: updated }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new enrollment
    const { data: enrollment, error: enrollError } = await supabase
      .from("enrollments")
      .insert({ student_id: user.id, course_id })
      .select()
      .single();

    if (enrollError) throw enrollError;

    return new Response(
      JSON.stringify({ message: "Enrolled successfully", enrollment }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
