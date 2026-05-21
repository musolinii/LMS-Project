const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, subject, template, data } = await req.json();

    if (!to || !subject || !template) {
      return new Response(
        JSON.stringify({ error: "to, subject, and template are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Notification templates
    const templates = {
      enrollment_confirmation: {
        subject: `Enrolled in ${data?.course_title || "a course"}`,
        body: `Hi ${data?.student_name || "Student"},\n\nYou have been successfully enrolled in "${data?.course_title}". Start learning now!\n\nBest regards,\nLMS Team`,
      },
      course_completion: {
        subject: `Congratulations! You completed ${data?.course_title || "a course"}`,
        body: `Hi ${data?.student_name || "Student"},\n\nCongratulations on completing "${data?.course_title}"! You can now download your certificate.\n\nBest regards,\nLMS Team`,
      },
      quiz_result: {
        subject: `Quiz Results: ${data?.quiz_title || "Quiz"}`,
        body: `Hi ${data?.student_name || "Student"},\n\nYour results for "${data?.quiz_title}":\nScore: ${data?.score || 0}/${data?.total || 0}\nStatus: ${data?.passed ? "Passed ✅" : "Not Passed ❌"}\n\nBest regards,\nLMS Team`,
      },
      new_course: {
        subject: `New course available: ${data?.course_title || ""}`,
        body: `Hi there,\n\nA new course "${data?.course_title}" by ${data?.instructor_name || "an instructor"} is now available.\n\nCheck it out!\n\nBest regards,\nLMS Team`,
      },
    };

    const selectedTemplate = templates[template] || {
      subject,
      body: `Notification: ${JSON.stringify(data)}`,
    };

    // In production, integrate with an email service (Resend, SendGrid, etc.)
    // For now, we log the notification
    console.log("Notification:", {
      to,
      subject: selectedTemplate.subject,
      body: selectedTemplate.body,
      template,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        message: "Notification sent successfully",
        notification: {
          to,
          subject: selectedTemplate.subject,
          template,
          sent_at: new Date().toISOString(),
        },
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
