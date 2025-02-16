/*eslint-disable*/
import { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthContext.tsx';
import { userService } from '../../services/userService.ts';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '../../components/Loader.tsx';
import { UserForProfile } from '../../types/UserForProfile.ts';


export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserForProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  useEffect(() => {

    if (currentUser) {
      userService.getUser(currentUser.id)
        .then(setUserData)
        .catch((err) => {
          console.error(err);
          setError('Failed to load user data.');
        });
    }
  }, [currentUser]);

  if (!userData) return <Loader />;

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
      setInputValue(userData?.[section as keyof UserForProfile] ?? '');
      setSuccessMessage(null);
    }
  };

  const handleSave = async () => {
    if (!expandedSection) return;

    try {
      if (expandedSection === 'name') {
        await userService.changeName(inputValue);
        setUserData(prev => prev ? { ...prev, name: inputValue } : null);
      }

      setExpandedSection(null);
      setSuccessMessage(`Successfully updated ${expandedSection}!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error(`Failed to update ${expandedSection}`, error);
    }
  };

  if (error) {
    return <p className="notification is-danger is-light">{error}</p>;
  }

  return (
    <section className="section">
      <div className="container is-max-desktop box">
        <h1 className="title has-text-centered">My Profile</h1>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="notification is-success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name Section */}
        <div className="box">
          <div className="is-flex is-align-items-center is-justify-content-space-between">
            <div>
              <strong>Name</strong>
              <p className="has-text-grey">{userData.name ?? 'Not found'}</p>
            </div>
            <button className="button is-light" onClick={() => toggleSection('name')}>Edit</button>
          </div>
          <AnimatePresence>
            {expandedSection === 'name' && (
              <motion.div
                className="field mt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  className="input is-dark"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="button is-success mt-2" onClick={() => void handleSave()}>Save</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Email Section */}
        <div className="box">
          <div className="is-flex is-align-items-center is-justify-content-space-between">
            <div>
              <strong>Email</strong>
              <p className="has-text-grey">{userData.email}</p>
            </div>
            <button className="button is-light" onClick={() => navigate('/profile/email')}>Edit</button>
          </div>
        </div>

        {/* Password Section */}
        <div className="box">
          <div className="is-flex is-align-items-center is-justify-content-space-between">
            <div>
              <strong>Password</strong>
              <p className="has-text-grey">********</p>
            </div>
            <button className="button is-light" onClick={() => navigate('/profile/password')}>Edit</button>
          </div>
        </div>
      </div>
    </section>
  );
};
