import Card from './Card';

export default function BirthdaysContent({ data }) {
  return (
    <div className="Content">
      <div>
        <h2>Upcoming Birthdays</h2>
        <p>See which friends are celebrating soon</p>
      </div>

      {data.length === 0 ? (
        <p>No upcoming birthdays. We’ll show your friends’ birthdays here.</p>
      ) : (
        <div className="FriendRequests">
          {data.map((n) => (
            <Card
              key={n.id}
              id={n.id}
              img={n.avatar || ''}
              name={`${n.firstName} ${n.lastName}`}
              nbrFriends={0}
              tab={4} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
