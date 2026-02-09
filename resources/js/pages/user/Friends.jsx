import { useState, useEffect } from 'react';

import Header from '../user/Header';
import Footer from '../../components/layout/Footer';
import Panel from './Friends/Panel';
import AllFriendContent from './Friends/AllFriendContent';
import RequestsContent from './Friends/RequestsContent';
import SuggestionsContent from './Friends/SuggestionsContent';
import BirthdaysContent from './Friends/BirthdaysContent'; 
import { friendshipApi } from '../../utils/api';

export default function Friends() {
  const [activeTab, setActiveTab] = useState(1);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === 1) {
          const data = await friendshipApi.getFriends();
          if (!ignore) setFriends(data);
        } else if (activeTab === 2) {
          const data = await friendshipApi.getFriendRequests();
          if (!ignore) {
            setRequests(data);
            setPendingRequestsCount(data.length);
          }
        } else if (activeTab === 3) {
          const data = await friendshipApi.getSuggestions();
          if (!ignore) setSuggestions(data);
        } else if (activeTab === 4) {
          const data = await friendshipApi.getBirthdays();
          if (!ignore) setBirthdays(data);
        }

      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [activeTab]);

  return (
      <main className="pageFriends">
        <section>
          <Panel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingRequestsCount={pendingRequestsCount}
          />

          {loading && <p>Loading...</p>}

          {!loading && activeTab === 1 && (
            <AllFriendContent data={friends} />
          )}

          {!loading && activeTab === 2 && (
            <RequestsContent data={requests} />
          )}

          {!loading && activeTab === 3 && (
            <SuggestionsContent data={suggestions} />
          )}

          {!loading && activeTab === 4 && (
            <BirthdaysContent data={birthdays} />
          )}
        </section>
      </main>
  );
}
