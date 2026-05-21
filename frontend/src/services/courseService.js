import { supabase } from './supabaseClient';

export const courseService = {
  async getCourses({ status = 'published', category, difficulty, search, limit = 20, offset = 0 } = {}) {
    let query = supabase
      .from('courses')
      .select('*, profiles!instructor_id(full_name, avatar_url)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);
    if (difficulty) query = query.eq('difficulty', difficulty);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;
    return { courses: data, total: count };
  },

  async getCourseById(courseId) {
    const { data, error } = await supabase
      .from('courses')
      .select('*, profiles!instructor_id(full_name, avatar_url, bio)')
      .eq('id', courseId)
      .single();
    if (error) throw error;
    return data;
  },

  async createCourse(courseData) {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCourse(courseId, updates) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCourse(courseId) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);
    if (error) throw error;
  },

  async getLessonsByCourse(courseId) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async createLesson(lessonData) {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lessonData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateLesson(lessonId, updates) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', lessonId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteLesson(lessonId) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);
    if (error) throw error;
  },
};
