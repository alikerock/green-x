import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const Auth = ()=>{
  const [input, setInput] = useState({
    email:'',
    password:''
  });
  const {email,password} = input;
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth();

  const onChange = (e)=>{    
    const {name,value} = e.target;

    setInput((prev)=>({ 
      ...prev,
      [name]:value
    }));   
  }
  /*
  const [email,setEmail] = useState('');
  const [password,setPasword] = useState('');

  const onChange = (e)=>{    
    const {name,value} = e.target;
    if(name === 'email'){
      setEmail(value);
    }else{
      setPasword(value);
    }
  }
  */
 const toggleAccount = ()=>{
  setNewAccount(prev=>!prev);
 }

 const onSubmit = (e)=>{
  e.preventDefault();
  if(newAccount){
    //회원가입
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      setError(errorMessage);
    });
  }else{
    //로그인
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      setError(errorMessage);
    });
  }
 }

const onGoogleSignIn  = ()=>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(token, user);
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode,errorMessage,email, credential);
  });

}
  return(
    <>
      <h2>{newAccount ? "회원가입" : "로그인"}</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" value={input.email} placeholder="name@example.com" onChange={onChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={input.password}  onChange={onChange} />
        </Form.Group>
        <Button type="submit" variant="primary">{newAccount ? "Create Account" : "Login"}</Button>
      </Form>
      <div>{error}</div>
      <hr/>

      <Button variant="info" onClick={onGoogleSignIn}> 
        {newAccount ? "구글로 회원가입" : "구글로 로그인"}
      </Button>

      <hr/>
      <Button type="submit" variant="secondary" onClick={toggleAccount}>{newAccount ? "로그인으로 전환" : "회원가입으로 전환"}</Button>
    </>
  )
}
export default Auth;