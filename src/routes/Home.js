import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import {db} from '../firebase';
import { collection, addDoc, serverTimestamp, query,  onSnapshot, orderBy, limit} from "firebase/firestore"; 
import ListGroup from 'react-bootstrap/ListGroup';
import Comment from '../components/Comment';
import { getStorage, ref, uploadString, getDownloadURL} from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const Home = ({userObj})=>{
  const [comment,setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [attachment, setAttachment] = useState('');

  const storage = getStorage();
  console.log(storage);

  const getComments = async ()=>{    
    const q = query(collection(db, "comments"), orderBy('date', "desc"), limit(10));
    onSnapshot(q, (querySnapshot) => {
      const commentsArray = querySnapshot.docs.map((doc)=>({
        ...doc.data(),
        id:doc.id
      }));
      setComments(commentsArray);         
    });
  }

  useEffect(()=>{
    getComments();
    console.log(comments);
  },[comments]);

  const onChange = (e)=>{
    //입력한 내용을 comment에 반영한다.
    setComment(e.target.value);
  }

  const onSubmit = async (e) => {
    e.preventDefault(); // 1. 폼 전송 기본 동작 방지
  
    let imageURL = ''; // 2. 이미지 URL 초기값 설정
  
    // 3. 첨부파일이 있는 경우에만 Firebase Storage에 이미지 업로드
    if (attachment !== '') {
      const storageRef = ref(storage, `${userObj}/${uuidv4()}`); // 3-1. 저장 경로 지정
      const snapshot = await uploadString(storageRef, attachment, 'data_url'); // 3-2. 이미지 업로드 (비동기)
      imageURL = await getDownloadURL(snapshot.ref); // 3-3. 업로드된 이미지의 URL 가져오기 (비동기)
    }
  
    // 4. Firestore에 등록할 데이터 객체 구성
    const data = {
      comment: comment,
      date: serverTimestamp(),
      uid: userObj,
      image: imageURL, // 4-1. 첨부파일이 없으면 빈 문자열, 있으면 URL
    };
  
    // 5. Firestore에 댓글 문서 추가 (비동기)
    const docRef = await addDoc(collection(db, "comments"), data);
    console.log("새글의 아이디: ", docRef.id);
  
    // 6. 입력 필드와 첨부파일 상태 초기화
    setComment('');
    setAttachment('');
    document.querySelector('#attachment').value = '';
  };
  

  const onFileChange = (e)=>{
    // console.log(e.target.files[0]);
    // const {target:{files}} = e;
    const theFile = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (e)=>{ // 읽기 완료되면 결과를 e에서 확인하다.
      console.log(e);
      setAttachment(e.target.result);
    }
    reader.readAsDataURL(theFile); //파일 정보를 dataURL 읽는다.
  }
  const onClearFile = ()=>{
    setAttachment('');
    document.querySelector('#attachment').value = '';
  }

  return(
    <>
      <h2>Home</h2>
      
      <Form onSubmit={onSubmit}>        
        <Form.Group className="mb-3" controlId="comment">
          <Form.Label>Comment</Form.Label>
          <Form.Control as="textarea" value={comment} onChange={onChange} rows={3} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="attachment">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" multiple accept="image/*" onChange={onFileChange}/>
        </Form.Group>        
          {
            attachment && 
            <div className='d-flex gap-1 p-1 align-items-center'>
              <img src={attachment} width="100px" alt=""/>
              <Button variant="secondary" size="sm" onClick={onClearFile}>취소</Button>
            </div> 
          }        
        <Button type="submit" variant="primary">입력</Button>
      </Form>
      <hr/>
      <ListGroup>
        {
          comments.map(c=> 
            <Comment key={c.id} commentObj={c} isOwner={c.uid === userObj}></Comment>
           )
        }       
        
      </ListGroup>
    </>
  )
}
export default Home;