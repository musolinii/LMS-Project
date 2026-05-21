import { supabase } from './supabaseClient';

export const quizService = {
  async getQuizzesByCourse(courseId) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async getQuizById(quizId) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();
    if (error) throw error;
    return data;
  },

  async getQuestionsByQuiz(quizId) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async createQuiz(quizData) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert(quizData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateQuiz(quizId, updates) {
    const { data, error } = await supabase
      .from('quizzes')
      .update(updates)
      .eq('id', quizId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteQuiz(quizId) {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);
    if (error) throw error;
  },

  async createQuestion(questionData) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(questionData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateQuestion(questionId, updates) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .update(updates)
      .eq('id', questionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteQuestion(questionId) {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId);
    if (error) throw error;
  },

  async submitQuizAttempt(quizId, answers) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        student_id: user.id,
        answers,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getQuizAttempts(quizId, studentId) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('student_id', studentId)
      .order('started_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};
