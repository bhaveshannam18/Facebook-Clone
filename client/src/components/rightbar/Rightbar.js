import "./rightbar.css";
//import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import { logoutCall } from "../../apiCalls";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';




export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends,setFriends] = useState([]);
  const {user:currentUser,dispatch} = useContext(AuthContext);
  const [followed,setFollowed] = useState(currentUser.followings.includes(user?.id));
  const [recommendedFriends,setRecommendedFriends] = useState([]);  
  const history = useNavigate();
  //console.log(user,"Rightbar USer from props");
  
  //useEffect(()=>{
    //setFollowed(currentUser.followings.includes(user?.id));
  //},[currentUser,user.id]);

  //To Get All Recommended Friends
  useEffect(()=>{
    const fetchRecommendedFriends = async ()=>{
      try {
        const suggestedFriends = await axios.get("/users/suggestedfriends");
        setRecommendedFriends(suggestedFriends.data); 
      } catch (err) {
        console.log(err);
      }
    }
    fetchRecommendedFriends();
  },[])

  useEffect(()=>{
    const fetchFriends = async ()=>{
      try {
        const friendList = await axios.get("/users/friends/"+user._id);
        setFriends(friendList.data); 
      } catch (err) {
        console.log(err);
      }
    }
    fetchFriends();
  },[user]);

  const handleClick = async ()=>{
    try {
      if(followed){
        await axios.put("/users/"+user._id+"/unfollow",{userId:currentUser._id})
        dispatch({type:"UNFOLLOW",payload:user._id})
      }else{
        await axios.put("/users/"+user._id+"/follow",{userId:currentUser._id})
        dispatch({type:"UNFOLLOW",payload:user._id})
      }
    } catch (err) {
      console.log(err);
    }
    setFollowed(!followed);
  }

  const handleLogout = (e)=>{
    //alert("Logout call")
    e.preventDefault();
    logoutCall(dispatch);
    history("/");
  }

  const HomeRightbar = () => {
    //Get all users of facebook and show here
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Recommended Friends</h4>
        <ul className="rightbarFriendList">
          {recommendedFriends.map((oneUser) => (
            <Online key={oneUser._id} user={oneUser} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
      {user.username!== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed?"Unfollow":"Follow"}
          {followed?<Remove />:<Add />}
        </button>
      )}
          <button className="logoutBtn" onClick={handleLogout}>Logout</button>
        
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship === 1 
            ? "Single" 
            : user.relationship === 2 ? "Married"
          :"Complicated"}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) =>{
            return <Link to={"/profile/"+friend.username} style={{textDecoration:"none"}}>
              <div className="rightbarFollowing">
                <img
                  src={friend.profilePic? PF+friend.profilePic : PF+"person/noAvatar.png"}
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
             
          })}
          
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
