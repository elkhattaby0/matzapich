import Card from './Card'

export default function SuggestionsContent ({ data }) {

	return (
		<div className="Content">
      <div>
        <h2>People you may know</h2>
      </div>
			
			<div className="FriendRequests">
				{
					data.slice(0, 8).map(n=> (
            <Card
              key={n.id}
              img=""
              name={n.fullname}
              nbrFriends={n.nbr}
              tab={3} 
            />
					))
				}
			</div>
		</div>
		)
}