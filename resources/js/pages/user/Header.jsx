import '../../../css/user.css'
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo'

export default function Header ({onOpenSide}){
    const { user } = useAuth();
    const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

    const avatarUrl = user?.avatar
        ? `${APP_URL}/storage/${user.avatar}`
        : `${APP_URL}/storage/avatars/noavatar.png`; // fallback

    return (
        <header>
            <nav>
                <section>
                    <Logo />

                    <div className='searchField'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                            type="search" 
                            placeholder="Search..."
                        />
                    </div>
                </section>

                <section>
                    <a><i className="fa-regular fa-house"></i></a>
                    <a><i className="fa-solid fa-people-group"></i></a>
                    <a><i className="fa-regular fa-comment-dots"></i></a>
                    <a><i className="fa-regular fa-bell"></i></a>
                </section>

                <section>
                    <button onClick={()=> {
                        onOpenSide('Menu', 'menu');
                    }}>
                        <img 
                            src={avatarUrl}
                            alt={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                        />
                    </button>
                </section>
            </nav>
        </header>
    )
}