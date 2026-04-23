import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const Recommendations = () => {
  const [formData, setFormData] = useState({
    rank: '',
    category: '',
    state: '',
    budget: '',
    preferredBranches: []
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [explanationDialog, setExplanationDialog] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);

  const categories = ['general', 'obc', 'sc', 'st'];
  const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Telangana', 'Andhra Pradesh'];
  const branches = ['Computer Science and Engineering', 'Information Technology', 'Electronics and Communication Engineering', 'Mechanical Engineering', 'Civil Engineering'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBranchToggle = (branch) => {
    setFormData(prev => ({
      ...prev,
      preferredBranches: prev.preferredBranches.includes(branch)
        ? prev.preferredBranches.filter(b => b !== branch)
        : [...prev.preferredBranches, branch]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/colleges/recommend', formData);
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'safe': return 'success';
      case 'target': return 'warning';
      case 'dream': return 'error';
      default: return 'default';
    }
  };

  const getAIExplanation = async (college, branch, rank, category, cutoff) => {
    setExplanationLoading(true);
    setSelectedCollege({ college, branch });

    try {
      const response = await axios.post('/api/colleges/ai/explain', {
        college,
        branch,
        rank: parseInt(formData.rank),
        category: formData.category,
        cutoff
      });
      setAiExplanation(response.data.explanation);
      setExplanationDialog(true);
    } catch (err) {
      setAiExplanation('Failed to get AI explanation. Please try again.');
      setExplanationDialog(true);
    } finally {
      setExplanationLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Get College Recommendations
      </Typography>

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Rank and Category - Full width fields */}
              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Enter Your Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="JEE Rank *"
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.rank}
                  onChange={(e) => handleInputChange('rank', e.target.value)}
                  required
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      height: 56
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    label="Category *"
                    sx={{ height: 56 }}
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat}>
                        {cat.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* State and Budget */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Preferred State</InputLabel>
                  <Select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    label="Preferred State"
                    sx={{ height: 56 }}
                  >
                    <MenuItem value="">All States</MenuItem>
                    {states.map(state => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget (₹ per year)"
                  type="number"
                  placeholder="e.g., 1500000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      height: 56
                    }
                  }}
                />
              </Grid>

              {/* Preferred Branches */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Preferred Branches (Select one or more)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {branches.map(branch => (
                    <Chip
                      key={branch}
                      label={branch}
                      onClick={() => handleBranchToggle(branch)}
                      color={formData.preferredBranches.includes(branch) ? 'primary' : 'default'}
                      variant={formData.preferredBranches.includes(branch) ? 'filled' : 'outlined'}
                      sx={{ 
                        mb: 1,
                        '&:hover': { 
                          boxShadow: 2,
                          cursor: 'pointer'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    minWidth: 250,
                    height: 48,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
                  {loading ? 'Finding Recommendations...' : 'Get Recommendations'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: '1rem' }}>
          {error}
        </Alert>
      )}

      {recommendations.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Your Recommendations ({recommendations.length} colleges)
          </Typography>

          {recommendations.map((rec, index) => (
            <Accordion key={index} sx={{ mb: 2, boxShadow: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="h6" sx={{ flex: '1 1 auto', minWidth: 250 }}>
                    {rec.college}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: '1 1 auto' }}>
                    {rec.branch}
                  </Typography>
                  <Chip
                    label={rec.category.toUpperCase()}
                    color={getCategoryColor(rec.category)}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#fafafa' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ mb: 1 }}><strong>State:</strong> {rec.state}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Type:</strong> {rec.type}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>NIRF Ranking:</strong> {rec.nirfRanking || 'N/A'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Fees:</strong> ₹{rec.fees?.toLocaleString() || 'N/A'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Your Cutoff:</strong> {rec.cutoff}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ mb: 1, fontWeight: 600 }}>Placement Data:</Typography>
                    <Typography sx={{ mb: 1 }}>📊 Average Package: ₹{rec.placement?.averagePackage?.toLocaleString() || 'N/A'}</Typography>
                    <Typography sx={{ mb: 2 }}>🏆 Highest Package: ₹{rec.placement?.highestPackage?.toLocaleString() || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={() => getAIExplanation(rec.college, rec.branch, formData.rank, formData.category, rec.cutoff)}
                      disabled={explanationLoading}
                      sx={{ textTransform: 'none', fontSize: '0.95rem' }}
                    >
                      {explanationLoading ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
                      Get AI Explanation
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* AI Explanation Dialog */}
      <Dialog open={explanationDialog} onClose={() => setExplanationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {selectedCollege?.college}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mt: 2, mb: 2, color: 'text.secondary' }}>
            <strong>Branch:</strong> {selectedCollege?.branch}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {aiExplanation}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setExplanationDialog(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Recommendations;