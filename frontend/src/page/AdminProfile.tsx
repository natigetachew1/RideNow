import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

interface AdminData {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  lastLogin: string;
}

const AdminProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState<AdminData>({
    name: 'Admin User',
    email: 'admin@ridenow.com',
    phone: '+1 234 567 890',
    joinDate: 'January 15, 2023',
    lastLogin: 'Today, 10:30 AM'
  });
  const [tempData, setTempData] = useState<AdminData>({ ...adminData });

  const handleEdit = () => {
    setTempData({ ...adminData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setAdminData({ ...tempData });
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
  };

  const handleChange = (field: keyof AdminData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const renderField = (label: string, field: keyof AdminData, icon: React.ReactNode) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" color="text.secondary" sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Box>
      {isEditing ? (
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={tempData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      ) : (
        <Typography variant="body1">{adminData[field]}</Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 2,
                border: '3px solid',
                borderColor: 'primary.main'
              }}
              src="https://source.unsplash.com/random/200x200/?portrait"
              alt="Admin Profile"
            />
            {!isEditing && (
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{ mt: 1 }}
              >
                Edit Profile
              </Button>
            )}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                {isEditing ? 'Edit Profile' : 'Admin Profile'}
              </Typography>
              {isEditing && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              )}
            </Box>

            {renderField('Full Name', 'name', <PersonIcon color="action" />)}
            {renderField('Email', 'email', <EmailIcon color="action" />)}
            {renderField('Phone', 'phone', <Tooltip title="Phone Number"><LockIcon color="action" /></Tooltip>)}
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Member Since</Typography>
                <Typography variant="body2">{adminData.joinDate}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Last Login</Typography>
                <Typography variant="body2">{adminData.lastLogin}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {isEditing && (
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>Change Password</Typography>
            <Box sx={{ display: 'grid', gap: 2, maxWidth: 500 }}>
              <TextField
                fullWidth
                size="small"
                label="Current Password"
                type="password"
                variant="outlined"
              />
              <TextField
                fullWidth
                size="small"
                label="New Password"
                type="password"
                variant="outlined"
              />
              <TextField
                fullWidth
                size="small"
                label="Confirm New Password"
                type="password"
                variant="outlined"
              />
              <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-start' }}>
                Update Password
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdminProfile;
