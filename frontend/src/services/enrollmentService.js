import { supabase } from './supabaseClient';

export const enrollmentService = {
  async enrollStudent(courseId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('enrollments')
      .insert({ student_id: user.id, course_id: courseId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async unenrollStudent(enrollmentId) {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ status: 'dropped' })
      .eq('id', enrollmentId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getEnrollmentsByStudent(studentId) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*, profiles!instructor_id(full_name, avatar_url))')
      .eq('student_id', studentId)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getEnrollmentsByCourse(courseId) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, profiles!student_id(full_name, avatar_url)')
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async checkEnrollment(studentId, courseId) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProgress(studentId, lessonId, courseId, progressData) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert(
        { student_id: studentId, lesson_id: lessonId, course_id: courseId, ...progressData },
        { onConflict: 'student_id,lesson_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getCourseProgress(studentId, courseId) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', courseId);
    if (error) throw error;
    return data;
  },
};
