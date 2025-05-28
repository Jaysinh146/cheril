export const getRandomAvatar = (gender: 'male' | 'female'): string => {
  // Generate a random seed for consistent avatar generation
  const seed = Math.random().toString(36).substring(7);
  
  // Use DiceBear's avataaars collection for cartoon avatars
  const baseUrl = 'https://api.dicebear.com/7.x/avataaars/svg';
  const options = {
    seed,
    backgroundColor: ['b6e3f4','c0aede','d1d4f9', 'ffd5dc', 'ffdfbf'],
    accessories: ['kurt','prescription01','prescription02','round'],
    clothingColor: ['b6e3f4','c0aede','d1d4f9', 'ffd5dc', 'ffdfbf'],
    hair: gender === 'male' ? 
      ['short01','short02','short03','short04','short05'] :
      ['long01','long02','long03','long04','long05'],
    hairColor: ['000000','6c788e','937c69','779c62','6c788e'],
    style: 'circle'
  };

  // Convert options to URL parameters
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.append(key, value.join(','));
    } else {
      params.append(key, value.toString());
    }
  });

  return `${baseUrl}?${params.toString()}`;
};
