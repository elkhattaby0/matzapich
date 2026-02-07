import Card from './Card'

export default function AllFriendContent ({ data }) {

	return (
		<div className="Content">
      <div>
        <h2>Your Friends</h2>
      </div>
			
			<div className="FriendRequests">
				{
					data.slice(0, 8).map(n=> (
            <Card
              key={n.id}
              img=""
              name={n.fullname}
              nbrFriends={n.nbr} 
            />
					))
				}
			</div>
		</div>
		)
}