-- ============================================
-- Seed Data for Local Development
-- ============================================

-- Note: In production, profiles are created via the auth trigger.
-- For local dev seeding, you may insert directly after creating auth users.

-- Sample Categories
-- 'web-development', 'data-science', 'mobile-development', 'design', 'devops'

-- Sample courses (these require a valid instructor profile ID)
-- After signing up an instructor user via the app, you can seed courses:

/*
INSERT INTO public.courses (instructor_id, title, description, category, difficulty, status, price) VALUES
    ('INSTRUCTOR_UUID_HERE', 'Introduction to React', 'Learn the fundamentals of React including components, hooks, and state management.', 'web-development', 'beginner', 'published', 0.00),
    ('INSTRUCTOR_UUID_HERE', 'Advanced JavaScript Patterns', 'Master advanced JS patterns including closures, prototypes, async/await, and design patterns.', 'web-development', 'advanced', 'published', 29.99),
    ('INSTRUCTOR_UUID_HERE', 'Python for Data Science', 'A comprehensive introduction to Python for data analysis, visualization, and machine learning.', 'data-science', 'beginner', 'published', 19.99),
    ('INSTRUCTOR_UUID_HERE', 'UI/UX Design Fundamentals', 'Learn the principles of great user interface and experience design.', 'design', 'beginner', 'published', 0.00),
    ('INSTRUCTOR_UUID_HERE', 'Docker & Kubernetes Essentials', 'Container orchestration from zero to production.', 'devops', 'intermediate', 'published', 39.99);

-- Sample lessons for "Introduction to React"
INSERT INTO public.lessons (course_id, title, content, duration_minutes, sort_order, is_free) VALUES
    ('COURSE_UUID_HERE', 'What is React?', 'React is a JavaScript library for building user interfaces...', 15, 1, true),
    ('COURSE_UUID_HERE', 'Setting Up Your Environment', 'In this lesson we will set up Node.js, npm, and create our first React app...', 20, 2, true),
    ('COURSE_UUID_HERE', 'JSX and Components', 'JSX is a syntax extension for JavaScript that lets you write HTML-like markup...', 25, 3, false),
    ('COURSE_UUID_HERE', 'Props and State', 'Props allow you to pass data from parent to child components...', 30, 4, false),
    ('COURSE_UUID_HERE', 'Hooks: useState and useEffect', 'Hooks let you use state and other React features in functional components...', 35, 5, false),
    ('COURSE_UUID_HERE', 'Building a Todo App', 'Let us put everything together and build a complete todo application...', 45, 6, false);

-- Sample quiz
INSERT INTO public.quizzes (course_id, title, description, time_limit_minutes, pass_percentage, is_published) VALUES
    ('COURSE_UUID_HERE', 'React Basics Quiz', 'Test your knowledge of React fundamentals', 15, 70, true);

-- Sample quiz questions
INSERT INTO public.quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, sort_order) VALUES
    ('QUIZ_UUID_HERE', 'What is React?', 'multiple_choice', '["A database", "A JavaScript library for building UIs", "A CSS framework", "A server-side language"]', 'A JavaScript library for building UIs', 1, 1),
    ('QUIZ_UUID_HERE', 'JSX stands for JavaScript XML.', 'true_false', '["True", "False"]', 'True', 1, 2),
    ('QUIZ_UUID_HERE', 'Which hook is used to manage state in functional components?', 'multiple_choice', '["useEffect", "useState", "useContext", "useReducer"]', 'useState', 1, 3),
    ('QUIZ_UUID_HERE', 'What is the virtual DOM?', 'short_answer', '[]', 'A lightweight copy of the actual DOM that React uses to optimize rendering', 2, 4);
*/
