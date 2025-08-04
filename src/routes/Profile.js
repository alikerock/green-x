import Button from 'react-bootstrap/Button';
import { getAuth, signOut, updateProfile  } from "firebase/auth";
import { useNavigate } from "react-router";
import { getStorage, ref, getDownloadURL,uploadBytes  } from "firebase/storage";
import { collection, query, where, getDocs, orderBy} from "firebase/firestore";
import { useEffect, useState, useCallback } from 'react';
import {db} from '../firebase';
import ListGroup from 'react-bootstrap/ListGroup';
import Comment from '../components/Comment';

const Profile = ()=>{
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user);
  let navigate = useNavigate();
  const defaultProfileURL = `${process.env.PUBLIC_URL}/default_profile.svg`;
  const [profile, setProfile] = useState(defaultProfileURL);
  const [comments, setComments] = useState([]);

  const onLogout = () =>{
    signOut(auth).then(() => {
      // Sign-out successful.
      alert('로그아웃 되었습니다');
      navigate('/');
    }).catch((error) => {
      // An error happened.
    });
  }
  const updateLogo = async (e)=>{
    const file = e.target.files[0];
    const storage = getStorage();
    
    const storageRef = ref(storage, `profile/${user.uid}`); // 3-1. 저장 경로 지정
    const snapshot = await uploadBytes(storageRef, file); // 3-2. 이미지 업로드 (비동기)
    const profileURL = await getDownloadURL(snapshot.ref); // 3-3. 업로드된 이미지의 URL 가져오기 (비동기)
    console.log(profileURL);
    setProfile(profileURL);

    updateProfile(user, {
      photoURL: profileURL
    });

  }


  const getComments = useCallback(async ()=>{    
    const q = query(collection(db, "comments"), where("uid", "==", user.uid), orderBy('date', "desc"));

    const querySnapshot = await getDocs(q);

    const commentsArray = querySnapshot.docs.map((doc)=>({
      ...doc.data(),
      id:doc.id
    }));
    setComments(commentsArray); 
    
  }, [user.uid]);


  // eslint-disable-next-line
  useEffect(()=>{
    (user.photoURL !== null && user.photoURL.includes('firebase')) && setProfile(user.photoURL);
    getComments();
  },[getComments, user.photoURL]); 

  return(
    <>
    <h2>Profile</h2>
    <div className='profile'>
      <div className='info'>
        <img src={profile} alt=""/>
        <h3>{user.displayName}</h3>
      </div>
      <input type="file" className='hidden' accept="image/*" name="profile" id="profile" onChange={updateLogo} />
      <label htmlFor="profile" className='btn btn-secondary  btn-sm'>Update Profile</label>
    </div>
    <Button variant="primary"  onClick={onLogout}>Logout</Button>
    <hr/>
    <h3>My Comment List</h3>
      <ListGroup>
        {
          comments.map(c=> 
            <Comment key={c.id} commentObj={c} isOwner={true}></Comment>
           )
        }       
        
      </ListGroup>
    </>
  )
}
export default Profile;