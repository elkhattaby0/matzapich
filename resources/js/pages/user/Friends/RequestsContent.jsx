import Card from './Card'

export default function RequestsContent ({ data }) {

	return (
		<div className="Content">
      <div>
        <h2>Friend Requests</h2>
        <p>Manage people who want to connect with you</p>
      </div>
			
			<div className="FriendRequests">
				{
					data.slice(0, 8).map(n=> (
            <Card
              key={n.id}
              img=""
              name={n.fullname}
              nbrFriends={n.nbr} 
              tab={2}
            />
					))
				}
			</div>
		</div>
		)
}