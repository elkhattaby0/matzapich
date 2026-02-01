import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import BgCard from '../../components/common/BgCard';
import Grid from '../../components/common/Grid';
import { getPosts } from '../../utils/api';

export default function Sidebar() {
    const { user } = useAuth();
    const [photos, setPhotos] = useState([]);
    const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

    if (!user) return <div>Loading...</div>;

    const username = user.email || '';
    // const username = email ? `@${email.split('@')[0]}` : '@user';

    const joinDate = user.created_at ? new Date(user.created_at) : null;
    const joinMonth = joinDate
        ? joinDate.toLocaleString('en-US', { month: 'long' })
        : null;
    const joinYear = joinDate ? joinDate.getFullYear() : null;

    const hasBirthDate = !!user.dateOfBirth;
    const birthDate = hasBirthDate ? new Date(user.dateOfBirth) : null;


    const hasBio = !!user.bio;
    const hasStatus = !!user.socialStatus;
    const hasFrom = !!user.from;
    const hasLivesIn = !!user.livesIn;
    const hasWork = !!user.work;
    const hasStudied = !!user.studied;

    useEffect(() => {
      let isMounted = true;

      async function fetchUserPhotos() {
        const data = await getPosts();
        const items = Array.isArray(data.data) ? data.data : data;

        const userPhotos = items
          .filter(p => p.user_id === user.id && p.media_url)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // newest first
          .slice(0, 6) // only last 6
          .map(p => p.media_url);

        if (isMounted) setPhotos(userPhotos);
      }

      fetchUserPhotos();
      return () => { isMounted = false; };
    }, [user.id]);


    const currentAvatarUrl = user.avatar
        ? `${APP_URL}/storage/${user.avatar}`
        : `${APP_URL}/storage/avatars/noavatar.png`;


    return (
        <div className="sidebar">
            <BgCard tag="top">
                <section
                    className="bgCover"
                    style={{
                        backgroundImage: `url('')`,
                    }}
                ></section>

                <div className="imgProfile">
                    <img
                        src={currentAvatarUrl || ''}
                        alt={`${user.firstName || ''} ${user.lastName || ''}`}
                    />
                </div>

                {/* INFO */}
                <div className="userInfo">
                    <p>
                        {user.firstName} {user.lastName}
                        <span>
                          {user.email_verified_at ? (
                            <>
                              <i className="fa-regular fa-circle-check"></i> Verified
                            </>
                          ) : (
                            'Get Verified'
                          )}
                        </span>

                    </p>

                    <p>{username}</p>

                    {/*<p>
                        <i className="fa-solid fa-user-group"></i>{' '}
                        500 friends
                    </p>*/}

                    {hasBirthDate && (
                        <p>
                            <i className="fa-solid fa-cake-candles"></i>{' '}
                            Born{' '}
                            {birthDate.toLocaleString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                    )}

                    {joinMonth && joinYear && (
                        <p>
                            <i className="fa-regular fa-calendar-days"></i>{' '}
                            Joined {joinMonth} {joinYear}
                        </p>
                    )}
                </div>
            </BgCard>

            {
                (
                    hasBio || hasStatus ||
                    hasFrom || hasLivesIn || 
                    hasStudied || hasWork) && (
                    <BgCard tag="intro">
                        {hasBio && (
                            <>
                                <p>
                                    Intro <span>Edit Bio</span>
                                </p>
                                <p>{user.bio}</p>
                            </>
                        )}

                        <ul>
                            {hasStatus && (
                                <li>
                                    <i className="fa-solid fa-heart"></i>{' '}
                                    {user.socialStatus}
                                </li>
                            )}

                            {hasFrom && (
                                <li>
                                    <i className="fa-solid fa-location-dot"></i>{' '}
                                    From <strong>{user.from}</strong>
                                </li>
                            )}

                            {hasLivesIn && (
                                <li>
                                    <i className="fa-solid fa-house"></i>{' '}
                                    Lives in <strong>{user.livesIn}</strong>
                                </li>
                            )}

                            {hasStudied && (
                                <li>
                                    <i className="fa-solid fa-graduation-cap"></i>{' '}
                                    Studied at <strong>{user.studied}</strong>
                                </li>
                            )}

                            {hasWork && (
                                <li>
                                    <i className="fa-solid fa-briefcase"></i>{' '}
                                    Works at <strong>{user.work}</strong>
                                </li>
                            )}
                        </ul>
                    </BgCard>
                    ) 
            }
            

            {photos.length > 0 && (
                <BgCard tag="photos">
                  <p>
                    Photos
                    <span>See All Photos</span>
                  </p>
                  <Grid nbr={3} gap="5px">
                    {photos.map((src, idx) => (
                      <img key={idx} src={src} alt="photo" width={100} />
                    ))}
                  </Grid>
                </BgCard>
              )}
        </div>
    );
}
