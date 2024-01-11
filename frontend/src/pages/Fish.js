// Fish.js
function Fish({ fish }) {
    return (
      <div className="fish">
        <h3>{fish.fish_type}</h3> {/* Visa fisktypen */}
        <p>{fish.message}</p> {/* Visa meddelandet */}
        <p>Likes: {fish.likes_count}</p> {/* Använder 'like_count' direkt från prop */}
      </div>
    );
  }
  
  export default Fish;