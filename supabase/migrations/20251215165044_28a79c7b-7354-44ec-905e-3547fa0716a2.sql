-- Create trigger for automatic profile creation on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also let's update the existing profile with correct name from user metadata
UPDATE public.profiles 
SET name = 'rahul siddarth'
WHERE user_id = '5d61db18-dfa5-4c37-a034-564ee7b70456';