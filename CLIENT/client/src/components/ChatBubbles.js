export default function ChatBubbles(props) {
  return (
    <>
      <li className={`${props.typer} rounded ml-1`}>
        <i>
          {/* <small style={{ fontSize: "10px" }}>{props.nameUser}</small> */}
          <small className='d-flex' style={{ fontSize: "15px", color:'#020913', justifyContent:'center', marginBottom:'-23px' }}>{props.nameUser}</small>
        </i>
        <br />
        <small style={{ fontSize: '15px'}}>{props.msg}</small>
      </li>
    </>
  );
}
