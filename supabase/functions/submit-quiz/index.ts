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

    const { quiz_id, answers } = await req.json();

    if (!quiz_id || !answers || !Array.isArray(answers)) {
      return new Response(
        JSON.stringify({ error: "quiz_id and answers array are required" }),
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

    // Get quiz details
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id, pass_percentage, is_published")
      .eq("id", quiz_id)
      .single();

    if (quizError || !quiz) {
      return new Response(
        JSON.stringify({ error: "Quiz not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!quiz.is_published) {
      return new Response(
        JSON.stringify({ error: "Quiz is not available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get quiz questions
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("id, correct_answer, points")
      .eq("quiz_id", quiz_id)
      .order("sort_order");

    if (questionsError) throw questionsError;

    // Grade the quiz
    let score = 0;
    let totalPoints = 0;
    const gradedAnswers = answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.question_id);
      if (!question) return { ...answer, correct: false, points_earned: 0 };

      totalPoints += question.points;
      const isCorrect =
        question.correct_answer.toLowerCase().trim() ===
        (answer.answer || "").toLowerCase().trim();

      if (isCorrect) score += question.points;

      return {
        ...answer,
        correct: isCorrect,
        points_earned: isCorrect ? question.points : 0,
      };
    });

    // Calculate totals from all questions (even unanswered)
    const fullTotalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = fullTotalPoints > 0 ? (score / fullTotalPoints) * 100 : 0;
    const passed = percentage >= quiz.pass_percentage;

    // Record the attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({
        quiz_id,
        student_id: user.id,
        answers: gradedAnswers,
        score,
        total_points: fullTotalPoints,
        passed,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (attemptError) throw attemptError;

    return new Response(
      JSON.stringify({
        message: passed ? "Congratulations! You passed!" : "Better luck next time!",
        attempt,
        percentage: Math.round(percentage * 100) / 100,
        passed,
        score,
        total_points: fullTotalPoints,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
