import BgCard from '../../../components/common/BgCard';

export default function Card({
	id,
	img,
	name,
	nbrFriends,
	tab
}) {
	return (
		<BgCard tag="cardusers" key={id}>
			<img src={
				img ? img : '/storage/avatars/noavatar.png'
			} alt={name} />
							
	        <div className="txt">
	            { name && <p>{name}</p> }
	            { nbrFriends && <p>{nbrFriends} mutual friends</p>}
	        </div>
          	{(() => {
			  switch (tab) {
			    case 2:
			      return (
			        <div className="btns">
			          <button>Confirm</button>
			          <button>Delete</button>
			        </div>
			      );
			    case 3:
			      return (
			        <div className="btns">
			          <button>Add friend</button>
			          <button>Remove</button>
			        </div>
			      );
			    default:
			      return null;
			  }
			})()}


							
		</BgCard>
	)
}