import "./share.css";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import LabelIcon from '@mui/icons-material/Label';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useContext, useRef, useState } from "react";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import Cancel from '@mui/icons-material/Cancel';
import { useNavigate } from "react-router-dom";

//Check for colors of material icons

export default function Share() {
  const [file,setFile] = useState(null);
  const {user} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const navigate = useNavigate();

  const submitHandler = async (e)=>{
    e.preventDefault();
    const newPost = {
      userId:user._id,
      desc:desc.current.value
    };

    if(file){
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name",fileName);
      data.append("file",file);
      newPost.img = fileName;
      try {
        await axios.post("/upload",data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("/posts",newPost);
      //window.location.reload();
    } catch (err) {
      console.log(err);
    }
    navigate(`/profile/${user.username}`);
  }
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={user.profilePic
            ? user.profilePic
            : PF + "person/noAvatar.png"} alt="" />
          <input
            placeholder={`What's in your mind ${user.username} ?`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr"/>
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
            <div className="shareOptions">
                <label htmlFor="file" className="shareOption">
                    <PermMediaIcon htmlColor="tomato" className="shareIcon"/>
                    <span className="shareOptionText">Photo or Video</span>
                    <input 
                    style={{display:"none"}} 
                    type="file" id="file" 
                    accept=".png,.jpeg,.jpg" 
                    onChange={(e)=>setFile(e.target.files[0])}
                    />
                </label>
                <div className="shareOption">
                    <LabelIcon htmlColor="blue" className="shareIcon"/>
                    <span className="shareOptionText">Tag</span>
                </div>
                <div className="shareOption">
                    <LocationOnIcon htmlColor="green" className="shareIcon"/>
                    <span className="shareOptionText">Location</span>
                </div>
                <div className="shareOption">
                    <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon"/>
                    <span className="shareOptionText">Feelings</span>
                </div>
            </div>
            <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  );
}
