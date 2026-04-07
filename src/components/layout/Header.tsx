import { motion } from 'framer-motion';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
}

export default function Header({ title, subtitle, showProfile = true }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.header 
      className="screen-header flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <p className="label-sm text-text-tertiary mb-1">{subtitle}</p>
        <h1 className="headline-md text-white">{title}</h1>
      </div>

      {showProfile && (
        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:text-white transition-colors">
            <Bell size={20} />
            <span className="badge">3</span>
          </button>
          <div className="relative">
            <button 
              onClick={() => navigate('/profile')}
              className="avatar flex items-center justify-center bg-primary border-transparent cursor-pointer hover:scale-105 active:scale-95 transition-transform shadow-md"
            >
              <User size={20} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </motion.header>
  );
}
