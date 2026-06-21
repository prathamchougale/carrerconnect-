import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { LogOut, Bookmark, Briefcase, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    }

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    // Get profile photo from user data
    const profilePhoto = user?.profile?.profilePhoto;

    return (
        <div className='bg-white shadow-sm relative'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                {/* Logo */}
                <div>
                    <h1 className='text-2xl font-bold'>
                        Career<span className='text-[#F83002]'>Connect</span>
                    </h1>
                </div>

                {/* Nav Links + Profile */}
                <div className='flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-5'>
                        {/* RECRUITER NAV LINKS */}
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li><Link to="/admin/companies">Companies</Link></li>
                                <li><Link to="/admin/jobs">Jobs</Link></li>
                            </>
                        ) : (
                            /* STUDENT NAV LINKS */
                            <>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/jobs">Jobs</Link></li>
                                <li><Link to="/browse">Browse</Link></li>
                            </>
                        )}
                    </ul>

                    {/* LOGIN / SIGNUP or PROFILE DROPDOWN */}
                    {!user ? (
                        <div className='flex items-center gap-2'>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup"><Button className="bg-[#7209b7] hover:bg-[#5f32ad]">Signup</Button></Link>
                        </div>
                    ) : (
                        <div className='relative' ref={dropdownRef}>
                            {/* Avatar Button - Shows Photo or Initial */}
                            <div 
                                className='flex items-center gap-2 cursor-pointer select-none'
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {profilePhoto ? (
                                    <img 
                                        src={profilePhoto} 
                                        alt={user?.fullname}
                                        className='w-10 h-10 rounded-full border-2 border-gray-300 object-cover'
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div 
                                    className={`w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors ${profilePhoto ? 'hidden' : 'flex'}`}
                                >
                                    <span className='text-lg font-semibold text-gray-700'>
                                        {getInitial(user?.fullname)}
                                    </span>
                                </div>
                                {showDropdown ? (
                                    <ChevronUp size={16} className='text-gray-500' />
                                ) : (
                                    <ChevronDown size={16} className='text-gray-500' />
                                )}
                            </div>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className='absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
                                    {/* User Info */}
                                    <div className='p-4 border-b'>
                                        <div className='flex items-center gap-3'>
                                            {profilePhoto ? (
                                                <img 
                                                    src={profilePhoto} 
                                                    alt={user?.fullname}
                                                    className='w-12 h-12 rounded-full border-2 border-yellow-400 object-cover'
                                                />
                                            ) : (
                                                <div className='w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center bg-white'>
                                                    <span className='text-xl font-bold text-gray-800'>
                                                        {getInitial(user?.fullname)}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className='font-semibold text-gray-900'>{user?.fullname}</h4>
                                                <p className='text-sm text-gray-500 truncate max-w-[180px]'>{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items - DIFFERENT FOR STUDENT vs RECRUITER */}
                                    <div className='py-2'>
                                        {/* STUDENT ONLY OPTIONS */}
                                        {user && user.role === 'student' && (
                                            <>
                                                <Link to="/saved-jobs" onClick={() => setShowDropdown(false)}>
                                                    <div className='flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors'>
                                                        <Bookmark size={18} className='text-yellow-500' />
                                                        <span className='text-sm font-medium text-gray-700'>My Bookmarks</span>
                                                    </div>
                                                </Link>

                                                <Link to="/my-applications" onClick={() => setShowDropdown(false)}>
                                                    <div className='flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors'>
                                                        <Briefcase size={18} className='text-blue-500' />
                                                        <span className='text-sm font-medium text-gray-700'>My Applications</span>
                                                    </div>
                                                </Link>
                                            </>
                                        )}

                                        {/* RECRUITER ONLY OPTIONS */}
                                        {user && user.role === 'recruiter' && (
                                            <>
                                                <Link to="/admin/companies" onClick={() => setShowDropdown(false)}>
                                                    <div className='flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors'>
                                                        <Briefcase size={18} className='text-blue-500' />
                                                        <span className='text-sm font-medium text-gray-700'>My Companies</span>
                                                    </div>
                                                </Link>

                                                <Link to="/admin/jobs" onClick={() => setShowDropdown(false)}>
                                                    <div className='flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors'>
                                                        <FileText size={18} className='text-green-500' />
                                                        <span className='text-sm font-medium text-gray-700'>Posted Jobs</span>
                                                    </div>
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    {/* Logout - SAME FOR BOTH */}
                                    <div className='border-t p-2'>
                                        <button 
                                            onClick={() => {
                                                setShowDropdown(false);
                                                logoutHandler();
                                            }}
                                            className='flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-md transition-colors'
                                        >
                                            <LogOut size={18} />
                                            <span className='text-sm font-medium'>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar