import ReactLoading from 'react-loading'

function LoadingSpin(){

  return(
    <div style={{marginTop: '25%'}}>
      <ReactLoading type="spin" color="##FF2D00"/>
    </div>
  )
}

export default LoadingSpin