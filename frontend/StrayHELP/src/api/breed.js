import api from './axios';

/**
 * Analyze an animal image using Gemini Vision API and generate identification report.
 * Called after image upload and location detection.
 * @param {{ photo: File, location: string }} data
 * @returns Promise with response including ai_analysis
 */
export const analyzeBreed = (data) => {
  const form = new FormData();
  form.append('photo', data.photo);
  form.append('location', data.location);
  form.append('tag_area', data.tag_area || data.location);
  if (data.description) form.append('description', data.description);
  
  return api.post('/posts/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Get detailed breed information from the analysis results.
 * @param {{ animal_type: string, breed: string, injury_severity: string }} analysis
 * @returns Object with breed characteristics
 */
export const getBreedCharacteristics = (analysis) => {
  if (!analysis || !analysis.breed) {
    return {
      breed: 'Unknown',
      category: 'Unidentified',
      temperament: 'Requires assessment',
      size: 'To be determined',
    };
  }

  // Breed characteristics database
  const characteristics = {
    // Dogs
    'Labrador Retriever': { category: 'Large Dog', temperament: 'Friendly & Active', size: 'Large (55-80 lbs)' },
    'German Shepherd': { category: 'Large Dog', temperament: 'Intelligent & Alert', size: 'Large (50-90 lbs)' },
    'Beagle': { category: 'Small Dog', temperament: 'Curious & Social', size: 'Small (20-30 lbs)' },
    'Pug': { category: 'Toy Dog', temperament: 'Affectionate & Playful', size: 'Tiny (14-18 lbs)' },
    'Golden Retriever': { category: 'Large Dog', temperament: 'Intelligent & Gentle', size: 'Large (55-75 lbs)' },
    'Indian Pariah': { category: 'Street Dog', temperament: 'Adaptable & Resilient', size: 'Medium (20-30 lbs)' },
    'Mongrel': { category: 'Mixed Breed', temperament: 'Variable', size: 'Variable' },
    'Stray Dog': { category: 'Stray', temperament: 'Variable', size: 'Variable' },
    
    // Cats
    'Persian': { category: 'Cat Breed', temperament: 'Calm & Affectionate', size: 'Medium (7-12 lbs)' },
    'Siamese': { category: 'Cat Breed', temperament: 'Vocal & Social', size: 'Medium (6-8 lbs)' },
    'Bengal': { category: 'Cat Breed', temperament: 'Active & Intelligent', size: 'Medium (8-15 lbs)' },
    'Domestic Shorthair': { category: 'Common Cat', temperament: 'Variable', size: 'Medium (7-11 lbs)' },
    'Stray Cat': { category: 'Stray', temperament: 'Variable', size: 'Variable' },
    
    // Birds
    'Pigeon': { category: 'Bird', temperament: 'Social & Adaptable', size: 'Small (0.3-0.5 lbs)' },
    'Parrot': { category: 'Bird', temperament: 'Intelligent & Vocal', size: 'Variable' },
    'Crow': { category: 'Bird', temperament: 'Intelligent & Bold', size: 'Medium (1 lb)' },
    
    // Other Animals
    'Rabbit': { category: 'Small Animal', temperament: 'Gentle & Timid', size: 'Small (3-5 lbs)' },
    'Turtle': { category: 'Reptile', temperament: 'Calm & Slow', size: 'Variable' },
    'Cow': { category: 'Livestock', temperament: 'Docile & Herd Animal', size: 'Large (800-1200 lbs)' },
    'Goat': { category: 'Livestock', temperament: 'Curious & Active', size: 'Medium (100-150 lbs)' },
    'Sheep': { category: 'Livestock', temperament: 'Herd Animal', size: 'Medium (150-300 lbs)' },
    
    // Default
    'Unknown': { category: 'Unidentified', temperament: 'Requires assessment', size: 'To be determined' },
  };

  return characteristics[analysis.breed] || characteristics['Unknown'];
};

/**
 * Generate a report title based on animal type and breed
 */
export const generateReportTitle = (analysis) => {
  if (!analysis) return 'Report';
  const breed = analysis.breed || 'Animal';
  const type = analysis.animal_type || 'Unknown';
  return `${breed} Identification Report`;
};

/**
 * Get color scheme based on injury severity
 */
export const getSeverityColors = (severity) => {
  const colors = {
    'Critical': { bg: '#fee2e2', text: '#dc2626', border: '1px solid #fca5a5', icon: 'alert' },
    'Moderate': { bg: '#fef3c7', text: '#d97706', border: '1px solid #fde68a', icon: 'warning' },
    'Minor': { bg: '#dcfce7', text: '#16a34a', border: '1px solid #bbf7d0', icon: 'check' },
  };
  return colors[severity] || colors['Minor'];
};
