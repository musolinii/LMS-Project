import { supabase } from './supabaseClient';

export const storageService = {
  async uploadFile(bucket, filePath, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
    if (error) throw error;
    return data;
  },

  getFileUrl(bucket, filePath) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    return data.publicUrl;
  },

  async deleteFile(bucket, filePaths) {
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
    const { error } = await supabase.storage
      .from(bucket)
      .remove(paths);
    if (error) throw error;
  },

  async uploadCourseThumbnail(courseId, file) {
    const ext = file.name.split('.').pop();
    const filePath = `courses/${courseId}/thumbnail.${ext}`;
    await this.uploadFile('course-assets', filePath, file);
    return this.getFileUrl('course-assets', filePath);
  },

  async uploadLessonVideo(courseId, lessonId, file) {
    const ext = file.name.split('.').pop();
    const filePath = `courses/${courseId}/lessons/${lessonId}/video.${ext}`;
    await this.uploadFile('course-assets', filePath, file);
    return this.getFileUrl('course-assets', filePath);
  },

  async uploadAvatar(userId, file) {
    const ext = file.name.split('.').pop();
    const filePath = `avatars/${userId}.${ext}`;
    await this.uploadFile('avatars', filePath, file);
    return this.getFileUrl('avatars', filePath);
  },
};
